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
  app_title?: string | null;
  grade_id?: number | null;
  grade_title?: string | null;
  grade_number?: number | null;
  title: string;
  slug: string;
  cover: string | null;
  academic_year: string | null;
  pages_count: number | null;
  description: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface Chapter {
  id: number;
  book_id: number;
  title: string;
  section_id?: number | null;
  chapter_id?: number | null;
  slug: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface Section {
  id: number;
  chapter_id: number;
  title: string;
  slug: string;
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
  id?: number;
  video_url: string | null;
  duration: number | null;
  thumbnail_url: string | null;
  quality?: string | null;
  file_size?: number | null;
  views_count?: number | null;
  download_allowed?: boolean;
  created_at?: string | null;
}

export interface PdfFile {
  id?: number;
  file: string | null;
  view_url?: string | null;
  original_name?: string | null;
  title?: string | null;
  file_size?: number | null;
  download_allowed?: boolean;
}

export interface SampleQuestionFile {
  id: number;
  original_name: string | null;
  extension: string | null;
  file_size: number | null;
  file_size_readable: string | null;
  download_allowed: boolean;
  url: string | null;
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
  chapter_id: number | null;
  section_id: number | null;
  content_type_id: number;
  title: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  is_free: boolean;
  has_access: boolean;
  sort_order: number;
  page_number?: string | null;
  section?: Section | null;
  content_type: ContentType | null;
  video: Video | null;
  pdf_file: PdfFile | null;
  sample_questions?: SampleQuestionFile[] | null;
  step_by_step: StepByStep | null;
}

export interface QuestionOption {
  id: number;
  option_text: string | null;
  image_path: string | null;
}

export interface Question {
  id: number;
  question_text: string | null;
  image_path: string | null;
  default_score: number;
  options: QuestionOption[];
}

export interface QuizDetail {
  id: number;
  title: string;
  description: string | null;
  questions_count: number;
  time_limit: number | null;
  passing_percentage: number | null;
  is_free: boolean;
  questions: Question[];
}

export interface QuizResult {
  quiz?: { id: number; title: string };
  grade?: {
    id: number;
    number: number;
    title: string;
    is_primary: boolean;
  } | null;
  score: {
    total: number;
    earned: number;
    percentage: number;
  };
  statistics: {
    correct_answers: number;
    wrong_answers: number;
    unanswered: number;
  };
  status: string;
  descriptive_assessment?: {
    label: string;
    message: string;
    tone: 'excellent' | 'good' | 'acceptable' | 'needs_practice';
  };
  feedback?: Array<{
    number: number;
    question: string | null;
    question_image: string | null;
    is_correct: boolean;
    is_answered: boolean;
    selected_answer: string | null;
    selected_answer_image: string | null;
    correct_answer: string | null;
    correct_answer_image: string | null;
    explanation: string | null;
    explanation_image: string | null;
    recommendation: string | null;
    difficulty: string | null;
  }>;
}

export interface QuizSummaryItem {
  id: number;
  title: string;
  section_id?: number | null;
  chapter_id?: number | null;
  section_title?: string | null;
  chapter_title?: string | null;
  question_count: number;
  is_free: boolean;
  has_access: boolean;
}

export interface QuizSummary {
  section: QuizSummaryItem[];
  chapter: QuizSummaryItem[];
  book: QuizSummaryItem[];
}
