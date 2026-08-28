import { redirect } from 'next/navigation';

export default function LegacyExamStartPage() {
  redirect('/?mode=online_exam#learning-explorer');
}
