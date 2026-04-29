import type { ReactNode } from 'react';
import loginHero from '@/assets/login-hero.png';
import poLogoSvg from '@/assets/po-logo-white.svg';

interface AuthLayoutProps {
  children: ReactNode;
}

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-neutral-800">
      {/* Left: Hero Panel */}
      <div className="relative w-1/2 shrink-0 overflow-hidden hidden md:block">
        <img
          src={loginHero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-white/40 via-transparent to-transparent" />
      </div>

      {/* Right: Panel */}
      <div className="flex w-full md:w-1/2 shrink-0 flex-col items-center justify-center gap-16 px-6 py-10">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src={poLogoSvg} alt="payment-options" className="h-20 w-auto object-contain" />
        </div>

        {/* Glass Card */}
        <div
          className="w-full max-w-xl rounded-2xl flex flex-col gap-8 border border-white/20 bg-white/10
                        backdrop-blur-md
                        shadow-xl p-10"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
