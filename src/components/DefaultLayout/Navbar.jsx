// Navbar.jsx
import React from 'react';
import { Navbar, Nav, Container, Dropdown, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  Menu as MenuIcon,
  Search as SearchIcon,
  Bell as BellIcon,
  User as UserIcon,
  Settings as SettingsIcon,
  LogOut as LogoutIcon
} from 'lucide-react';

const NavbarComponent = ({ collapsed, toggleSidebar, isMobile }) => {
  const notifications = [
    { id: 1, title: 'New message', time: '10 min ago', read: false },
    { id: 2, title: 'Profile updated', time: '1 hour ago', read: true }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Navbar bg="white" expand="lg" className="border-bottom" sticky="top">
      <Container fluid>
        <div className="d-flex align-items-center">
          <button 
            onClick={toggleSidebar}
            className="btn btn-link text-dark p-2"
          >
            <MenuIcon size={20} />
          </button>
          {/* <Navbar.Brand as={Link} to="/" className="d-none d-md-block">
            CV Builder
          </Navbar.Brand> */}
        </div>

        <div className="d-none d-lg-block ms-2" style={{ maxWidth: '287px', flex: 1 }}>
          <div className="position-relative">
            <SearchIcon className="position-absolute top-50 start-0 translate-middle-y ms-3" />
            <input 
              type="text" 
              className="form-control ps-5" 
              placeholder="Search..."
            />
          </div>
        </div>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />
        
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="align-items-center">
            <Dropdown as={Nav.Item} className="mx-2 shadow-none">
              <Dropdown.Toggle as={Nav.Link} className="position-relative p-2 bg-light no-caret">
                <BellIcon size={20} />
                {unreadCount > 0 && (
                  <Badge bg="danger" className="position-absolute top-end translate-middle rounded-pill" style={{ fontSize: '0.6rem', padding: '0.2rem 0.35rem' }}>
                    {unreadCount}
                  </Badge>
                )}
              </Dropdown.Toggle>
              
              <Dropdown.Menu className="mt-2 border-0 shadow no-caret" style={{ minWidth: '300px' }}>
                <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                  <span className="fw-bold">Notifications</span>
                  <Badge bg="primary">{unreadCount} New</Badge>
                </div>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {notifications.map(notification => (
                    <Dropdown.Item 
                      key={notification.id} 
                      as={Link} 
                      to="#"
                      className={`p-3 ${!notification.read ? 'bg-light' : ''}`}
                    >
                      <div className="d-flex">
                        <div className="me-3">
                          <div className="bg-primary bg-opacity-10 rounded-circle p-2">
                            <BellIcon size={16} className="text-primary" />
                          </div>
                        </div>
                        <div>
                          <div className="fw-medium">{notification.title}</div>
                          <small className="text-muted">{notification.time}</small>
                        </div>
                      </div>
                    </Dropdown.Item>
                  ))}
                </div>
                <div className="text-center p-2 border-top">
                  <Link to="/notifications" className="text-decoration-none">View all notifications</Link>
                </div>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown as={Nav.Item} className="mx-3">
              <Dropdown.Toggle as={Nav.Link} className="d-flex align-items-center shadow-none p-2 bg-white">
                <div className="bg-primary bg-opacity-10 rounded-circle py-1 px-2 me-2">
                  <UserIcon size={16} className="text-primary" />
                </div>
              </Dropdown.Toggle>
              
              <Dropdown.Menu className="mt-2 border-0 shadow" style={{ minWidth: '200px' }}>
                <Dropdown.Header className="d-flex align-items-center">
                  <div className="me-3">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-2">
                      <UserIcon size={20} className="text-primary" />
                    </div>
                  </div>
                  <div>
                    <div className="fw-semibold">John Doe</div>
                    <small className="text-muted">john@example.com</small>
                  </div>
                </Dropdown.Header>
                <Dropdown.Divider />
                <Dropdown.Item as={Link} to="/profile">
                  <UserIcon size={16} className="me-2" />
                  My Profile
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/settings">
                  <SettingsIcon size={16} className="me-2" />
                  Settings
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item as={Link} to="/logout" className="text-danger">
                  <LogoutIcon size={16} className="me-2" />
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;