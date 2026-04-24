import type { ReactNode } from 'react';
import loginHero from '@/assets/login-hero.png';
import poLogoSvg from '@/assets/po-logo-white.svg';

interface AuthLayoutProps {
  children: ReactNode;
}

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-[#333]">
      {/* Left: Hero Panel */}
      <div className="relative w-1/2 shrink-0 overflow-hidden">
        <img
          src={loginHero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />
      </div>

      {/* Right: Panel */}
      <div className="flex w-1/2 shrink-0 flex-col items-center justify-center gap-[62px] px-6 py-10">
        {/* Logo */}
        <div className="flex items-center gap-3 pr-[15px]">
          <img
            src={poLogoSvg}
            alt="payment-options"
            aria-hidden
            className="h-[90px] w-auto object-contain"
          />
        </div>

        {/* Glassmorphic card */}
        <div
          className="flex w-full max-w-[584px] flex-col gap-[30px] rounded-[24px] p-[40px] backdrop-blur-[7.5px]"
          style={{
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.2), rgba(255,255,255,0))',
            boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.2)',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
