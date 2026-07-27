import { AuthLayout } from '../../components/layout/AuthLayout';
import { BackLink } from '../../components/auth/BackLink';
import { SectionLabel } from '../../components/ui/SectionLabel';
import { Input } from '../../components/ui/Input';
import { LinkGold } from '../../components/auth/LinkGold';
import { Button } from '../../components/ui/Button';
import { useState } from 'react';
import { useAuth } from '../../context/authContext';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
export default function ForgotPassword() {
  const {forgotPassword,emailStore} = useAuth()
  const navigate= useNavigate()
    const [email, setEmail] = useState({email:""});
    const [formError, setformError] = useState("")
    const [error, setError] = useState("")
    const [isSubmitting, setisSubmitting] = useState(false)
    const handleChange=(e)=>{
      setEmail({...email,email:e.target.value})
      setError("")
    }
    const handleSubmit=async (e)=>
      {
        e.preventDefault();
     let newError={}
        if(!email.email.trim()){
          newError="Email is required"
        }
        if(Object.keys(newError).length>0){
        setError(newError);
        return
        }
        try{
          setisSubmitting(true);
          
          const response= await  forgotPassword(email)
          toast.success(`${response.message}`)
          emailStore(email)
          navigate("/forgot-password-send",{state:{email}})
        }finally{
          setisSubmitting(false)
        }
      }
  return (
    <AuthLayout
      tag="Est. for the Next Generation of Counsel"
      heading={<>Your Practice<br />Begins with <em className="text-gold not-italic italic">Precedent</em></>}
      subtext="Sign in to pick up your notes where you left off, track landmark cases, and keep pace with lectures from practising barristers."
    >
      <BackLink to="/login">Back to Sign In</BackLink>

      <SectionLabel>Account Recovery</SectionLabel>
      <h2 className="font-serif text-3xl font-bold mb-2">Forgot Password</h2>
      <p className="text-sm text-text-muted leading-relaxed mb-10">
        Enter the email tied to your account and we'll send a link to reset your password.
      </p>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <Input label="Email Address" type="email" placeholder="you@example.com"  value={email.email} error={error}  onChange={handleChange} />
        <Button className="w-full text-center mt-1" type="submit" disabled={isSubmitting}>{isSubmitting?"Sending Rest Link…":"Send Reset Link →"}</Button>
      </form>

      <p className="text-center mt-8 text-sm text-text-muted">
        Remembered it? <LinkGold to="/login">Sign in instead</LinkGold>
      </p>
    </AuthLayout>
  );
}
