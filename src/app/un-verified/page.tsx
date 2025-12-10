import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import ReVerifyEmailPage from '@/components/ReVerifyEmail';

export default async function ReVerifyEmailWrapper() {
  const user = await getCurrentUser();

  if (!user) redirect('/login'); // no user → go to login
  if (user.isVerified) redirect('/candidate/resume'); // already verified

  return <ReVerifyEmailPage email={user.email} isVerified={user.isVerified} />;
}
