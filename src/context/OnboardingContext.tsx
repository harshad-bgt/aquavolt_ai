import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { farmService } from '../services/farm/farmService';

export interface FarmProfile {
  farmName: string;
  location: string;
  farmArea: string;
  numberOfFields: string;
  crop: string;
  growthStage: string;
  sowingDate: string;
  waterSource: string;
  borewellDepth: string;
  irrigationMethod: string;
  pumpType: string;
  pumpCapacity: string;
  pumpRating: string;
  pumpAge: string;
  solarPump: string;
  solarCapacity: string;
  panelCapacity: string;
  battery: string;
}

interface OnboardingContextType {
  farmProfile: Partial<FarmProfile>;
  isLoading: boolean;
  saveProfile: (profileData: Partial<FarmProfile>) => Promise<void>;
  fetchProfile: () => Promise<void>;
  isInitializingProfile: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const toSnakeCase = (profile: Partial<FarmProfile>) => {
  return {
    farm_name: profile.farmName,
    location: profile.location,
    farm_area: profile.farmArea ? parseFloat(profile.farmArea) : null,
    number_of_fields: profile.numberOfFields ? parseInt(profile.numberOfFields) : null,
    crop: profile.crop,
    growth_stage: profile.growthStage,
    sowing_date: profile.sowingDate || null,
    water_source: profile.waterSource,
    borewell_depth: profile.borewellDepth ? parseFloat(profile.borewellDepth) : null,
    irrigation_method: profile.irrigationMethod || null,
    pump_type: profile.pumpType,
    pump_capacity: profile.pumpCapacity ? parseFloat(profile.pumpCapacity) : 0,
    pump_rating: profile.pumpRating || null,
    pump_age: profile.pumpAge ? parseFloat(profile.pumpAge) : null,
    solar_pump: profile.solarPump ? profile.solarPump.toLowerCase() : 'no',
    solar_capacity: profile.solarCapacity ? parseFloat(profile.solarCapacity) : null,
    panel_capacity: profile.panelCapacity || null,
    battery: profile.battery || null,
  };
};

const toCamelCase = (data: any): Partial<FarmProfile> => {
  return {
    farmName: data.farm_name,
    location: data.location,
    farmArea: data.farm_area?.toString() || '',
    numberOfFields: data.number_of_fields?.toString() || '',
    crop: data.crop,
    growthStage: data.growth_stage,
    sowingDate: data.sowing_date || '',
    waterSource: data.water_source,
    borewellDepth: data.borewell_depth?.toString() || '',
    irrigationMethod: data.irrigation_method || '',
    pumpType: data.pump_type,
    pumpCapacity: data.pump_capacity?.toString() || '',
    pumpRating: data.pump_rating || '',
    pumpAge: data.pump_age?.toString() || '',
    solarPump: data.solar_pump ? data.solar_pump.toLowerCase() : 'no',
    solarCapacity: data.solar_capacity?.toString() || '',
    panelCapacity: data.panel_capacity || '',
    battery: data.battery || '',
  };
};

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [farmProfile, setFarmProfile] = useState<Partial<FarmProfile>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializingProfile, setIsInitializingProfile] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Synchronously set isInitializingProfile to true when isAuthenticated flips to true
  const prevAuth = React.useRef(isAuthenticated);
  if (isAuthenticated !== prevAuth.current) {
    prevAuth.current = isAuthenticated;
    if (isAuthenticated) {
      // @ts-ignore
      setIsInitializingProfile(true);
    }
  }

  const fetchProfile = async () => {
    if (!isAuthenticated) {
      setIsInitializingProfile(false);
      return;
    }
    try {
      const data = await farmService.getProfile();
      setFarmProfile(toCamelCase(data));
    } catch (e) {
      // 404 means no profile, which is fine
      console.log('No existing farm profile found.');
      setFarmProfile({});
    } finally {
      setIsInitializingProfile(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    } else {
      setFarmProfile({});
      setIsInitializingProfile(false);
    }
  }, [isAuthenticated]);

  const saveProfile = async (profileData: Partial<FarmProfile>) => {
    setIsLoading(true);
    try {
      const snakeData = toSnakeCase(profileData);
      let updatedData;
      // If we already have a profile, update it. Otherwise, create it.
      try {
        await farmService.getProfile();
        updatedData = await farmService.updateProfile(snakeData);
      } catch {
        updatedData = await farmService.createProfile(snakeData);
      }
      setFarmProfile(toCamelCase(updatedData));
      navigate('/dashboard');
    } catch (e: any) {
      alert(e.message || 'Error saving farm profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitializingProfile && isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-main">
        <div className="w-8 h-8 border-4 border-farm-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <OnboardingContext.Provider value={{ farmProfile, isLoading, saveProfile, fetchProfile, isInitializingProfile }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
