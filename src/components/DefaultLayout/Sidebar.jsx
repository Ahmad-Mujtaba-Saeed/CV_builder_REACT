import React from 'react';
import { Nav, Button, } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard as DashboardIcon,
  FileText as FileTextIcon,
  User as UserIcon,
  Settings as SettingsIcon,
  LogOut as LogoutIcon,
  X as CloseIcon
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ collapsed, isMobile, isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const selectedKey = location.pathname.split('/')[1] || 'dashboard';
  const navigate = useNavigate();

  const Navigation = [
    {
      key: 'dashboard',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" fill="none">
        <g clip-path="url(#clip0_36781_3085)">
          <path d="M14.1409 10.5934C13.7168 11.5964 13.0534 12.4802 12.2088 13.1676C11.3642 13.855 10.3641 14.325 9.29588 14.5366C8.22765 14.7481 7.12387 14.6948 6.08102 14.3813C5.03817 14.0677 4.088 13.5034 3.3136 12.7378C2.5392 11.9722 1.96413 11.0286 1.63868 9.98935C1.31322 8.95015 1.24729 7.84704 1.44665 6.77647C1.64601 5.70591 2.10458 4.70047 2.78228 3.84807C3.45998 2.99567 4.33617 2.32226 5.33425 1.88672" stroke="#BA67EF" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M14.6667 7.99967C14.6667 7.12419 14.4942 6.25729 14.1592 5.44845C13.8242 4.63961 13.3331 3.90469 12.714 3.28563C12.095 2.66657 11.3601 2.17551 10.5512 1.84048C9.74239 1.50545 8.87548 1.33301 8 1.33301V7.99967H14.6667Z" stroke="#BA67EF" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_36781_3085">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>,
      label: 'Dashboard',
      to: '/dashboard'
    },
    {
      key: 'CV-Builder',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" fill="none">
        <path d="M9.33268 1.33301H3.99935C3.64573 1.33301 3.30659 1.47348 3.05654 1.72353C2.80649 1.97358 2.66602 2.31272 2.66602 2.66634V13.333C2.66602 13.6866 2.80649 14.0258 3.05654 14.2758C3.30659 14.5259 3.64573 14.6663 3.99935 14.6663H11.9993C12.353 14.6663 12.6921 14.5259 12.9422 14.2758C13.1922 14.0258 13.3327 13.6866 13.3327 13.333V5.33301L9.33268 1.33301Z" stroke="#9FA6BC" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M10.6673 11.333H5.33398" stroke="#9FA6BC" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M10.6673 8.66699H5.33398" stroke="#9FA6BC" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M6.66732 6H6.00065H5.33398" stroke="#9FA6BC" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M9.33398 1.33301V5.33301H13.334" stroke="#9FA6BC" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" />
      </svg>,
      label: 'CV Builder',
      to: '#'
    },
    {
      key: 'Application-Tracker',
      icon: <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.6667 2.66699H3.33333C2.59695 2.66699 2 3.26395 2 4.00033V13.3337C2 14.07 2.59695 14.667 3.33333 14.667H12.6667C13.403 14.667 14 14.07 14 13.3337V4.00033C14 3.26395 13.403 2.66699 12.6667 2.66699Z" stroke="#9FA6BC" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M2 6.66699H14" stroke="#9FA6BC" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M10.666 1.33301V3.99967" stroke="#9FA6BC" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M5.33398 1.33301V3.99967" stroke="#9FA6BC" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" />
      </svg>,
      label: 'Application Tracker',
      to: '#'
    },
    {
      key: 'Interview-Practice',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" fill="none">
        <path d="M14 7.66669C14.0023 8.5466 13.7967 9.41461 13.4 10.2C12.9296 11.1412 12.2065 11.9328 11.3116 12.4862C10.4168 13.0396 9.38549 13.3329 8.33333 13.3334C7.45342 13.3356 6.58541 13.1301 5.8 12.7334L2 14L3.26667 10.2C2.86995 9.41461 2.66437 8.5466 2.66667 7.66669C2.66707 6.61452 2.96041 5.58325 3.51381 4.68839C4.06722 3.79352 4.85884 3.0704 5.8 2.60002C6.58541 2.20331 7.45342 1.99772 8.33333 2.00002H8.66667C10.0562 2.07668 11.3687 2.66319 12.3528 3.64726C13.3368 4.63132 13.9233 5.94379 14 7.33335V7.66669Z" stroke="#9FA6BC" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" />
      </svg>,
      label: 'Interview Practice',
      to: '#'
    },
    {
      key: 'Job-Search',
      icon: <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#9FA6BC" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M13.9996 13.9996L11.0996 11.0996" stroke="#9FA6BC" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      ,
      label: 'Job Search',
      to: '#'
    },
    {
      key: 'Events',
      icon: <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.6673 14L8.00065 10.6667L3.33398 14V3.33333C3.33398 2.97971 3.47446 2.64057 3.72451 2.39052C3.97456 2.14048 4.3137 2 4.66732 2H11.334C11.6876 2 12.0267 2.14048 12.2768 2.39052C12.5268 2.64057 12.6673 2.97971 12.6673 3.33333V14Z" stroke="#9FA6BC" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      ,
      label: 'Events',
      to: '#'
    },
    {
      key: 'Community',
      icon: <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 14.667C13.1046 14.667 14 13.7716 14 12.667C14 11.5624 13.1046 10.667 12 10.667C10.8954 10.667 10 11.5624 10 12.667C10 13.7716 10.8954 14.667 12 14.667Z" stroke="#9FA6BC" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M4 10C5.10457 10 6 9.10457 6 8C6 6.89543 5.10457 6 4 6C2.89543 6 2 6.89543 2 8C2 9.10457 2.89543 10 4 10Z" stroke="#9FA6BC" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M5.72656 9.00684L10.2799 11.6602" stroke="#9FA6BC" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M12 5.33301C13.1046 5.33301 14 4.43758 14 3.33301C14 2.22844 13.1046 1.33301 12 1.33301C10.8954 1.33301 10 2.22844 10 3.33301C10 4.43758 10.8954 5.33301 12 5.33301Z" stroke="#9FA6BC" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M10.2732 4.33984L5.72656 6.99318" stroke="#9FA6BC" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" />
      </svg>,
      label: 'Community',
      to: '#'
    },
  ];

  const Support = [
    {
      key: 'Getting-Started',
      icon: <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_36781_3190)">
          <path d="M8.00065 14.6663C11.6825 14.6663 14.6673 11.6816 14.6673 7.99967C14.6673 4.31778 11.6825 1.33301 8.00065 1.33301C4.31875 1.33301 1.33398 4.31778 1.33398 7.99967C1.33398 11.6816 4.31875 14.6663 8.00065 14.6663Z" stroke="#9FA6BC" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M10.8272 5.17285L9.41383 9.41285L5.17383 10.8262L6.58716 6.58618L10.8272 5.17285Z" stroke="#9FA6BC" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_36781_3190">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
      ,
      label: 'Getting Started',
      to: '#'
    },
    {
      key: 'FAQ',
      icon:
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_36781_3203)">
            <path d="M8.00065 14.6663C11.6825 14.6663 14.6673 11.6816 14.6673 7.99967C14.6673 4.31778 11.6825 1.33301 8.00065 1.33301C4.31875 1.33301 1.33398 4.31778 1.33398 7.99967C1.33398 11.6816 4.31875 14.6663 8.00065 14.6663Z" stroke="#9FA6BC" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M8 11.333H8.008" stroke="#9FA6BC" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M6.06055 6.00038C6.21728 5.55482 6.52665 5.17912 6.93385 4.9398C7.34105 4.70049 7.81981 4.61301 8.28533 4.69285C8.75085 4.7727 9.17309 5.01473 9.47727 5.37606C9.78144 5.7374 9.94792 6.19473 9.94721 6.66705C9.94721 8.00038 7.94721 8.66705 7.94721 8.66705" stroke="#9FA6BC" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" />
          </g>
          <defs>
            <clipPath id="clip0_36781_3203">
              <rect width="16" height="16" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ,
      label: 'FAQ',
      to: '#'
    },
    {
      key: 'Support',
      icon:
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_36781_3217)">
            <path d="M8.00065 14.6663C11.6825 14.6663 14.6673 11.6816 14.6673 7.99967C14.6673 4.31778 11.6825 1.33301 8.00065 1.33301C4.31875 1.33301 1.33398 4.31778 1.33398 7.99967C1.33398 11.6816 4.31875 14.6663 8.00065 14.6663Z" stroke="#9FA6BC" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M1.33398 8H14.6673" stroke="#9FA6BC" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M8.00065 1.33301C9.66817 3.15858 10.6158 5.5277 10.6673 7.99967C10.6158 10.4717 9.66817 12.8408 8.00065 14.6663C6.33313 12.8408 5.38548 10.4717 5.33398 7.99967C5.38548 5.5277 6.33313 3.15858 8.00065 1.33301V1.33301Z" stroke="#9FA6BC" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" />
          </g>
          <defs>
            <clipPath id="clip0_36781_3217">
              <rect width="16" height="16" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ,
      label: 'Support',
      to: '#'
    },
    {
      key: 'Pricing',
      icon:
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.7273 8.93968L8.94732 13.7197C8.82349 13.8436 8.67644 13.942 8.51457 14.0091C8.35271 14.0762 8.1792 14.1107 8.00398 14.1107C7.82876 14.1107 7.65526 14.0762 7.4934 14.0091C7.33153 13.942 7.18448 13.8436 7.06065 13.7197L1.33398 7.99968V1.33301H8.00065L13.7273 7.05968C13.9757 7.30949 14.115 7.64743 14.115 7.99968C14.115 8.35192 13.9757 8.68986 13.7273 8.93968V8.93968Z" stroke="#9FA6BC" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M4.66602 4.66699H4.67402" stroke="#9FA6BC" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      ,
      label: 'Pricing',
      to: '#'
    },
    {
      key: 'Notifications',
      icon:
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5.33301C12 4.27214 11.5786 3.25473 10.8284 2.50458C10.0783 1.75444 9.06087 1.33301 8 1.33301C6.93913 1.33301 5.92172 1.75444 5.17157 2.50458C4.42143 3.25473 4 4.27214 4 5.33301C4 9.99967 2 11.333 2 11.333H14C14 11.333 12 9.99967 12 5.33301Z" stroke="#9FA6BC" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M9.15237 14C9.03516 14.2021 8.86693 14.3698 8.66452 14.4864C8.46211 14.6029 8.23262 14.6643 7.99904 14.6643C7.76545 14.6643 7.53596 14.6029 7.33355 14.4864C7.13114 14.3698 6.96291 14.2021 6.8457 14" stroke="#9FA6BC" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      ,
      label: 'Notifications',
      to: '#'
    },
    {
      key: 'logout',
      icon:
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.666 11.3337L13.9993 8.00033L10.666 4.66699" stroke="#9FA6BC" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M14 8H6" stroke="#9FA6BC" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6" stroke="#9FA6BC" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      ,
      label: 'Sign Out',
      onClick: () => {
        navigate('/logout');
      },
    },
  ];

  const handleItemClick = (onClick) => {
    if (isMobile) {
      setTimeout(() => {
        toggleSidebar();
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
          onClick={() => toggleSidebar()}
        />
      )}

      <div className={`sidebar`}>
        <div className="sidebar-content">
          <Nav className="sidebar-nav">
            <Nav.Item className={`nav-label-heading`}>
              <Nav.Link
                as={'div'}
              >
                <span className="nav-label">NAVIGATION</span>
              </Nav.Link>
            </Nav.Item>
            {Navigation.map((item) => {
              const isActive = selectedKey === item.key;
              return (
                <Nav.Item key={item.key} className={item.className}>
                  <Nav.Link
                    as={item.to ? Link : 'div'}
                    to={item.to}
                    onClick={() => handleItemClick(item.onClick)}
                    className={`${isActive ? 'active' : ''}`}
                  >
                    <div className="nav-icon">{item.icon}</div>
                    {!collapsed && <span className="nav-label">{item.label}</span>}
                  </Nav.Link>
                </Nav.Item>
              );
            })}
            <Nav.Item className={`nav-label-heading`}>
              <Nav.Link
                as={'div'}
              >
                <span className="nav-label">SUPPORT</span>
              </Nav.Link>
            </Nav.Item>
            {Support.map((item) => {
              const isActive = selectedKey === item.key;
              return (
                <Nav.Item key={item.key} className={item.className}>
                  <Nav.Link
                    as={item.to ? Link : 'div'}
                    to={item.to}
                    onClick={() => handleItemClick(item.onClick)}
                    className={`${isActive ? 'active' : ''}`}
                  >
                    <div className="nav-icon">{item.icon}</div>
                    {!collapsed && <span className="nav-label">{item.label}</span>}
                  </Nav.Link>
                </Nav.Item>
              );
            })}
          </Nav>
          <div className="side-nav-update-package">
            <div className="update-image">
              <img src="/assets/images/side-nav-image.png" alt="" />
            </div>
            <div className="update-content">
              <h4>Upgrade to Pro</h4>
              <p>Unlock your full potential by signing up to  MyPathFinder PRO.</p>
            </div>
            <div className="update-button">
              <Button varient={'primary'} >Upgrade to pro</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;