import React from 'react';
import demo_profile from '../../assets/demo_profile.avif';

const Template13 = ({ resumeData }) => {
    const styles = {
        body: {
          fontFamily: 'Arial, sans-serif',
          margin: 0,
          padding: 0,
          background: '#f7f7f7',
          color: '#000'
        },
        resume: {
          background: '#fff',
          width: '800px',
          margin: '40px auto',
          padding: '40px 50px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)'
        },
        header: {
          display: 'flex',
          alignItems: 'center',
          marginBottom: '30px'
        },
        headerBar: {
          backgroundColor: '#7a1e37',
          width: '60px',
          height: '60px',
          marginRight: '15px'
        },
        name: {
          fontSize: '28px',
          color: '#7a1e37',
          fontWeight: 'bold'
        },
        sectionTitle: {
          fontSize: '18px',
          borderBottom: '1px solid #ccc',
          paddingBottom: '5px',
          marginTop: '30px',
          color: '#000'
        },
        personalDetails: {
          marginTop: '10px',
          lineHeight: 1.6
        },
        personalDetailItem: {
          display: 'flex',
          marginBottom: '5px'
        },
        label: {
          width: '130px',
          fontWeight: 'bold',
          color: '#7a1e37'
        },
        summary: {
          marginTop: '10px',
          lineHeight: 1.6
        },
        sectionContent: {
          marginTop: '10px',
          lineHeight: 1.6
        },
        workExperience: {
          marginTop: '10px'
        },
        job: {
          marginBottom: '20px'
        },
        jobDate: {
          color: '#7a1e37',
          fontWeight: 'bold'
        },
        jobTitle: {
          fontWeight: 'bold'
        },
        jobCompany: {
          fontWeight: 'bold',
          color: '#000'
        },
        bulletList: {
          margin: '8px 0 0 20px',
          paddingLeft: 0
        },
        bulletItem: {
          marginBottom: '5px'
        },
        footer: {
          textAlign: 'center',
          fontSize: '12px',
          marginTop: '40px',
          color: '#999'
        }
      };
      
      

  return (
    <div style={styles.resume}>
  <div style={styles.header}>
    <div style={styles.headerBar}></div>
    <div style={styles.name}>{resumeData?.candidateName?.[0]?.firstName} {resumeData?.candidateName?.[0]?.familyName}</div>
  </div>

  <h2 style={styles.sectionTitle}>Personal Details</h2>
  <div style={styles.personalDetails}>
    <div style={styles.personalDetailItem}>
      <div style={styles.label}>Name</div>
      <div>{resumeData?.candidateName?.[0]?.firstName} {resumeData?.candidateName?.[0]?.familyName}</div>
    </div>
    {resumeData?.email?.[0] && (
    <div style={styles.personalDetailItem}>
      <div style={styles.label}>Email address</div>
      <div>{resumeData.email[0]}</div>
    </div>
    )}
    {resumeData?.phoneNumber?.[0]?.formattedNumber && (
    <div style={styles.personalDetailItem}>
      <div style={styles.label}>Phone number</div>
      <div>{resumeData.phoneNumber[0].formattedNumber}</div>
    </div>
    )}
    {resumeData?.location?.formatted && (
    <div style={styles.personalDetailItem}>
      <div style={styles.label}>Address</div>
      <div>{resumeData.location.formatted}</div>
    </div>
    )}
    {resumeData?.website?.[0] && (
    <div style={styles.personalDetailItem}>
      <div style={styles.label}>LinkedIn</div>
      <div>{resumeData.website[0].replace(/^https?:\/\//, '')}</div>
    </div>
    )}
  </div>

  <h2 style={styles.sectionTitle}>Summary</h2>
  <div style={styles.summary}>
    Efficient and friendly cashier with 5+ years of experience operating point of sale systems and 3+ years of experience handling 300+ transactions per day. Excited to leverage excellent customer service skills and shift management experience to join the Home Depot team as a Cashier (Team Lead).
  </div>

  <h2 style={styles.sectionTitle}>Work Experience</h2>
  <div style={styles.workExperience}>
    <div style={styles.job}>
      <div style={styles.jobDate}>Aug 2018 - Present</div>
      <div style={styles.jobTitle}>Cashier, Shift Lead</div>
      <div style={styles.jobCompany}>IGA, Missoula, MT</div>
      <ul style={styles.bulletList}>
        <li style={styles.bulletItem}>Assign shifts and manage cashier schedule changes</li>
        <li style={styles.bulletItem}>Regularly handle 300+ transactions per shift</li>
        <li style={styles.bulletItem}>Perform all checkout procedures quickly and accurately, including operating the conveyor belt, barcode scanner, scale, entering produce codes, and cash register</li>
        <li style={styles.bulletItem}>Assist with stocking, cleaning, and guest services as necessary</li>
        <li style={styles.bulletItem}>Upsold 3% of guests with IGA memberships in 2021 (highest percentage of all IGA employees)</li>
      </ul>
    </div>

    <div style={styles.job}>
      <div style={styles.jobDate}>Jun 2016 - Aug 2018</div>
      <div style={styles.jobTitle}>Cashier</div>
      <div style={styles.jobCompany}>Bob’s QuickMart & Gas Station, Missoula, MT</div>
      <ul style={styles.bulletList}>
        <li style={styles.bulletItem}>Greeted customers and assisted with questions and concerns</li>
        <li style={styles.bulletItem}>Operated sole checkout lane, handling 100+ transactions per day</li>
        <li style={styles.bulletItem}>Handled 20+ cash fuel purchases per day</li>
        <li style={styles.bulletItem}>Assisted with stocking, cleaning, and organizing as necessary</li>
      </ul>
    </div>
  </div>

  <h2 style={styles.sectionTitle}>Education</h2>
  <div style={styles.sectionContent}>
    <div><strong>2012 - 2016</strong></div>
    <div>High School Diploma</div>
    <div>Missoula Central High School, Missoula, MT</div>
  </div>

  <div style={styles.footer}>© Jobseeker</div>
</div>

  );
};

export default Template13;