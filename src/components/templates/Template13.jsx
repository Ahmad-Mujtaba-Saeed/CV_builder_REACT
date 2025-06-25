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
        <div style={styles.name}>
          {resumeData?.candidateName?.[0]?.firstName} {resumeData?.candidateName?.[0]?.familyName}
        </div>
      </div>

      {/* Personal Details */}
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

      {/* Summary */}
      {resumeData?.summary && (
        <>
          <h2 style={styles.sectionTitle}>Summary</h2>
          <div style={styles.summary}>
            {resumeData.summary}
          </div>
        </>
      )}

      {/* Work Experience */}
      {resumeData?.workExperience?.length > 0 && (
        <>
          <h2 style={styles.sectionTitle}>Work Experience</h2>
          <div style={styles.workExperience}>
            {resumeData.workExperience.map((job, index) => (
              <div key={index} style={styles.job}>
                <div style={styles.jobDate}>
                  {job.workExperienceDates?.start?.date} - {job.workExperienceDates?.end?.date || 'Present'}
                </div>
                <div style={styles.jobTitle}>{job.workExperienceJobTitle}</div>
                <div style={styles.jobCompany}>{job.workExperienceOrganization}</div>
                {job.workExperienceDescription && (
                  <ul style={styles.bulletList}>
                    {job.workExperienceDescription.split('\n').map((point, i) => (
                      <li key={i} style={styles.bulletItem}>{point}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Education */}
      {resumeData?.education?.length > 0 && (
        <>
          <h2 style={styles.sectionTitle}>Education</h2>
          <div style={styles.sectionContent}>
            {resumeData.education.map((edu, index) => (
              <div key={index} style={{ marginBottom: '20px' }}>
                <div><strong>{edu.educationDates?.start?.date} - {edu.educationDates?.end?.date}</strong></div>
                <div>{edu.educationAccreditation}</div>
                <div>{edu.educationOrganization}</div>
                {edu.educationDescription && (
                  <ul style={styles.bulletList}>
                    {edu.educationDescription.split('\n').map((point, i) => (
                      <li key={i} style={styles.bulletItem}>{point}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Template13;
