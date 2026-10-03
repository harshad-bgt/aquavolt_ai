import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../ui/Logo';
import {
  LayoutDashboard,
  Sparkles,
  Droplet,
  Trees,
  Sun,
  CloudRain,
  CalendarClock,
  Bell,
  Map,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  User,
  Activity,
  LineChart
} from 'lucide-react';
import { LanguageSelector } from '../navigation/LanguageSelector';
import { useLanguage } from '../../i18n/LanguageContext';

interface SidebarProps {
  isPinned: boolean;
  setIsPinned: (pinned: boolean) => void;
  isMobile?: boolean;
  className?: string;
}

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Advice', path: '/advice', icon: Sparkles },
  { name: 'Borewell', path: '/borewell', icon: Droplet },
  { name: 'Soil & Crop', path: '/soil', icon: Trees },
  { name: 'Solar & Energy', path: '/energy', icon: Sun },
  { name: 'Weather', path: '/weather', icon: CloudRain },
  { name: 'Monitoring', path: '/monitoring', icon: Activity },
  { name: 'Schedule', path: '/schedule', icon: CalendarClock },
  { name: 'Alerts', path: '/alerts', icon: Bell },
  { name: 'Analytics', path: '/analytics', icon: LineChart },
  { name: 'Farm Profile', path: '/farm', icon: Map },
];

export const Sidebar: React.FC<SidebarProps> = ({ isPinned, setIsPinned, isMobile = false, className = '' }) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const expanded = isMobile || isPinned || isHovered;
  const collapsed = !expanded;

  const handleMouseEnter = () => {
    if (isMobile) return;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  return (
    <div 
      className={`flex flex-col bg-surface border-r border-border-main transition-[width] duration-300 ease-in-out overflow-hidden ${collapsed ? 'w-20' : 'w-64'} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header & Logo */}
      <div className="h-16 flex items-center px-4 border-b border-border-main relative">
        <Logo collapsed={collapsed} />
        {!isMobile && (
          <button
            onClick={() => setIsPinned(!isPinned)}
            className="absolute -right-3 top-5 bg-surface border border-border-main rounded-full p-1 text-text-secondary hover:text-farm-green hover:bg-bg-secondary transition-colors z-10"
            aria-label={isPinned ? "Unpin sidebar" : "Pin sidebar"}
            aria-expanded={isPinned}
          >
            {isPinned ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
        )}
      </div>

      {/* Search */}
      <div className={`px-4 transition-all duration-300 ease-in-out ${collapsed ? 'h-0 opacity-0 py-0' : 'h-14 opacity-100 py-4 block'}`}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-bg-secondary border border-border-main rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-farm-green transition-shadow"
            tabIndex={collapsed ? -1 : 0}
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-md transition-colors group relative overflow-hidden ${
                    isActive
                      ? 'bg-farm-green/10 text-farm-green font-medium'
                      : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                  }`
                }
                title={collapsed ? item.name : undefined}
              >
                <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
                  <item.icon className="w-5 h-5" />
                </div>
                <span className={`ml-3 whitespace-nowrap transition-opacity duration-300 ease-in-out ${collapsed ? 'opacity-0' : 'opacity-100'}`}>
                  {t(item.name)}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-border-main p-4 space-y-2">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center px-3 py-2.5 rounded-md transition-colors group relative overflow-hidden ${
              isActive
                ? 'bg-farm-green/10 text-farm-green font-medium'
                : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
            }`
          }
          title={collapsed ? "Settings" : undefined}
        >
          <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
            <Settings className="w-5 h-5" />
          </div>
          <span className={`ml-3 whitespace-nowrap transition-opacity duration-300 ease-in-out ${collapsed ? 'opacity-0' : 'opacity-100'}`}>
            {t('Settings')}
          </span>
        </NavLink>
        
        <button
          onClick={logout}
          className="w-full flex items-center px-3 py-2.5 rounded-md text-text-secondary hover:bg-[#FBEBEA] hover:text-warning transition-colors relative overflow-hidden"
          title={collapsed ? "Logout" : undefined}
        >
          <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
            <LogOut className="w-5 h-5" />
          </div>
          <span className={`ml-3 whitespace-nowrap transition-opacity duration-300 ease-in-out ${collapsed ? 'opacity-0' : 'opacity-100'}`}>
            {t('Logout')}
          </span>
        </button>
      </div>

      {/* User Profile & Language */}
      <div className="border-t border-border-main p-4">
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${collapsed ? 'h-0 opacity-0 mb-0' : 'h-10 opacity-100 mb-4'}`}>
           <LanguageSelector />
        </div>
        <div className="flex items-center relative overflow-hidden group">
          <div className="w-10 h-10 rounded-full bg-farm-green/10 flex items-center justify-center text-farm-green flex-shrink-0 transition-colors group-hover:bg-farm-green group-hover:text-white" title={collapsed ? user?.name || 'Farmer' : undefined}>
            <User className="w-5 h-5" />
          </div>
          <div className={`ml-3 flex-1 min-w-0 transition-opacity duration-300 ease-in-out ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
            <p className="text-sm font-medium text-text-primary truncate">{user?.name || 'Farmer'}</p>
            <p className="text-xs text-text-muted truncate">{user?.mobile || user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
