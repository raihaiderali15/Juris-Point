import { AuthLayout } from "../../components/layout/AuthLayout";
import { StatusPanel } from "../../components/auth/StatusPanel";
import { LinkGold } from "../../components/auth/LinkGold";
import { Button } from "../../components/ui/Button";
import { useLocation, useNavigate } from "react-router-dom";

export default function ForgotPasswordSent() {
  const navigate = useNavigate();
  const location = useLocation();

  const { email } = location.state?.email || "you@example.com";
  return (
    <AuthLayout
      tag="Est. for the Next Generation of Counsel"
      heading={
        <>
          Your Practice
          <br />
          Begins with <em className="text-gold not-italic italic">Precedent</em>
        </>
      }
      subtext="Sign in to pick up your notes where you left off, track landmark cases, and keep pace with lectures from practising barristers."
    >
      <StatusPanel
        icon="✉"
        title="Check Your Inbox"
        description={
          <>
            We've sent a password reset link to{" "}
            <strong className="text-text font-semibold">{email}</strong>. The
            link expires in 10 minutes.
          </>
        }
        action={
          <Button
            variant="outline"
            className="w-full text-center mb-4"
            onClick={() => navigate("/forgot-password")}
          >
            Resend Email
          </Button>
        }
      />
      <p className="text-center text-sm text-text-muted">
        <LinkGold to="/login">← Back to Sign In</LinkGold>
      </p>
    </AuthLayout>
  );
}
