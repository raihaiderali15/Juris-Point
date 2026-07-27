import { AuthLayout } from '../../components/layout/AuthLayout';
import { StatusPanel } from '../../components/auth/StatusPanel';
import { LinkGold } from '../../components/auth/LinkGold';
import { Button } from '../../components/ui/Button';

/**
 * VerifyEmailSent — confirmation screen shown after the verification
 * email has gone out. Same visual family as ForgotPasswordSent.
 */
export default function VerifyEmailSent() {
  return (
    <AuthLayout
      tag="Est. for the Next Generation of Counsel"
      heading={<>Your Practice<br />Begins with <em className="text-gold not-italic italic">Precedent</em></>}
      subtext="Sign in to pick up your notes where you left off, track landmark cases, and keep pace with lectures from practising barristers."
    >
      <StatusPanel
        icon="📩"
        title="Verification Email Sent"
        description={<>We've sent a verification link to <strong className="text-text font-semibold">you@example.com</strong>. Click it to activate your account.</>}
        action={<Button variant="outline" className="w-full text-center mb-4">Resend Email</Button>}
      />
      <p className="text-center text-sm text-text-muted">
        <LinkGold to="/login">← Back to Sign In</LinkGold>
      </p>
    </AuthLayout>
  );
}
