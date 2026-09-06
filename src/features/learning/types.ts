export type LessonStatus = "LOCKED" | "AVAILABLE" | "IN_PROGRESS" | "COMPLETED";

export interface PrerequisiteInfo {
  id: string;
  title: string;
  slug: string;
  moduleSlug: string;
}

export interface LessonWithStatus {
  id: string;
  slug: string;
  title: string;
  description: string;
  orderIndex: number;
  xpReward: number;
  content?: unknown;
  status: LessonStatus;
  completedAt?: Date | string | null;
  prerequisites: PrerequisiteInfo[];
  unmetPrerequisites: PrerequisiteInfo[];
  outcomes?: Array<{ id: string; text: string; description?: string }>;
}

export interface ModuleFinalAssessmentInfo {
  assessmentId: string;
  title: string;
  description: string;
  conceptQuestionCount: number;
  conceptPassThreshold: number;
  practicalCriteriaCount: number;
  practicalPassThreshold: number;
}

export interface ModuleWithLessons {
  id: string;
  slug: string;
  title: string;
  description: string;
  orderIndex: number;
  lessons: LessonWithStatus[];
  progressPercent: number;
  completedCount: number;
  totalCount: number;
  outcomes?: Array<{ id: string; text: string; description?: string }>;
  finalAssessment?: ModuleFinalAssessmentInfo;
}

export interface LearningPathDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon?: string | null;
  orderIndex: number;
  modules: ModuleWithLessons[];
  progressPercent: number;
  completedLessonsCount: number;
  totalLessonsCount: number;
}
