import { AuthLayout } from '../../components/layout/AuthLayout';
import { AuthTabs } from '../../components/auth/AuthTabs';
import { SectionLabel } from '../../components/ui/SectionLabel';
import { Input } from '../../components/ui/Input';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { PasswordStrengthMeter } from '../../components/auth/PasswordStrengthMeter';
import { Checkbox } from '../../components/auth/Checkbox';
import { LinkGold } from '../../components/auth/LinkGold';
import { Button } from '../../components/ui/Button';

export default function Register() {
  return (
    <AuthLayout
      tag="Est. for the Next Generation of Counsel"
      heading={<>Your Practice<br />Begins with <em className="text-gold not-italic italic">Precedent</em></>}
      subtext="Sign in to pick up your notes where you left off, track landmark cases, and keep pace with lectures from practising barristers."
      quote={{ text: 'Audi alteram partem — hear the other side.', author: 'A Principle of Natural Justice' }}
    >
      <AuthTabs active="register" />

      <SectionLabel>Join JurisPoint</SectionLabel>
      <h2 className="font-serif text-3xl font-bold mb-2">Create Your Account</h2>
      <p className="text-sm text-text-muted leading-relaxed mb-10">
        Free to join. Upgrade any time for premium notes and lectures.
      </p>

      <form className="flex flex-col gap-5">
        <Input label="Full Name" type="text" placeholder="e.g. Ali" />
        <Input label="Email Address" type="email" placeholder="you@example.com" />

        <div>
          <PasswordInput label="Password" placeholder="Create a strong password" />
          <PasswordStrengthMeter filled={2} level="mid" label="Medium — add a symbol for a stronger password" />
        </div>

        <PasswordInput label="Confirm Password" placeholder="Re-enter your password" />

        <Checkbox
          id="terms"
          label={<>I agree to the <LinkGold className="inline">Terms</LinkGold> & <LinkGold className="inline">Privacy Policy</LinkGold></>}
        />

        <Button className="w-full text-center mt-1">Create Account →</Button>
      </form>


      <p className="text-center mt-8 text-sm text-text-muted">
        Already have an account? <LinkGold path={"/login"}>Sign in</LinkGold>
      </p>
    </AuthLayout>
  );
}
