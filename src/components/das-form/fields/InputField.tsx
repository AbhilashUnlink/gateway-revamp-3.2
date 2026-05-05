import { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { DasIcon } from '@/components/ui/DasIcon';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import type { InputFieldSchema } from '@/types/form/form.types';

interface InputFieldProps {
  field: InputFieldSchema;
}

export function InputField({ field }: InputFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  const iconName = field.icon;
  const suffix = field.suffix;
  const isPassword = field.inputType === 'password';
  const resolvedType = isPassword
    ? showPassword
      ? 'text'
      : 'password'
    : (field.inputType ?? 'text');
  const error = errors[field.name]?.message as string | undefined;

  return (
    <div className="flex flex-col gap-2">
      {field.label && (
        <label htmlFor={field.name} className="text-sm font-medium text-[#1a1a1a]">
          {field.label}
        </label>
      )}
      <div className="relative flex items-center">
        {iconName && (
          <DasIcon
            name={iconName}
            className="pointer-events-none absolute left-4 h-5 w-5 shrink-0 text-[#f7941d]"
            aria-hidden="true"
          />
        )}
        <Controller
          name={field.name}
          control={control}
          rules={field.rules}
          render={({ field: rhfField }) => (
            <Input
              id={field.name}
              type={resolvedType}
              placeholder={field.placeholder}
              disabled={field.disabled}
              autoComplete={isPassword ? 'current-password' : undefined}
              className={cn(
                'h-13 w-full rounded-lg border border-[#e5e5e5] bg-white',
                'text-sm leading-5 text-neutral-800 placeholder:text-[#808080]',
                'outline-none focus:ring-2 focus:ring-[#f7941d]/40 box-border',
                iconName ? 'pl-12' : 'pl-4',
                isPassword ? 'pr-12' : suffix ? 'pr-14' : 'pr-4',
                error && 'border-red-400 focus:ring-red-300/40'
              )}
              {...rhfField}
              value={rhfField.value ?? ''}
            />
          )}
        />
        {isPassword && (
          <Button
            type="button"
            variant="icon"
            size="icon"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-4 text-[#808080] hover:text-[#1a1a1a] hover:opacity-100"
          >
            {showPassword ? (
              <DasIcon name="eye-off" className="h-5 w-5" />
            ) : (
              <DasIcon name="eye" className="h-5 w-5" />
            )}
          </Button>
        )}
        {!isPassword && suffix && (
          <span className="pointer-events-none absolute right-4 text-sm font-medium text-[#808080]">
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <p role="alert" className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
