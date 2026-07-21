import { AuthLayout } from "../../components/layout/AuthLayout";
import { AuthTabs } from "../../components/auth/AuthTabs";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { Input } from "../../components/ui/Input";
import { PasswordInput } from "../../components/auth/PasswordInput";
import { PasswordStrengthMeter } from "../../components/auth/PasswordStrengthMeter";
import { Checkbox } from "../../components/auth/Checkbox";
import { LinkGold } from "../../components/auth/LinkGold";
import { Button } from "../../components/ui/Button";
import { useState } from "react";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState("");
  const [error, setError] = useState({});
  const [isSubmiting, setIsSubmiting] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: "" }));
    setFormError("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});
    setFormError("");
    let newErrors = {};
    if (!form.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    }
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    }
    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    }
    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required";
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Password and Confirm Password do not match";
      console.log("not matching");
    }
    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    setIsSubmiting(true);

    try {
      const response = await register(form);

      setFormError(response.message);
      
      if (response.success) {
      toast.success("Account created successfully.");
        navigate("/login");
      }
    } finally {
      setIsSubmiting(false);
    }
  };
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
      quote={{
        text: "Audi alteram partem — hear the other side.",
        author: "A Principle of Natural Justice",
      }}
    >
      <AuthTabs active="register" />

      <SectionLabel>Join JurisPoint</SectionLabel>
      <h2 className="font-serif text-3xl font-bold mb-2">
        Create Your Account
      </h2>
      <p className="text-sm text-text-muted leading-relaxed mb-10">
        Free to join. Upgrade any time for premium notes and lectures.
      </p>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <Input
          label="Full Name"
          type="text"
          placeholder="e.g. Ali"
          error={error.fullName}
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          error={error.email}
          value={form.email}
          name="email"
          onChange={handleChange}
        />

        <div>
          <PasswordInput
            label="Password"
            placeholder="Create a strong password"
            error={error.password}
            value={form.password}
            name="password"
            onChange={handleChange}
          />
          <PasswordStrengthMeter
            filled={2}
            level="mid"
            label="Medium — add a symbol for a stronger password"
          />
        </div>

        <PasswordInput
          label="Confirm Password"
          placeholder="Re-enter your password"
          error={error.confirmPassword}
          value={form.confirmPassword}
          name="confirmPassword"
          onChange={handleChange}
        />
        {formError && <p className="text-sm text-red-400 -mt-1">{formError}</p>}
        <Checkbox
          id="terms"
          label={
            <>
              I agree to the <LinkGold className="inline">Terms</LinkGold> &{" "}
              <LinkGold className="inline">Privacy Policy</LinkGold>
            </>
          }
        />

        <Button
          className="w-full text-center mt-1"
          type="submit"
          disabled={isSubmiting}
        >
          {isSubmiting ? "Creating Account…" : "Create Account →"}
        </Button>
      </form>

      <p className="text-center mt-8 text-sm text-text-muted">
        Already have an account? <LinkGold path={"/login"}>Sign in</LinkGold>
      </p>
    </AuthLayout>
  );
}
