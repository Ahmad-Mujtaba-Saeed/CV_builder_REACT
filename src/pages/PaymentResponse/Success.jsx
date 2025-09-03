import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Typography, Button, Row, Col, Space, Result } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import './Success.css'; // You'll need to create this file

const { Title, Text } = Typography;

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="success-container">
      <Row justify="center" align="middle" style={{ minHeight: '80vh' }}>
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
          <Card className="success-card">
            <Result
              status="success"
              icon={<CheckCircleFilled style={{ fontSize: '64px', color: '#52c41a' }} />}
              title="Payment Successful!"
              subTitle="Thank you for your purchase. Your payment has been processed successfully."
              extra={[
                <Button 
                  type="primary" 
                  key="dashboard" 
                  onClick={handleBackToDashboard}
                  size="large"
                >
                  Go to Dashboard
                </Button>,
              ]}
            >
              <div className="order-details">
                <Title level={4}>Order Details</Title>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Row justify="space-between">
                    <Text type="secondary">Order ID:</Text>
                    <Text strong>#{state?.orderId || 'N/A'}</Text>
                  </Row>
                  <Row justify="space-between">
                    <Text type="secondary">Plan:</Text>
                    <Text strong>{state?.planName || 'Premium Plan'}</Text>
                  </Row>
                  <Row justify="space-between">
                    <Text type="secondary">Amount Paid:</Text>
                    <Text strong>${state?.amount || '0.00'}</Text>
                  </Row>
                  <Row justify="space-between">
                    <Text type="secondary">Date:</Text>
                    <Text>{new Date().toLocaleDateString()}</Text>
                  </Row>
                </Space>
              </div>
              
              <div className="next-steps" style={{ marginTop: '32px' }}>
                <Title level={5}>What's next?</Title>
                <ul>
                  <li>You can now access all premium features</li>
                  <li>Your subscription details are available in your dashboard</li>
                  <li>Check your email for the payment confirmation</li>
                </ul>
              </div>
            </Result>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Success;