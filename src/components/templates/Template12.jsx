import React from 'react';
import demo_profile from '../../assets/demo_profile.avif';

const Template12 = ({ resumeData }) => {
  const styles = {
    resumeContainer: {
      fontFamily: 'Arial, sans-serif',
      margin: 0,
      padding: '40px',
      backgroundColor: '#fff',
      color: '#000',
    },
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      border: '1px solid #ccc',
      padding: 0,
    },
    resumeTitle: {
      textAlign: 'center',
      fontSize: '28px',
      margin: '20px 0 5px',
    },
    headline: {
      textAlign: 'center',
      fontSize: '16px',
      fontStyle: 'italic',
      color: '#444',
      marginBottom: '20px',
    },
    profileImage: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '20px',
    },
    image: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '2px solid #ccc',
    },
    section: {
      margin: 0,
      borderTop: '5px solid #666',
    },
    sectionTitle: {
      backgroundColor: '#666',
      color: '#fff',
      fontWeight: 'bold',
      padding: '8px 12px',
      fontSize: '16px',
    },
    sectionContent: {
      padding: '12px',
    },
    contactParagraph: {
      margin: '5px 0',
    },
    jobTitle: {
      fontWeight: 'bold',
    },
    jobInfo: {
      marginBottom: '8px',
      fontSize: '14px',
      color: '#333',
    },
    date: {
      fontWeight: 'bold',
    },
    ul: {
      paddingLeft: '20px',
      margin: '8px 0',
    },
    li: {
      marginBottom: '6px',
    },
  };

  return (
    <div style={styles.resumeContainer}>
      <div style={styles.container}>
        <div style={styles.profileImage}>
          <img
            src={resumeData?.profilePic || demo_profile}
            alt="Profile"
            style={styles.image}
          />
        </div>
        <h1 style={styles.resumeTitle}>
          {resumeData?.candidateName?.[0]?.firstName} {resumeData?.candidateName?.[0]?.familyName}
        </h1>
        <p style={styles.headline}>
          {resumeData?.headline || 'Professional title'}
        </p>

        {/* Personal Details */}
        <section style={styles.section}>
          <div style={styles.sectionTitle}>Personal Details</div>
          <div style={styles.sectionContent}>
            {resumeData?.email?.[0] && (
              <p style={styles.contactParagraph}>
                <strong>Email address:</strong> {resumeData.email[0]}
              </p>
            )}
            {resumeData?.phoneNumber?.[0]?.formattedNumber && (
              <p style={styles.contactParagraph}>
                <strong>Phone number:</strong> {resumeData.phoneNumber[0].formattedNumber}
              </p>
            )}
            {resumeData?.location?.formatted && (
              <p style={styles.contactParagraph}>
                <strong>Address:</strong> {resumeData.location.formatted}
              </p>
            )}
            {resumeData?.website?.[0] && (
              <p style={styles.contactParagraph}>
                <strong>Website:</strong> {resumeData.website[0].replace(/^https?:\/\//, '')}
              </p>
            )}
          </div>
        </section>

        {/* Resume Objective / Summary */}
        <section style={styles.section}>
          <div style={styles.sectionTitle}>Profile</div>
          <div style={styles.sectionContent}>
            <p>{resumeData?.summary || 'Professional summary goes here...'}</p>
          </div>
        </section>

        {/* Education */}
        {resumeData?.education?.length > 0 && (
          <section style={styles.section}>
            <div style={styles.sectionTitle}>Education</div>
            <div style={styles.sectionContent}>
              {resumeData.education.map((edu, index) => (
                <div key={index} style={{ marginBottom: '15px' }}>
                  <p style={styles.date}>
                    {edu.educationDates?.start?.date} - {edu.educationDates?.end?.date}
                  </p>
                  <p style={styles.jobTitle}>{edu.educationAccreditation}</p>
                  <p style={styles.jobInfo}>{edu.educationOrganization}</p>
                  {edu.educationDescription && (
                    <ul style={styles.ul}>
                      {edu.educationDescription.split('\n').map((desc, i) => (
                        <li key={i} style={styles.li}>{desc}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Work Experience */}
        {resumeData?.workExperience?.length > 0 && (
          <section style={styles.section}>
            <div style={styles.sectionTitle}>Work Experience</div>
            <div style={styles.sectionContent}>
              {resumeData.workExperience.map((job, index) => (
                <div key={index} style={{ marginBottom: '15px' }}>
                  <p style={styles.date}>
                    {job.workExperienceDates?.start?.date} - {job.workExperienceDates?.end?.date || 'Present'}
                  </p>
                  <p style={styles.jobTitle}>{job.workExperienceJobTitle}</p>
                  <p style={styles.jobInfo}>{job.workExperienceOrganization}</p>
                  {job.workExperienceDescription && (
                    <ul style={styles.ul}>
                      {job.workExperienceDescription.split('\n').map((desc, i) => (
                        <li key={i} style={styles.li}>{desc}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Template12;
