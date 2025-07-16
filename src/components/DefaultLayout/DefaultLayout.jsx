import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './DefaultLayout.css';

const DefaultLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
      // Auto-close sidebar on mobile when resizing to desktop
      if (window.innerWidth >= 992) {
        setCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="layout-container">
      <Sidebar collapsed={isMobile ? false : collapsed} isMobile={isMobile} />
      <div 
        className={`main-content ${collapsed ? 'sidebar-collapsed' : ''} ${isMobile ? 'mobile-view' : ''}`}
        style={{
          marginLeft: isMobile ? 0 : (collapsed ? '80px' : '250px'),
          transition: 'margin-left 0.2s ease-in-out',
          width: isMobile ? '100%' : `calc(100% - ${collapsed ? '80px' : '250px'})`
        }}
      >
        <Navbar 
          collapsed={collapsed} 
          toggleSidebar={toggleSidebar} 
          isMobile={isMobile}
        />
        <div className="content-wrapper p-3 p-md-4">
          <Container fluid className="h-100">
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
