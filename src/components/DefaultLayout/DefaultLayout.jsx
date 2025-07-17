import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './DefaultLayout.css';

const DefaultLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(false);
        setCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when route changes
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location, isMobile]);

  return (
    <div className="layout-container" theme='dark'>

      <Navbar
        collapsed={collapsed}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />

      <div
        className={`main-content ${collapsed ? 'sidebar-collapsed' : ''} ${isMobile ? 'mobile-view' : ''}`}
        style={{
          marginLeft: isMobile ? 0 : (collapsed ? '80px' : '250px'),
          transition: 'margin-left 0.2s ease-in-out',
          width: isMobile ? '100%' : `calc(100% - ${collapsed ? '80px' : '250px'})`
        }}
      >
        <Sidebar
          collapsed={isMobile ? false : collapsed}
          isMobile={isMobile}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        <div className="content-wrapper pt-0 mt-0">
          <Container className="h-100">
            <Row className="h-100">
              <Col>
                {children || <Outlet />}
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;