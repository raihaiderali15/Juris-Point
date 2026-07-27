import { AuthLayout } from '../../components/layout/AuthLayout';
import { SectionLabel } from '../../components/ui/SectionLabel';
import { Button } from '../../components/ui/Button';
import { LinkGold } from '../../components/auth/LinkGold';

/**
 * VerifyEmailPrompt — shown right after registration, before a verification
 * email has been sent/clicked. Distinct from VerifyEmailSent (the
 * confirmation screen after the email goes out).
 */
export default function VerifyEmailPrompt() {
  return (
    <AuthLayout
      tag="Est. for the Next Generation of Counsel"
      heading={<>Your Practice<br />Begins with <em className="text-gold not-italic italic">Precedent</em></>}
      subtext="Sign in to pick up your notes where you left off, track landmark cases, and keep pace with lectures from practising barristers."
    >
      <SectionLabel>One Last Step</SectionLabel>
      <h2 className="font-serif text-3xl font-bold mb-2">Verify Your Email</h2>
      <p className="text-sm text-text-muted leading-relaxed mb-10">
        Your account is almost ready. Confirm <strong className="text-text">you@example.com</strong> to
        unlock note downloads, case bookmarks and lecture access.
      </p>

      <Button className="w-full text-center mb-4">Send Verification Email →</Button>

      <p className="text-center text-sm text-text-muted">
        Wrong email? <LinkGold to="/register">Go back and edit</LinkGold>
      </p>
    </AuthLayout>
  );
}
