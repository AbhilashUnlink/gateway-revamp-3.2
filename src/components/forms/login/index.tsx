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
      {/* Heading */}
      <div className="mb-1">
        <h1 className="text-xl font-semibold text-white">
          Sign in to <span className="font-bold text-[#f5a623]">Payment Options</span>
        </h1>
      </div>

      {/* Email field */}
      <div className="flex flex-col gap-1.5">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          <input
            id="username"
            type="text"
            placeholder="Enter your registered Email Address"
            className="h-12 w-full rounded-lg border border-neutral-200 bg-white pl-11 pr-4 text-sm text-neutral-800 placeholder:text-neutral-400 transition-colors focus:border-[#f5a623] focus:outline-none focus:ring-2 focus:ring-[#f5a623]/20 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ paddingTop: '14px', paddingBottom: '14px' }}
            {...register('username', {
              required: 'Email is required',
              validate: (val) => emailRegex.test(String(val).toLowerCase()) || 'Invalid email',
            })}
          />
        </div>
        {errors.username && <p className="text-xs text-red-400">{errors.username.message}</p>}
      </div>

      {/* Password field */}
      <div className="flex flex-col gap-1.5">
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            className="h-12 w-full rounded-lg border border-neutral-200 bg-white pl-11 pr-11 text-sm text-neutral-800 placeholder:text-neutral-400 transition-colors focus:border-[#f5a623] focus:outline-none focus:ring-2 focus:ring-[#f5a623]/20 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ paddingTop: '14px', paddingBottom: '14px' }}
            {...register('password', { required: 'Password is required' })}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      {/* SIGN IN CTA */}
      <button
        type="submit"
        disabled={loading}
        className="mt-1 h-12 w-full rounded-lg bg-[#f5a623] text-sm font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Signing in…' : 'SIGN IN'}
      </button>

      {/* Footer links — left and right aligned */}
      <div className="flex items-center justify-between pt-1">
        <Link
          to="/forgot-password"
          className="text-sm font-medium text-[#f5a623] hover:underline hover:opacity-80 transition-opacity"
        >
          Forgot Password?
        </Link>
        <Link
          to="/sign-up"
          className="text-sm font-medium text-[#f5a623] hover:underline hover:opacity-80 transition-opacity"
        >
          Create a new account
        </Link>
      </div>
    </form>
  );
}
