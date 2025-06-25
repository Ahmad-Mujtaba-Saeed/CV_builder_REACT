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
          margin: '20px 0',
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
        contactInfo: {
          margin: 0,
        },
        contactParagraph: {
          margin: '5px 0',
        },
        education: {
          marginBottom: '20px',
        },
        experience: {
          marginBottom: '20px',
        },
        activities: {
          marginBottom: '20px',
        },
        ul: {
          paddingLeft: '20px',
          margin: '8px 0',
        },
        li: {
          marginBottom: '6px',
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
        grid2: {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
        }
      };
  return (
    <div style={styles.resumeContainer}>
  <div style={styles.container}>
    <h1 style={styles.resumeTitle}>{resumeData?.candidateName?.[0]?.firstName} {resumeData?.candidateName?.[0]?.familyName}</h1>

    {/* Personal Details */}
    <section style={styles.section}>
      <div style={styles.sectionTitle}>Personal details</div>
      <div style={{ ...styles.sectionContent, ...styles.contactInfo }}>
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
      </div>
    </section>

    {/* Resume Objective */}
    <section style={styles.section}>
      <div style={styles.sectionTitle}>Resume Objective</div>
      <div style={styles.sectionContent}>
        <p>
          BA student in English at UCLA, seeking to leverage strong writing and research skills and knowledge of contemporary literature to join the Random House Publishing team as an Editorial Assistant. President’s Honor Roll recipient every semester, have earned multiple merit-based scholarships, and have experience studying abroad.
        </p>
      </div>
    </section>

    {/* Education */}
    <section style={styles.section}>
      <div style={styles.sectionTitle}>Education</div>
      <div style={{ ...styles.sectionContent, ...styles.education }}>
        <p style={styles.jobTitle}>Bachelor of Arts, English</p>
        <p style={styles.jobInfo}>
          UCLA, Los Angeles, CA<br />
          Expected Graduation Date: May 2022
        </p>
        <ul style={styles.ul}>
          <li style={styles.li}>GPA: 3.9</li>
          <li style={styles.li}>President’s Honor Roll every semester</li>
          <li style={styles.li}>Studied abroad in London, Fall 2020</li>
          <li style={styles.li}>Won 3 merit-based scholarships</li>
        </ul>
      </div>
    </section>

    {/* Work Experience */}
    <section style={styles.section}>
      <div style={styles.sectionTitle}>Work Experience</div>
      <div style={{ ...styles.sectionContent, ...styles.experience }}>
        <p style={styles.date}>May 2020 – Aug 2020</p>
        <p style={styles.jobTitle}>Editorial Intern</p>
        <p style={styles.jobInfo}>Bookworm Publishing, Los Angeles, CA</p>
        <ul style={styles.ul}>
          <li style={styles.li}>Shadowed experienced editor to learn the entire editing process</li>
          <li style={styles.li}>Marked up real book chapters for review by mentor</li>
          <li style={styles.li}>Assisted with proofreading and basic formatting</li>
        </ul>
      </div>
    </section>

    {/* Extracurricular Activities */}
    <section style={styles.section}>
      <div style={styles.sectionTitle}>Extracurricular Activities</div>
      <div style={{ ...styles.sectionContent, ...styles.activities }}>
        <p style={styles.date}>Aug 2019 – Present</p>
        <p style={styles.jobTitle}>Editor of Student Newspaper</p>
        <p style={styles.jobInfo}>UCLA Weekly, Los Angeles, CA</p>
        <ul style={styles.ul}>
          <li style={styles.li}>Edit and format the weekly student newspaper</li>
          <li style={styles.li}>Contribute articles on occasion</li>
          <li style={styles.li}>Assign and collect all articles from staff writers</li>
        </ul>

        <p style={styles.date}>Aug 2020 – Present</p>
        <p style={styles.jobTitle}>Intramural Water Polo Team Captain</p>
        <p style={styles.jobInfo}>UCLA, Los Angeles, CA</p>
        <ul style={styles.ul}>
          <li style={styles.li}>Organize and hold annual team tryouts</li>
          <li style={styles.li}>Plan practice schedule and games</li>
          <li style={styles.li}>Perform other duties as assigned by coach</li>
        </ul>
      </div>
    </section>
  </div>
</div>

  );
};

export default Template12;