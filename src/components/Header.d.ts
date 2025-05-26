import { ViewMode, PageType } from '../types';

interface HeaderProps {
  onMenuClick: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onCreateProject: () => void;
  isAdmin: boolean;
  currentUser: any;
  onLogout: () => void;
  onAdminLogin: () => void;
}

declare const Header: React.FC<HeaderProps>;
export default Header; 