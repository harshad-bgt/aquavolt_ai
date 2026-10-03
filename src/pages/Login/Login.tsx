import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { Button } from '../../components/ui/Button';
import { FormInput } from '../../components/ui/FormInput';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { AuthLayout } from '../../components/auth/AuthLayout';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({ identifier: '', password: '' });

  const validate = () => {
    let isValid = true;
    const errors = { identifier: '', password: '' };

    if (!identifier.trim()) {
      errors.identifier = 'Please enter your mobile number or email.';
      isValid = false;
    } else if (identifier.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
      errors.identifier = 'Please enter a valid email address.';
      isValid = false;
    }

    if (!password) {
      errors.password = 'Please enter your password.';
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
      await login({ identifier, password });
    } catch (err: any) {
      setError(err.message || 'Unable to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-1.5 mb-6">
        <h2 className="text-[26px] font-semibold text-text-primary tracking-tight leading-tight">{t('Welcome back')}</h2>
        <p className="text-[14px] text-text-secondary leading-relaxed">{t('Sign in to continue managing your farm.')}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col">
        {error && (
          <div className="p-3 bg-[#FBEBEA]/80 border border-[#F5C2C0] rounded-xl mb-4" role="alert">
            <p className="text-[13px] text-warning font-medium">{error}</p>
          </div>
        )}

        <div className="mb-4">
          <FormInput
            label={t('Mobile number or email *')}
            type="text"
            id="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            error={formErrors.identifier}
            autoComplete="username"
          />
        </div>

        <div className="mb-4">
          <PasswordInput
            label={t('Password *')}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={formErrors.password}
            autoComplete="current-password"
          />
        </div>

        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center space-x-2.5 cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-[#D8E1D9] text-farm-green focus:ring-farm-green/20 transition-colors cursor-pointer"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span className="text-[13px] font-medium text-text-primary group-hover:text-text-secondary transition-colors">
              {t('Remember me')}
            </span>
          </label>
          
          <Link to="/forgot-password" className="text-[13px] font-semibold text-farm-green hover:text-forest-green transition-colors">
            {t('Forgot password?')}
          </Link>
        </div>

        <div className="mb-5">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
          >
            {t('Login')}
          </Button>
        </div>
        
        <p className="text-center text-[13px] text-text-secondary pt-5 border-t border-border-main/50">
          {t("Don't have an account?")}{' '}
          <Link to="/signup" className="font-semibold text-farm-green hover:text-forest-green transition-colors ml-1">
            {t('Create one')}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};
