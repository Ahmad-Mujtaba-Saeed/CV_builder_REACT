import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Typography, Button, Row, Col, Space, Result } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import './Cancelled.css';

const { Title, Text } = Typography;

const Cancelled = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleTryAgain = () => {
    navigate('/pricing'); // Assuming you have a pricing/plans page
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="cancelled-container">
      <Row justify="center" align="middle" style={{ minHeight: '80vh' }}>
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
          <Card className="cancelled-card">
            <Result
              status="error"
              icon={<CloseCircleFilled style={{ fontSize: '64px', color: '#ff4d4f' }} />}
              title="Payment Cancelled"
              subTitle="Your payment was not completed. No charges were made to your account."
              extra={[
                <Button 
                  type="primary" 
                  key="try-again"
                  onClick={handleTryAgain}
                  style={{ marginRight: '10px' }}
                >
                  Try Again
                </Button>,
                <Button 
                  key="dashboard" 
                  onClick={handleBackToDashboard}
                >
                  Back to Dashboard
                </Button>
              ]}
            >
              <div className="order-details">
                <Title level={4}>Order Status</Title>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Row justify="space-between">
                    <Text type="secondary">Status:</Text>
                    <Text type="danger" strong>Payment Cancelled</Text>
                  </Row>
                  {state?.orderId && (
                    <Row justify="space-between">
                      <Text type="secondary">Order ID:</Text>
                      <Text>#{state.orderId}</Text>
                    </Row>
                  )}
                  <Row justify="space-between">
                    <Text type="secondary">Date:</Text>
                    <Text>{new Date().toLocaleDateString()}</Text>
                  </Row>
                </Space>
              </div>
              
              <div className="help-section" style={{ marginTop: '32px' }}>
                <Title level={5}>Need help?</Title>
                <ul>
                  <li>If this was a mistake, you can try the payment again</li>
                  <li>Contact our <a href="/support">support team</a> if you need assistance</li>
                  <li>Check our <a href="/faq">FAQ</a> for common payment issues</li>
                </ul>
              </div>
            </Result>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Cancelled;