import { redirect } from 'next/navigation';

export default async function LegacyExamGradePage({
  params,
}: {
  params: Promise<{ gradeId: string }>;
}) {
  const { gradeId } = await params;

  redirect(`/?grade_id=${gradeId}&mode=online_exam#learning-explorer`);
}
