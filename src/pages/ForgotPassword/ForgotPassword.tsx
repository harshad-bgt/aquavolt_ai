import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { FormInput } from '../../components/ui/FormInput';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { useLanguage } from '../../i18n/LanguageContext';

export const ForgotPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  const { t } = useLanguage();
  
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({ identifier: '' });

  const validate = () => {
    let isValid = true;
    const errors = { identifier: '' };

    if (!identifier.trim()) {
      errors.identifier = 'Please enter your mobile number or email.';
      isValid = false;
    } else if (identifier.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
      errors.identifier = 'Please enter a valid email address.';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validate()) return;

    setIsLoading(true);
    try {
      await resetPassword(identifier);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Unable to process your request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-2 mb-8">
        <h2 className="text-[28px] font-semibold text-text-primary tracking-tight">{t('Reset Password')}</h2>
        <p className="text-[15px] text-text-secondary leading-relaxed">
          {t("Enter your mobile number or email address, and we'll send you a link to reset your password.")}
        </p>
      </div>

      {success ? (
        <div className="space-y-6">
          <div className="p-4 bg-[#EAF8F0]/80 border border-[#A7E2C0] rounded-xl" role="alert">
            <p className="text-[14px] text-forest-green font-medium">
              {t("We've sent password reset instructions to your account.")}
            </p>
          </div>
          <Link to="/login" className="inline-block text-[14px] font-semibold text-farm-green hover:text-forest-green transition-colors">
            {t('← Back to Login')}
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col">
          {error && (
            <div className="p-3 bg-[#FBEBEA]/80 border border-[#F5C2C0] rounded-xl mb-4" role="alert">
              <p className="text-[13px] text-warning font-medium">{error}</p>
            </div>
          )}

          <div className="mb-5">
            <FormInput
              label={t('Mobile number or email *')}
              type="text"
              id="identifier"
              name="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              error={formErrors.identifier}
              autoComplete="username"
              required
            />
          </div>

          <div className="mb-5">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              aria-label={t('Send reset link')}
            >
              {t('Send reset link')}
            </Button>
          </div>
          
          <div className="text-center pt-5 border-t border-border-main/50">
            <Link to="/login" className="text-[13px] font-semibold text-farm-green hover:text-forest-green transition-colors">
              {t('← Back to Login')}
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};
