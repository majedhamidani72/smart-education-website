import { redirect } from 'next/navigation';

export default function LegacyExamPage() {
  redirect('/?mode=online_exam#learning-explorer');
}
