import { AuthLayout } from "../../components/layout/AuthLayout";
import { AuthTabs } from "../../components/auth/AuthTabs";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { Input } from "../../components/ui/Input";
import { PasswordInput } from "../../components/auth/PasswordInput";
import { Checkbox } from "../../components/auth/Checkbox";
import { LinkGold } from "../../components/auth/LinkGold";
import { Button } from "../../components/ui/Button";
import { useState } from "react";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setform] = useState({ email: "", password: "" });
  const [formError, setFormError] = useState("");
  const [errors, seterrors] = useState({});
  const [isSubmiting, setIsSubmiting] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setform((prev) => ({ ...prev, [name]: value }));

    seterrors((prev) => ({ ...prev, [name]: "" }));
    setFormError("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    seterrors({});
    setFormError("");
    let newErrors = {};
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    }
    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    }
    if (Object.keys(newErrors).length > 0) {
      seterrors(newErrors);
      return;
    }
    setIsSubmiting(true);
    try {
      const result = await login(form);
      if (!result.success) {
        setFormError(result.message);
        return;
      }
      navigate("/");
    } catch (error) {
      setFormError(
        error?.response?.data?.message ||
          "Invalid email or password. Please try again.",
      );
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
      <AuthTabs active="login" />

      <SectionLabel>Welcome Back</SectionLabel>
      <h2 className="font-serif text-3xl font-bold mb-2">Sign In</h2>
      <p className="text-sm text-text-muted leading-relaxed mb-10">
        Access your notes, case law bookmarks and lecture history.
      </p>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          name="email"
          value={form.email}
          error={errors.email}
          onChange={handleChange}
        />
        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          name="password"
          value={form.password}
          error={errors.password}
          onChange={handleChange}
        />
        {formError && <p className="text-sm text-red-400 -mt-1">{formError}</p>}
        <div className="flex items-center justify-between -mt-1.5">
          <Checkbox id="remember" label="Keep me signed in" />
          <LinkGold path={"/forgot-password"}>Forgot password?</LinkGold>
        </div>

        <Button
          className="w-full text-center mt-1"
          type="submit"
          disabled={isSubmiting}
        >
          {isSubmiting ? "Signing In…" : "Sign In →"}
        </Button>
      </form>

      <p className="text-center mt-8 text-sm text-text-muted">
        Don't have an account?{" "}
        <LinkGold path={"/register"}>Create one</LinkGold>
      </p>
    </AuthLayout>
  );
}
