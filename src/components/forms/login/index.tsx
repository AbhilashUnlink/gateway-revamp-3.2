import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export interface LoginFormValues {
  username: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void | Promise<void>;
  loading?: boolean;
  error?: string | null;
}

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function LoginForm({ onSubmit, loading, error }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* Form title */}
      <div className="mb-1">
        <h1 className="text-xl font-semibold text-neutral-800">Sign in to Payment Options</h1>
      </div>

      {/* Email field */}
      <div className="flex flex-col gap-1.5">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          <input
            id="username"
            type="text"
            placeholder="Enter your registered Email Address"
            className="h-11 w-full rounded-lg border border-neutral-200 bg-white/60 pl-10 pr-4 text-sm text-neutral-800 placeholder:text-neutral-400 transition-colors focus:border-[#F7941D] focus:outline-none focus:ring-2 focus:ring-[#F7941D]/20 disabled:cursor-not-allowed disabled:opacity-50"
            {...register('username', {
              required: 'Email is required',
              validate: (val) => emailRegex.test(String(val).toLowerCase()) || 'Invalid email',
            })}
          />
        </div>
        {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
      </div>

      {/* Password field */}
      <div className="flex flex-col gap-1.5">
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            className="h-11 w-full rounded-lg border border-neutral-200 bg-white/60 pl-10 pr-10 text-sm text-neutral-800 placeholder:text-neutral-400 transition-colors focus:border-[#F7941D] focus:outline-none focus:ring-2 focus:ring-[#F7941D]/20 disabled:cursor-not-allowed disabled:opacity-50"
            {...register('password', { required: 'Password is required' })}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* Submit CTA */}
      <button
        type="submit"
        disabled={loading}
        className="mt-1 h-12 w-full rounded-[16px] bg-[#F7941D] text-sm font-semibold uppercase tracking-widest text-white shadow-md transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Signing in…' : 'SUBMIT'}
      </button>

      {/* Footer links */}
      <div className="flex flex-col items-center gap-2 pt-1">
        <Link
          to="/forgot-password"
          className="text-sm font-medium text-[#F7941D] underline underline-offset-2 hover:opacity-75 transition-opacity"
        >
          Forgot Password?
        </Link>
        <Link
          to="/sign-up"
          className="text-sm font-medium text-[#F7941D] underline underline-offset-2 hover:opacity-75 transition-opacity"
        >
          Create a new account
        </Link>
      </div>
    </form>
  );
}
