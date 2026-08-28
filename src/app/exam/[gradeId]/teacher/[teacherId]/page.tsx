import { redirect } from 'next/navigation';

export default async function LegacyExamTeacherPage({
  params,
}: {
  params: Promise<{ gradeId: string; teacherId: string }>;
}) {
  const { gradeId } = await params;

  redirect(`/?grade_id=${gradeId}&mode=online_exam#learning-explorer`);
}
