import loginHero from '@/assets/login-hero.png';
import poLogoSvg from '@/assets/po-logo-white.svg';
import { DasLink } from '@/components/ui/das-link';
import LanguageSelect from '@/components/language-select/language-select';
import { LoginForm } from '@/components/forms/login';
import useLogin from '@/hooks/login/useLogin';

function PaymentOptionsLogo() {
  return (
    <div className="flex items-center gap-3 pr-[15px]">
      <img
        src={poLogoSvg}
        alt="payment-options"
        aria-hidden
        className="h-[90px] w-auto object-contain"
      />
    </div>
  );
}

function LoginPage() {
  const { handleSubmit, error, loading } = useLogin();
  return (
    <div className="flex min-h-screen w-full bg-[#333]">
      {/* Left: Hero Panel */}
      <div className="relative w-1/2 shrink-0 overflow-hidden">
        <img
          src={loginHero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        {/* Gradient overlay matching Figma — rotated bottom-to-top white fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />
      </div>

      {/* Right: Sign-in Panel */}
      <div className="flex w-1/2 shrink-0 flex-col items-center justify-center gap-[62px] px-6 py-10">
        {/* Logo */}
        <PaymentOptionsLogo />

        {/* Glassmorphism sign-in card — exact Figma values */}
        <div
          className="flex w-full max-w-[584px] flex-col gap-[30px] rounded-[24px] p-[40px] backdrop-blur-[7.5px]"
          style={{
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.2), rgba(255,255,255,0))',
            boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.2)',
          }}
        >
          {/* Language selector */}
          <div className="flex h-[44px] items-center justify-end gap-[10px]">
            <div className="relative inline-flex items-center">
              <LanguageSelect />
            </div>
          </div>

          {/* Sign-in details: heading + inputs + button */}
          <div className="flex flex-col gap-[40px]">
            <p
              className="font-semibold text-[24px] leading-normal"
              style={{ color: '#ffffff', fontFamily: 'Inter, sans-serif' }}
            >
              Sign in to{' '}
              <span
                className="font-bold text-[28px]"
                style={{ color: '#f7941d', fontFamily: 'Inter, sans-serif' }}
              >
                Payment Options
              </span>
            </p>

            <LoginForm onSubmit={handleSubmit} loading={loading} error={error} />
          </div>

          {/* Footer links */}
          <div className="flex items-center justify-between">
            <DasLink to="/forgot-password">Forgot Password?</DasLink>
            <DasLink to="/choose-account-type">Create a new account</DasLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
