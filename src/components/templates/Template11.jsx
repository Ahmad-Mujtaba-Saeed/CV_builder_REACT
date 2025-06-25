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
      marginBottom: '10px',
    },
    headline: {
      fontSize: '16px',
      fontStyle: 'italic',
      color: '#444',
      marginBottom: '10px',
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
      fontSize: '13px',
    },
  };

  return (
    <div style={styles.resumeContainer}>
      <h1 style={styles.resumeTitle}>
        {resumeData?.candidateName?.[0]?.firstName} {resumeData?.candidateName?.[0]?.familyName}
      </h1>
      <hr style={styles.horizontalRule} />

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Personal details</h2>
        <div style={styles.personalDetails}>
          {resumeData?.location?.formatted && (
            <div style={styles.detailItem}>
              <span style={styles.label}>Address:</span> {resumeData.location.formatted}
            </div>
          )}
          {resumeData?.email?.[0] && (
            <div style={styles.detailItem}>
              <span style={styles.label}>Email address:</span> {resumeData.email[0]}
            </div>
          )}
          {resumeData?.phoneNumber?.[0]?.formattedNumber && (
            <div style={styles.detailItem}>
              <span style={styles.label}>Phone number:</span> {resumeData.phoneNumber[0].formattedNumber}
            </div>
          )}
          {resumeData?.website?.[0] && (
            <div style={styles.detailItem}>
              <span style={styles.label}>LinkedIn:</span> {resumeData.website[0].replace(/^https?:\/\//, '')}
            </div>
          )}
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Summary</h2>
        <p style={styles.summary}>
          {resumeData?.summary || 'Professional summary goes here...'}
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Education</h2>
        {resumeData?.education?.map((edu, index) => (
          <div key={index} style={styles.eduItem}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong style={styles.eduInstitution}>
                {edu.educationAccreditation}
                {edu.educationAreaOfStudy && `, ${edu.educationAreaOfStudy}`}
              </strong>
              {edu.educationDates && (
                <span style={styles.eduDate}>
                  {edu.educationDates.start?.date} - {edu.educationDates.end?.date || 'Present'}
                </span>
              )}
            </div>
            {edu.educationOrganization && (
              <div style={styles.eduLocation}>{edu.educationOrganization}</div>
            )}
            {edu.educationDescription && (
              <>
                <p style={styles.italicLabel}>
                  <strong><u>Notable Coursework</u></strong>
                </p>
                <ul style={styles.bulletList}>
                  {edu.educationDescription.split('\n').map((item, i) => (
                    <li key={i} style={styles.bulletItem}>{item}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ))}
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Employment</h2>
        {resumeData?.workExperience?.map((job, index) => (
          <div key={index} style={styles.employmentItem}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={styles.jobTitle}>{job.workExperienceJobTitle}</div>
              <div style={styles.jobDate}>
                {job.workExperienceDates?.start?.date} - {job.workExperienceDates?.end?.date || 'Present'}
              </div>
            </div>
            <div style={styles.jobOrg}>{job.workExperienceOrganization}</div>
            {job.workExperienceDescription && (
              <ul style={styles.bulletList}>
                {job.workExperienceDescription.split('\n').map((item, i) => (
                  <li key={i} style={styles.bulletItem}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>

      {resumeData?.skill?.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Skills</h2>
          <ul style={styles.bulletList}>
          {(resumeData?.skill || []).filter(skill => skill.selected).map((skill, index) => (
              <li key={index} style={styles.bulletItem}>
                <strong>{skill.name}:</strong> {skill.level || 'Proficient'}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default Template11;
