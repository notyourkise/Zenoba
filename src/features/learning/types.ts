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
  status: LessonStatus;
  completedAt?: Date | string | null;
  prerequisites: PrerequisiteInfo[];
  unmetPrerequisites: PrerequisiteInfo[];
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
