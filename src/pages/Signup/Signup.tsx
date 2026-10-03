import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { FormInput } from '../../components/ui/FormInput';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { useLanguage } from '../../i18n/LanguageContext';

export const Signup: React.FC = () => {
  const { signup } = useAuth();
  const { t } = useLanguage();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {
    setError('');
    
    if (!formData.fullName || !formData.mobile || !formData.password) {
      setError(t('Please fill in all required details.'));
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t('Passwords do not match.'));
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    try {
      await signup(formData);
    } catch (err: any) {
      setError(err.message || t('Unable to create account. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-1.5 mb-5">
        <h2 className="text-[26px] font-semibold text-text-primary tracking-tight leading-tight">{t('Create your account')}</h2>
        <p className="text-[14px] text-text-secondary leading-relaxed">{t('Join AquaVolt AI and start managing your farm.')}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col">
        {error && (
          <div className="p-3 bg-[#FBEBEA]/80 border border-[#F5C2C0] rounded-xl mb-4" role="alert">
            <p className="text-[13px] text-warning font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 mb-3 lg:mb-4">
          <FormInput label={t('Full name *')} name="fullName" value={formData.fullName} onChange={handleChange} required />
          <FormInput label={t('Mobile number *')} name="mobile" type="tel" value={formData.mobile} onChange={handleChange} required />
        </div>
        
        <div className="mb-3 lg:mb-4">
          <FormInput label={t('Email address (optional)')} name="email" type="email" value={formData.email} onChange={handleChange} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 mb-5 lg:mb-6">
          <PasswordInput label={t('Password *')} name="password" value={formData.password} onChange={handleChange} required />
          <PasswordInput label={t('Confirm password *')} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
        </div>

        <div className="mb-4">
          <Button type="submit" variant="primary" fullWidth isLoading={isLoading} aria-label={t('Create account')}>
            {t('Create account')}
          </Button>
        </div>

        <p className="text-center text-[13px] text-text-secondary pt-4 border-t border-border-main/50">
          {t('Already have an account?')}
          <Link to="/login" className="font-semibold text-farm-green hover:text-forest-green transition-colors ml-1">
            {t('Log in instead →')}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};
