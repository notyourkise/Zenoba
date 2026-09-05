export class AssessmentNotFoundError extends Error {
  readonly code = "ASSESSMENT_NOT_FOUND";
  constructor(message = "Asesmen tidak ditemukan") {
    super(message);
    this.name = "AssessmentNotFoundError";
  }
}

export class AssessmentMismatchError extends Error {
  readonly code = "ASSESSMENT_MISMATCH";
  constructor(message = "Asesmen tidak sesuai dengan materi yang diminta") {
    super(message);
    this.name = "AssessmentMismatchError";
  }
}

export class AssessmentLockedError extends Error {
  readonly code = "ASSESSMENT_LOCKED";
  constructor(message = "Materi masih terkunci. Selesaikan materi prasyarat terlebih dahulu.") {
    super(message);
    this.name = "AssessmentLockedError";
  }
}

export class AssessmentConflictError extends Error {
  readonly code = "ASSESSMENT_CONFLICT";
  constructor(message = "Request ID telah digunakan untuk pengiriman jawaban yang berbeda") {
    super(message);
    this.name = "AssessmentConflictError";
  }
}

export class AssessmentIncompleteError extends Error {
  readonly code = "ASSESSMENT_INCOMPLETE";
  constructor(message = "Belum memenuhi kriteria kelulusan asesmen") {
    super(message);
    this.name = "AssessmentIncompleteError";
  }
}
