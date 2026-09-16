import { prisma } from "@/lib/db/client";
import { getCurriculumGraph } from "../queries";

export interface UserBookmarkItem {
  id: string;
  lessonId: string;
  createdAt: Date;
  isStale: boolean;
  lesson: {
    title: string;
    slug: string;
    moduleSlug: string;
    moduleTitle: string;
    pathSlug: string;
    pathTitle: string;
    href: string;
  } | null;
}

export interface ToggleBookmarkResult {
  bookmarked: boolean;
  bookmarkId?: string;
}

/**
 * Toggles a bookmark for a given user and lesson.
 * If already bookmarked, deletes the bookmark.
 * If not bookmarked, creates it.
 *
 * Jaminan Non-Interference: Tidak pernah mengubah atau memicu XP,
 * progress pelajaran (UserLessonProgress), atau assessment attempt.
 */
export async function toggleBookmark(
  userId: string,
  lessonId: string
): Promise<ToggleBookmarkResult> {
  const trimmedUser = userId?.trim();
  const trimmedLesson = lessonId?.trim();

  if (!trimmedUser || !trimmedLesson) {
    throw new Error("userId dan lessonId wajib diisi.");
  }

  const existing = await prisma.lessonBookmark.findUnique({
    where: {
      userId_lessonId: {
        userId: trimmedUser,
        lessonId: trimmedLesson,
      },
    },
  });

  if (existing) {
    await prisma.lessonBookmark.deleteMany({
      where: {
        userId: trimmedUser,
        lessonId: trimmedLesson,
      },
    });
    return { bookmarked: false };
  }

  const created = await prisma.lessonBookmark.create({
    data: {
      userId: trimmedUser,
      lessonId: trimmedLesson,
    },
  });

  return { bookmarked: true, bookmarkId: created.id };
}

/**
 * Checks if a lesson is currently bookmarked by the user.
 */
export async function isLessonBookmarked(
  userId?: string | null,
  lessonId?: string | null
): Promise<boolean> {
  if (!userId || !lessonId) return false;

  const existing = await prisma.lessonBookmark.findUnique({
    where: {
      userId_lessonId: {
        userId,
        lessonId,
      },
    },
  });

  return Boolean(existing);
}

/**
 * Fetches all bookmarks for a user, resolving metadata against the curriculum.
 * Stale or deleted lesson references are returned as isStale: true with lesson: null
 * rather than throwing, allowing clean recovery.
 */
export async function getUserBookmarks(userId: string): Promise<UserBookmarkItem[]> {
  if (!userId) return [];

  const bookmarks = await prisma.lessonBookmark.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (bookmarks.length === 0) return [];

  const curriculum = await getCurriculumGraph();

  // Create lookup map for lessons
  const lessonLookup = new Map<
    string,
    {
      title: string;
      slug: string;
      moduleSlug: string;
      moduleTitle: string;
      pathSlug: string;
      pathTitle: string;
      href: string;
    }
  >();

  for (const path of curriculum.paths) {
    for (const mod of path.modules) {
      for (const lesson of mod.lessons) {
        lessonLookup.set(lesson.id, {
          title: lesson.title,
          slug: lesson.slug,
          moduleSlug: mod.slug,
          moduleTitle: mod.title,
          pathSlug: path.slug,
          pathTitle: path.title,
          href: `/learn/${path.slug}/${mod.slug}/${lesson.slug}`,
        });
      }
    }
  }

  return bookmarks.map((bm) => {
    const lessonMeta = lessonLookup.get(bm.lessonId);
    if (!lessonMeta) {
      return {
        id: bm.id,
        lessonId: bm.lessonId,
        createdAt: bm.createdAt,
        isStale: true,
        lesson: null,
      };
    }

    return {
      id: bm.id,
      lessonId: bm.lessonId,
      createdAt: bm.createdAt,
      isStale: false,
      lesson: lessonMeta,
    };
  });
}
