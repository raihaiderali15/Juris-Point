import { AuthLayout } from "../../components/layout/AuthLayout";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { PasswordInput } from "../../components/auth/PasswordInput";
import { Button } from "../../components/ui/Button";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/authContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { resetPassword ,email} = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [form, setForm] = useState({
    token: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value, token: token }));
    setError({});
    setFormError("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!form.password.trim()) {
      newErrors.password = "Password is Requird";
    }
    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm Password is Required";
    }
    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await resetPassword(form);
      if (response.success) {
        toast.success(`${response.message}`);
        navigate("/login");
      }
      if (!response.success) {
        setFormError(`${response.message}`);
      }
    } finally {
      setIsSubmitting(false);
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
    >
      <SectionLabel>Account Recovery</SectionLabel>
      <h2 className="font-serif text-3xl font-bold mb-2">Set a New Password</h2>
      <p className="text-sm text-text-muted leading-relaxed mb-10">
        Choose a new password for{" "}
        <strong className="text-text">{email || "you@gmail.com"}</strong>.
      </p>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div>
          <PasswordInput
            label="New Password"
            placeholder="Enter new password"
            name="password"
            value={form.password}
            error={error.password}
            onChange={handleChange}
          />
          <p className="text-xs text-text-muted mt-1">
            Minimum 8 characters, one number, one symbol.
          </p>
        </div>

        <div>
          <PasswordInput
            label="Confirm New Password"
            placeholder="Re-enter new password"
            className="border-error"
            name="confirmPassword"
            value={form.confirmPassword}
            error={error.confirmPassword}
            onChange={handleChange}
          />
        </div>
          {formError && <p className="text-sm text-red-400 -mt-1">{formError}</p>}
        <Button
          className="w-full text-center mt-1"
          type="submit"
          disabled={isSubmitting}
        >{`${isSubmitting ? "Reseting Password ..." : "Reset Password → "} `}</Button>
      </form>
    </AuthLayout>
  );
}
