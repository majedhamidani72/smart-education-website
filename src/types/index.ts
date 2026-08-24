export interface Grade {
  id: number;
  title: string;
  grade_number: number;
}

export interface Teacher {
  id: number;
  name: string;
}

export interface Book {
  id: number;
  app_grade_subject_id: number | null;
  title: string;
  slug: string;
  cover: string | null;
  academic_year: string | null;
  pages_count: number | null;
  description: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface ContentType {
  id: number;
  title: string;
  slug: string;
}

export interface Video {
  video_url: string | null;
  duration: number | null;
  thumbnail_url: string | null;
}

export interface PdfFile {
  file: string | null;
}

export interface StepByStepPage {
  id: number;
  page_number: number;
  image: string | null;
}

export interface StepByStep {
  id: number;
  pages: StepByStepPage[];
}

export interface ContentItem {
  id: number;
  section_id: number | null;
  content_type_id: number;
  title: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  is_free: boolean;
  has_access: boolean;
  sort_order: number;
  content_type: ContentType | null;
  video: Video | null;
  pdf_file: PdfFile | null;
  step_by_step: StepByStep | null;
}

export interface QuizSummaryItem {
  id: number;
  title: string;
  section_title?: string | null;
  chapter_title?: string | null;
  question_count: number;
  is_free: boolean;
}

export interface QuizSummary {
  section: QuizSummaryItem[];
  chapter: QuizSummaryItem[];
  book: QuizSummaryItem[];
}
