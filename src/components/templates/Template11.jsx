import React from 'react';
import demo_profile from '../../assets/demo_profile.avif';

const Template11 = ({ resumeData }) => {
    const styles = {
        resumeContainer: {
          fontFamily: 'Arial, sans-serif',
          padding: '40px',
          backgroundColor: '#fff',
          color: '#000',
          lineHeight: 1.6,
          maxWidth: '900px',
          margin: '0 auto',
        },
        resumeTitle: {
          textAlign: 'left',
          fontSize: '28px',
          fontWeight: 'bold',
          marginBottom: '20px',
        },
        horizontalRule: {
          border: 'none',
          borderTop: '4px solid #000',
          margin: '20px 0',
        },
        section: {
          marginBottom: '25px',
        },
        sectionTitle: {
          backgroundColor: '#000',
          color: '#fff',
          padding: '6px 10px',
          fontSize: '14px',
          fontWeight: 'bold',
          display: 'inline-block',
          marginBottom: '10px',
        },
        detailText: {
          margin: '2px 0',
          fontSize: '14px',
        },
        summary: {
          fontSize: '14px',
          marginTop: '10px',
        },
        eduItem: {
          marginBottom: '20px',
        },
        eduInstitution: {
          fontWeight: 'bold',
          fontSize: '14px',
        },
        eduLocation: {
          fontStyle: 'italic',
          fontSize: '13px',
          marginBottom: '5px',
        },
        eduDate: {
          float: 'right',
          fontSize: '13px',
        },
        bulletList: {
          marginTop: '5px',
          paddingLeft: '18px',
        },
        bulletItem: {
          fontSize: '13px',
          marginBottom: '4px',
        },
        italicLabel: {
          fontStyle: 'italic',
          fontSize: '13px',
          marginBottom: '4px',
        },
        employmentItem: {
          marginBottom: '20px',
        },
        jobTitle: {
          fontWeight: 'bold',
          fontSize: '14px',
        },
        jobOrg: {
          fontSize: '13px',
          color: '#666',
          marginBottom: '4px',
        },
        jobDate: {
          float: 'right',
          fontSize: '13px',
        }
      };
      
      

<style>
    
</style>
  return (
    <div style={styles.resumeContainer}>
  <h1 style={styles.resumeTitle}>{resumeData?.candidateName?.[0]?.firstName} {resumeData?.candidateName?.[0]?.familyName}</h1>
  <hr style={styles.horizontalRule} />

  <section style={styles.section}>
    <h2 style={styles.sectionTitle}>Personal details</h2>
    <div style={styles.personalDetails}>
    {resumeData?.location?.formatted && (
      <div style={styles.detailItem}><span style={styles.label}>Address:</span> {resumeData.location.formatted}</div>
    )}
    {resumeData?.email?.[0] && (
      <div style={styles.detailItem}><span style={styles.label}>Email address:</span> {resumeData.email[0]}</div>
    )}
    {resumeData?.phoneNumber?.[0]?.formattedNumber && (
      <div style={styles.detailItem}><span style={styles.label}>Phone number:</span> {resumeData.phoneNumber[0].formattedNumber}</div>
    )}
    {resumeData?.website?.[0] && (
      <div style={styles.detailItem}><span style={styles.label}>LinkedIn:</span> {resumeData.website[0].replace(/^https?:\/\//, '')}</div>
    )}
    </div>
  </section>

  <section style={styles.section}>
    <h2 style={styles.sectionTitle}>Summary</h2>
    <p style={styles.summary}>
      Strategic and creative team player proficient in geographic information systems software with proven experience in public policy and community development. Masters-level coursework in community engagement, applied planning, and planning regulations. Currently searching for an internship in community and economic development.
    </p>
  </section>

  <section style={styles.section}>
    <h2 style={styles.sectionTitle}>Education</h2>

    <div style={styles.eduItem}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <strong style={styles.eduInstitution}>City & Regional Planning Master’s Candidate</strong>
        <span style={styles.eduDate}>Sep 2022 - Present</span>
      </div>
      <div style={styles.eduLocation}>Georgia Institute of Technology</div>
      <p style={styles.italicLabel}><strong><u>Notable Coursework</u></strong></p>
      <ul style={styles.bulletList}>
        <li style={styles.bulletItem}>Economic Analysis in Planning</li>
        <li style={styles.bulletItem}>Advanced Geographic Information Systems</li>
        <li style={styles.bulletItem}>Geodemographics: Data Sources & Methods</li>
        <li style={styles.bulletItem}>Citizen Participation & Community Engagement</li>
      </ul>
      <p style={styles.italicLabel}><strong><u>Extracurricular Activities</u></strong></p>
      <ul style={styles.bulletList}>
        <li style={styles.bulletItem}>Student Government Association Graduate Student Senator</li>
      </ul>
    </div>

    <div style={styles.eduItem}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <strong style={styles.eduInstitution}>B.A in Anthropology and Architecture, Political Ecology Track</strong>
        <span style={styles.eduDate}>Sep 2018 - May 2022</span>
      </div>
      <div style={styles.eduLocation}>Columbia University</div>
      <p style={styles.italicLabel}><strong><u>Notable Coursework</u></strong></p>
      <ul style={styles.bulletList}>
        <li style={styles.bulletItem}>City, Environment, & Vulnerability</li>
        <li style={styles.bulletItem}>Neighborhood & Community Development</li>
        <li style={styles.bulletItem}>GIS Methods & Spatial Analysis</li>
      </ul>
      <p style={styles.italicLabel}><strong><u>Extracurricular Activities</u></strong></p>
      <ul style={styles.bulletList}>
        <li style={styles.bulletItem}>Political Science Student’s Association</li>
        <li style={styles.bulletItem}>Columbia Mentoring Initiative</li>
        <li style={styles.bulletItem}>Multicultural Affairs Advisory Council</li>
      </ul>
    </div>
  </section>

  <section style={styles.section}>
    <h2 style={styles.sectionTitle}>Employment</h2>

    <div style={styles.employmentItem}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={styles.jobTitle}>Program Officer</div>
        <div style={styles.jobDate}>Jun 2022 - Aug 2023</div>
      </div>
      <div style={styles.jobOrg}>Woodard Community Development Foundation, Atlanta, GA</div>
      <ul style={styles.bulletList}>
        <li style={styles.bulletItem}>Collaborate with the Senior Program Officer to read funding proposals and make strategic decisions about grant fund disbursement</li>
        <li style={styles.bulletItem}>Write community development reports, including long-range planning documents and impact reports</li>
        <li style={styles.bulletItem}>Record, maintain, and analyze data used for community planning and general plan development and revision</li>
      </ul>
    </div>

    <div style={styles.employmentItem}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={styles.jobTitle}>Development Assistant</div>
        <div style={styles.jobDate}>Sep 2019 - Mar 2020</div>
      </div>
      <div style={styles.jobOrg}>Harlem Rising Together, New York, NY</div>
      <ul style={styles.bulletList}>
        <li style={styles.bulletItem}>Provided office support to the organization’s staff members, including managing office supply inventory, receiving</li>
      </ul>
    </div>
  </section>
    </div>

  );
};

export default Template11;