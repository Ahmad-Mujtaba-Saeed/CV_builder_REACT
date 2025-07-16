import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard as DashboardIcon,
  FileText as FileTextIcon,
  User as UserIcon,
  Settings as SettingsIcon,
  LogOut as LogoutIcon,
  X as CloseIcon
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ collapsed, isMobile }) => {
  const location = useLocation();
  const selectedKey = location.pathname.split('/')[1] || 'dashboard';

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardIcon size={20} />,
      label: 'Dashboard',
      to: '/dashboard'
    },
    {
      key: 'resume',
      icon: <FileTextIcon size={20} />,
      label: 'My Resume',
      to: '/resume'
    },
    {
      key: 'profile',
      icon: <UserIcon size={20} />,
      label: 'Profile',
      to: '/profile'
    },
    {
      key: 'settings',
      icon: <SettingsIcon size={20} />,
      label: 'Settings',
      to: '/settings'
    },
    {
      key: 'divider',
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutIcon size={20} />,
      label: 'Logout',
      onClick: () => {
        // Handle logout
        console.log('Logout clicked');
      },
      className: 'mt-auto'
    },
  ];

  const handleItemClick = (onClick) => {
    if (isMobile) {
      setTimeout(() => {
        document.body.classList.remove('sidebar-open');
      }, 100);
    }
    if (onClick) onClick();
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && (
        <div 
          className="sidebar-overlay"
          onClick={() => document.body.classList.remove('sidebar-open')}
        />
      )}
      
      <div className={`sidebar ${collapsed ? 'collapsed' : ''} ${isMobile ? 'mobile' : ''}`}>
        <div className="sidebar-header">
          {!collapsed && <h5>CV Builder</h5>}
          {isMobile && (
            <button 
              className="close-btn"
              onClick={() => document.body.classList.remove('sidebar-open')}
            >
              <CloseIcon size={20} />
            </button>
          )}
        </div>
        
        <div className="sidebar-content">
          <Nav className="sidebar-nav">
            {menuItems.map((item) => {
              if (item.type === 'divider') {
                return <div key={item.key} className="divider" />;
              }
              
              const isActive = selectedKey === item.key;
              
              return (
                <Nav.Item key={item.key} className={item.className}>
                  <Nav.Link 
                    as={item.to ? Link : 'div'}
                    to={item.to}
                    onClick={() => handleItemClick(item.onClick)}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                  >
                    <div className="nav-icon">{item.icon}</div>
                    {!collapsed && <span className="nav-label">{item.label}</span>}
                    {isActive && !collapsed && <div className="active-indicator" />}
                  </Nav.Link>
                </Nav.Item>
              );
            })}
          </Nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;