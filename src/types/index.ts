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
