import React from 'react';
import demo_profile from '../../assets/demo_profile.avif';

const Template6 = ({ resumeData }) => {
  const styles = {
    container: {
      maxWidth: '850px',
      margin: '0px auto',
      padding: '0px',
      boxSizing: 'border-box',
      border: '1px solid #e0e0e0',
      fontFamily: "'Segoe UI', Tahoma, sans-serif",
      background: '#fff'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '40px 40px 12px'
    },
    name: {
      margin: '0',
      fontSize: '28px',
      color: '#2585E0',
      fontWeight: '600'
    },
    contactInfo: {
      margin: '6px 0',
      fontSize: '14px',
      color: '#4A4A4A',
      lineHeight: '1.3'
    },
    profilePic: {
      width: '90px',
      height: '90px',
      borderRadius: '50%',
      objectFit: 'cover'
    },
    profileText: {
      marginTop: '20px',
      fontSize: '15px',
      color: '#333',
      lineHeight: '1.7',
      padding: '0px 40px'
    },
    twoColumn: {
      display: 'flex',
      marginTop: '40px',
      borderTop: '1px solid #e0e0e0',
      padding: '0px 40px'
    },
    leftColumn: {
      width: '34%',
      position: 'relative',
      paddingRight: '10px',
      boxSizing: 'border-box',
      paddingTop: '20px',
      paddingBottom: '40px'
    },
    rightColumn: {
      width: '66%',
      paddingLeft: '20px',
      borderLeft: '1px solid #ddd',
      boxSizing: 'border-box',
      paddingTop: '20px',
      paddingBottom: '40px'
    },
    sectionTitle: {
      margin: '0',
      fontSize: '16px',
      color: '#2585E0',
      fontWeight: '600'
    },
    timelineItem: {
      marginTop: '15px',
      display: 'flex',
      flexDirection: 'row-reverse',
      justifyContent: 'flex-end',
      gap: '8px'
    },
    timelineDot: {
      width: '8px',
      height: '8px',
      background: '#2585E0',
      borderRadius: '2px',
      margin: '8px 0'
    },
    timelineDate: {
      margin: '0',
      fontSize: '14px',
      color: '#777'
    },
    jobTitle: {
      margin: '0',
      fontSize: '15px',
      fontWeight: '600',
      color: '#2585E0'
    },
    company: {
      margin: '4px 0',
      fontSize: '14px',
      color: '#2585E0',
      fontWeight: '500'
    },
    bulletList: {
      margin: '8px 0 0 18px',
      padding: '0',
      fontSize: '14px',
      color: '#333',
      lineHeight: '1.6'
    },
    languageContainer: {
      fontSize: '14px',
      color: '#333',
      marginBottom: '8px'
    },
    languageBarBg: {
      width: '100%',
      height: '6px',
      background: '#e6f2fd',
      marginTop: '4px'
    },
    languageBarFill: {
      height: '6px',
      background: '#2585E0'
    },
    link: {
      color: '#2585E0',
      textDecoration: 'none',
      fontWeight: '500'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={{ flex: 1 }}>
          <h1 style={styles.name}>
            {resumeData?.candidateName?.[0]?.firstName} {resumeData?.candidateName?.[0]?.familyName}
          </h1>
          <p style={styles.contactInfo}>
            ✉️ {resumeData?.email?.[0]}   📞 {resumeData?.phoneNumber?.[0]?.formattedNumber}   📍 {resumeData?.location?.formatted}
          </p>
          {resumeData?.website?.[0] && (
            <p style={styles.contactInfo}>
              <a href={resumeData.website[0]} style={styles.link}>
                {resumeData.website[0].replace(/^https?:\/\//, '')}
              </a>
            </p>
          )}
        </div>
        <img 
          src={resumeData?.profilePic || demo_profile} 
          alt="Profile" 
          style={styles.profilePic} 
        />
      </div>

      {/* Profile Summary */}
      <p style={styles.profileText}>
        {resumeData?.summary || 'Professional summary goes here...'}
      </p>

      {/* Two Column Section */}
      <div style={styles.twoColumn}>
        {/* Left Column - Timeline */}
        <div style={styles.leftColumn}>
          {/* Employment Timeline */}
          <h2 style={styles.sectionTitle}>Employment</h2>
          {resumeData?.workExperience?.map((job, index) => (
            <div key={index} style={styles.timelineItem}>
              <p style={styles.timelineDate}>
                {job.workExperienceDates?.start?.date} – {job.workExperienceDates?.end?.date || 'Present'}
              </p>
              <div style={styles.timelineDot}></div>
            </div>
          ))}

          {/* Education Timeline */}
          <h2 style={{ ...styles.sectionTitle, margin: '40px 0 0' }}>Education</h2>
          {resumeData?.education?.map((edu, index) => (
            <div key={index} style={styles.timelineItem}>
              <p style={styles.timelineDate}>
                {edu.educationDates?.start?.date} – {edu.educationDates?.end?.date}
              </p>
              <div style={styles.timelineDot}></div>
            </div>
          ))}

          {/* Languages */}
          <h2 style={{ ...styles.sectionTitle, margin: '40px 0 10px' }}>Languages</h2>
          <div>
            {resumeData?.languages?.map((lang, index) => {
              let width;
              switch(lang.level) {
                case 'Native': width = '90%'; break;
                case 'Advanced': width = '70%'; break;
                case 'Intermediate': width = '50%'; break;
                case 'Beginner': width = '30%'; break;
                default: width = '50%';
              }
              
              return (
                <div key={index} style={styles.languageContainer}>
                  {lang.name}
                  <div style={styles.languageBarBg}>
                    <div style={{ ...styles.languageBarFill, width }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column - Details */}
        <div style={styles.rightColumn}>
          {/* Employment Details */}
          {resumeData?.workExperience?.map((job, index) => (
            <div key={index} style={{ marginBottom: '30px' }}>
              <p style={styles.jobTitle}>{job.workExperienceJobTitle}</p>
              <p style={styles.company}>{job.workExperienceOrganization}</p>
              {job.workExperienceDescription && (
                <ul style={styles.bulletList}>
                  {job.workExperienceDescription.split('\n').map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {/* Education Details */}
          {resumeData?.education?.map((edu, index) => (
            <div key={index} style={{ marginBottom: index === resumeData.education.length - 1 ? 0 : '30px' }}>
              <p style={styles.jobTitle}>{edu.educationAccreditation}</p>
              <p style={styles.company}>{edu.educationOrganization}</p>
              {edu.educationDescription && (
                <p style={{ margin: '8px 0', fontSize: '14px', color: '#333', lineHeight: '1.6' }}>
                  {edu.educationDescription}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Template6;