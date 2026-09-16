import type { LearningGraph } from "./continuation";
import { getCurriculumModule } from "./content/registry";

export interface SearchableCurriculumItem {
  lessonId: string;
  lessonSlug: string;
  lessonTitle: string;
  lessonDescription?: string;
  moduleSlug: string;
  moduleTitle: string;
  pathSlug: string;
  pathTitle: string;
  orderIndex: number;
  outcomes?: Array<{ id: string; text: string }>;
  href: string;
}

export type MatchField = "title" | "outcome" | "description" | "module" | "path";

export interface SearchResultItem extends SearchableCurriculumItem {
  score: number;
  matchedField: MatchField;
  matchSnippet?: string;
}

/**
 * Searches and ranks curriculum lessons based on query keyword matching.
 * Deterministic ranking:
 * - Exact full title match: +100
 * - Title contains full query: +70
 * - Title keyword hit: +40 each
 * - Outcome keyword hit: +25 each
 * - Description keyword hit: +15 each
 * - Module title keyword hit: +10 each
 * - Path title keyword hit: +5 each
 */
export function searchCurriculum(
  items: SearchableCurriculumItem[],
  query: string
): SearchResultItem[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  // Split query into tokens/keywords (deduplicated)
  const tokens = Array.from(new Set(trimmed.split(/\s+/).filter(Boolean)));
  if (tokens.length === 0) return [];

  const results: SearchResultItem[] = [];

  for (const item of items) {
    let titleScore = 0;
    let outcomeScore = 0;
    let descriptionScore = 0;
    let moduleScore = 0;
    let pathScore = 0;
    let matchedTokensCount = 0;

    let matchedOutcomeText: string | undefined;

    const titleLower = item.lessonTitle.toLowerCase();
    const descLower = (item.lessonDescription || "").toLowerCase();
    const modLower = item.moduleTitle.toLowerCase();
    const pathLower = item.pathTitle.toLowerCase();

    // Check exact full query matches
    if (titleLower === trimmed) {
      titleScore += 100;
    } else if (titleLower.includes(trimmed)) {
      titleScore += 60;
    }

    // Token-by-token scoring
    for (const token of tokens) {
      let tokenMatchedInItem = false;

      if (titleLower.includes(token)) {
        titleScore += 40;
        tokenMatchedInItem = true;
      }

      // Check learning outcomes
      if (item.outcomes) {
        for (const outcome of item.outcomes) {
          const outcomeLower = outcome.text.toLowerCase();
          if (outcomeLower.includes(token)) {
            outcomeScore += 25;
            tokenMatchedInItem = true;
            if (!matchedOutcomeText) {
              matchedOutcomeText = outcome.text;
            }
          }
        }
      }

      // Check description
      if (descLower.includes(token)) {
        descriptionScore += 15;
        tokenMatchedInItem = true;
      }

      // Check module title
      if (modLower.includes(token)) {
        moduleScore += 10;
        tokenMatchedInItem = true;
      }

      // Check path title
      if (pathLower.includes(token)) {
        pathScore += 5;
        tokenMatchedInItem = true;
      }

      if (tokenMatchedInItem) {
        matchedTokensCount++;
      }
    }

    if (matchedTokensCount > 0) {
      let score = titleScore + outcomeScore + descriptionScore + moduleScore + pathScore;
      score += matchedTokensCount * 40;
      if (matchedTokensCount === tokens.length && tokens.length > 1) {
        score += 50; // Bonus for matching all query keywords
      }

      // Determine primary matched field by highest contribution
      let matchedField: MatchField = "title";
      let snippet: string | undefined;

      const maxFieldScore = Math.max(
        titleScore,
        outcomeScore,
        descriptionScore,
        moduleScore,
        pathScore
      );

      if (maxFieldScore === outcomeScore && outcomeScore > 0 && outcomeScore >= titleScore) {
        matchedField = "outcome";
        snippet = matchedOutcomeText;
      } else if (maxFieldScore === titleScore && titleScore > 0) {
        matchedField = "title";
      } else if (maxFieldScore === descriptionScore && descriptionScore > 0) {
        matchedField = "description";
        snippet = item.lessonDescription;
      } else if (maxFieldScore === moduleScore && moduleScore > 0) {
        matchedField = "module";
      } else if (maxFieldScore === pathScore && pathScore > 0) {
        matchedField = "path";
      }

      results.push({
        ...item,
        score,
        matchedField,
        matchSnippet: snippet,
      });
    }
  }

  // Sort deterministically:
  // 1. Highest score first
  // 2. Path title ascending
  // 3. Module title ascending
  // 4. orderIndex ascending
  // 5. Lesson title ascending
  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.pathTitle !== b.pathTitle) return a.pathTitle.localeCompare(b.pathTitle);
    if (a.moduleTitle !== b.moduleTitle) return a.moduleTitle.localeCompare(b.moduleTitle);
    if (a.orderIndex !== b.orderIndex) return a.orderIndex - b.orderIndex;
    return a.lessonTitle.localeCompare(b.lessonTitle);
  });

  return results;
}

/**
 * Builds searchable projection items from the curriculum graph and registry.
 */
export function buildSearchIndex(curriculum: LearningGraph): SearchableCurriculumItem[] {
  const items: SearchableCurriculumItem[] = [];

  for (const path of curriculum.paths) {
    for (const mod of path.modules) {
      const curriculumMod = getCurriculumModule(mod.slug) || getCurriculumModule(mod.id);

      for (const lesson of mod.lessons) {
        const curriculumLesson = curriculumMod?.lessons.find(
          (cl) => cl.slug === lesson.slug || cl.id === lesson.id
        );

        items.push({
          lessonId: lesson.id,
          lessonSlug: lesson.slug,
          lessonTitle: lesson.title,
          lessonDescription: curriculumLesson?.description,
          moduleSlug: mod.slug,
          moduleTitle: mod.title,
          pathSlug: path.slug,
          pathTitle: path.title,
          orderIndex: lesson.orderIndex,
          outcomes: curriculumLesson?.outcomes?.map((o) => ({
            id: o.id,
            text: o.text,
          })) || curriculumMod?.outcomes?.map((o) => ({
            id: o.id,
            text: o.text,
          })),
          href: `/learn/${path.slug}/${mod.slug}/${lesson.slug}`,
        });
      }
    }
  }

  return items;
}
