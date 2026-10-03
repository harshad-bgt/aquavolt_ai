import React, { useState } from 'react';
import { useOnboarding } from '../../context/OnboardingContext';
import { Button } from '../../components/ui/Button';
import { FormInput } from '../../components/ui/FormInput';
import { ProgressIndicator } from '../../components/ui/ProgressIndicator';
import { Card } from '../../components/ui/Card';
import { Logo } from '../../components/ui/Logo';
import { useLanguage } from '../../i18n/LanguageContext';

export const Onboarding: React.FC = () => {
  const { farmProfile, saveProfile, isLoading } = useOnboarding();
  const { t } = useLanguage();
  
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const [error, setError] = useState('');

  // Form State for Onboarding (Steps 2-6 from old Signup)
  const [formData, setFormData] = useState({
    // Step 1: Farm
    farmName: farmProfile?.farmName || '',
    location: farmProfile?.location || '',
    farmArea: farmProfile?.farmArea || '',
    numberOfFields: farmProfile?.numberOfFields || '',
    
    // Step 2: Crop
    crop: farmProfile?.crop || '',
    growthStage: farmProfile?.growthStage || '',
    sowingDate: farmProfile?.sowingDate || '',
    
    // Step 3: Water
    waterSource: farmProfile?.waterSource || '',
    borewellDepth: farmProfile?.borewellDepth || '',
    irrigationMethod: farmProfile?.irrigationMethod || '',
    
    // Step 4: Pump
    pumpType: farmProfile?.pumpType || '',
    pumpCapacity: farmProfile?.pumpCapacity || '',
    pumpRating: farmProfile?.pumpRating || '',
    pumpAge: farmProfile?.pumpAge || '',
    
    // Step 5: Solar
    solarPump: farmProfile?.solarPump || 'no',
    solarCapacity: farmProfile?.solarCapacity || '',
    panelCapacity: farmProfile?.panelCapacity || '',
    battery: farmProfile?.battery || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateStep = (currentStep: number) => {
    setError('');
    
    if (currentStep === 1) {
      if (!formData.farmName || !formData.location) {
        setError('Farm name and location are required.');
        return false;
      }
      if (formData.farmArea && Number(formData.farmArea) <= 0) {
        setError('Farm area must be a positive number.');
        return false;
      }
      if (formData.numberOfFields && Number(formData.numberOfFields) <= 0) {
        setError('Number of fields must be a positive number.');
        return false;
      }
    }

    if (currentStep === 2) {
      if (!formData.crop || !formData.growthStage) {
        setError('Crop name and growth stage are required.');
        return false;
      }
    }

    if (currentStep === 3) {
      if (!formData.waterSource) {
        setError('Please select a water source.');
        return false;
      }
      if (formData.waterSource === 'borewell' && !formData.borewellDepth) {
        setError('Borewell depth is required when water source is borewell.');
        return false;
      }
      if (formData.borewellDepth && Number(formData.borewellDepth) <= 0) {
        setError('Borewell depth must be a positive number.');
        return false;
      }
    }

    if (currentStep === 4) {
      if (!formData.pumpType || !formData.pumpCapacity) {
        setError('Pump type and capacity are required.');
        return false;
      }
      if (formData.pumpCapacity && Number(formData.pumpCapacity) <= 0) {
        setError('Pump capacity must be a positive number.');
        return false;
      }
      if (formData.pumpAge && Number(formData.pumpAge) < 0) {
        setError('Pump age cannot be negative.');
        return false;
      }
    }

    if (currentStep === 5) {
      if (formData.solarPump === 'yes') {
        if (!formData.solarCapacity) {
          setError('Solar capacity is required if a solar pump is installed.');
          return false;
        }
        if (Number(formData.solarCapacity) <= 0) {
          setError('Solar capacity must be a positive number.');
          return false;
        }
      }
    }
    
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setError('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;
    try {
      await saveProfile(formData);
    } catch (err: any) {
      setError(err.message || 'Unable to save profile. Please try again.');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-text-primary">{t('Farm Profile')}</h3>
            <p className="text-sm text-text-secondary mb-4">{t('Tell us about your farm.')}</p>
            <FormInput label="Farm name *" name="farmName" value={formData.farmName} onChange={handleChange} required />
            <FormInput label="Location (Village/District) *" name="location" value={formData.location} onChange={handleChange} required />
            <FormInput label="Farm area (in acres) (optional)" name="farmArea" type="number" min="0.1" step="0.1" value={formData.farmArea} onChange={handleChange} />
            <FormInput label="Number of fields (optional)" name="numberOfFields" type="number" min="1" value={formData.numberOfFields} onChange={handleChange} />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-text-primary">{t('Crop Information')}</h3>
            <p className="text-sm text-text-secondary mb-4">{t('What are you currently growing?')}</p>
            <FormInput label="Crop name *" name="crop" value={formData.crop} onChange={handleChange} required />
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="growthStage" className="text-sm font-medium text-text-primary">Growth stage *</label>
              <select id="growthStage" name="growthStage" value={formData.growthStage} onChange={handleChange} required className="h-11 w-full rounded-md border border-border-main bg-surface px-3 py-2 text-base text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-farm-green">
                <option value="">Select stage</option>
                <option value="seedling">Seedling</option>
                <option value="vegetative">Vegetative</option>
                <option value="flowering">Flowering</option>
                <option value="fruiting">Fruiting/Yielding</option>
                <option value="harvest">Ready for Harvest</option>
              </select>
            </div>
            <FormInput label="Sowing date (optional)" name="sowingDate" type="date" value={formData.sowingDate} onChange={handleChange} />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-text-primary">{t('Water Source')}</h3>
            <p className="text-sm text-text-secondary mb-4">{t('How do you irrigate your farm?')}</p>
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="waterSource" className="text-sm font-medium text-text-primary">Water Source *</label>
              <select id="waterSource" name="waterSource" value={formData.waterSource} onChange={handleChange} required className="h-11 w-full rounded-md border border-border-main bg-surface px-3 py-2 text-base text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-farm-green">
                <option value="">Select source</option>
                <option value="borewell">Borewell</option>
                <option value="open_well">Open Well</option>
                <option value="canal">Canal / River</option>
              </select>
            </div>
            {formData.waterSource === 'borewell' && (
              <FormInput label="Borewell depth (in feet) *" name="borewellDepth" type="number" min="1" value={formData.borewellDepth} onChange={handleChange} required />
            )}
            {formData.waterSource !== 'borewell' && (
              <FormInput label="Well depth (in feet) (optional)" name="borewellDepth" type="number" min="1" value={formData.borewellDepth} onChange={handleChange} />
            )}
            <FormInput label="Irrigation method (optional)" name="irrigationMethod" placeholder="e.g. Drip, Flood" value={formData.irrigationMethod} onChange={handleChange} />
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-text-primary">{t('Pump Specifications')}</h3>
            <p className="text-sm text-text-secondary mb-4">{t('Details about your water pump.')}</p>
            <FormInput label="Pump type *" name="pumpType" placeholder="e.g. Submersible" value={formData.pumpType} onChange={handleChange} required />
            <FormInput label="Pump capacity (HP) *" name="pumpCapacity" type="number" min="0.1" step="0.1" value={formData.pumpCapacity} onChange={handleChange} required />
            <FormInput label="Pump rating (optional)" name="pumpRating" placeholder="e.g. 3-phase" value={formData.pumpRating} onChange={handleChange} />
            <FormInput label="Pump age (years) (optional)" name="pumpAge" type="number" min="0" value={formData.pumpAge} onChange={handleChange} />
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-text-primary">{t('Solar & Energy')}</h3>
            <p className="text-sm text-text-secondary mb-4">{t('Do you use solar power for your farm?')}</p>
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="solarPump" className="text-sm font-medium text-text-primary">Solar pump installed? *</label>
              <select id="solarPump" name="solarPump" value={formData.solarPump} onChange={handleChange} required className="h-11 w-full rounded-md border border-border-main bg-surface px-3 py-2 text-base text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-farm-green">
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
            {formData.solarPump === 'yes' && (
              <>
                <FormInput label="Solar capacity (kW) *" name="solarCapacity" type="number" min="0.1" step="0.1" value={formData.solarCapacity} onChange={handleChange} required />
                <FormInput label="Panel capacity (optional)" name="panelCapacity" value={formData.panelCapacity} onChange={handleChange} />
                <FormInput label="Battery storage (optional)" name="battery" placeholder="If applicable" value={formData.battery} onChange={handleChange} />
              </>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex flex-col py-12 px-6 sm:px-12 lg:px-24">
      {/* Header */}
      <div className="flex justify-center mb-10">
        <Logo />
      </div>

      <div className="max-w-2xl w-full mx-auto">
        <h1 className="text-3xl font-semibold text-center text-text-primary mb-2">{t('Setup your farm')}</h1>
        <p className="text-center text-text-secondary mb-8">{t('Complete this one-time setup to get personalized insights.')}</p>

        <Card padding="lg" className="w-full bg-surface shadow-sm">
          <ProgressIndicator currentStep={step} totalSteps={totalSteps} className="mb-8" aria-label={`Step ${step} of ${totalSteps}`} />

          {error && (
            <div className="p-4 bg-[#FBEBEA] border border-[#F5C2C0] rounded-md mb-6" role="alert">
              <p className="text-sm text-warning font-medium">{error}</p>
            </div>
          )}

          <div className="min-h-[300px]">
            {renderStep()}
          </div>

          <div className="mt-8 flex justify-between pt-6 border-t border-border-main">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1 || isLoading}
              aria-label="Go back to previous step"
            >
              {t('Back')}
            </Button>
            
            {step < totalSteps ? (
              <Button variant="primary" onClick={handleNext} aria-label="Continue to next step">
                {t('Continue')}
              </Button>
            ) : (
              <Button variant="primary" onClick={handleSubmit} isLoading={isLoading} aria-label="Finish onboarding">
                {t('Finish setup')}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
