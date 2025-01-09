import React from "react";
import styles from "./PrivacyPolicy.module.scss";

const PrivacyPolicy = () => {
  return (
    <div className={styles.PrivacyPolicy}>
      <div className={styles.privacyContainer}>
        <h1>Privacy Policy</h1>

        <section>
          <h2>1. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us including:
          </p>
          <ul>
            <li>Name and email address when scheduling meetings</li>
            <li>Calendar access for scheduling purposes</li>
            <li>Communication preferences</li>
          </ul>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <p>We use the collected information for:</p>
          <ul>
            <li>Scheduling and managing meetings</li>
            <li>Sending meeting confirmations and updates</li>
            <li>Providing our services</li>
            <li>Improving user experience</li>
          </ul>
        </section>

        <section>
          <h2>3. Calendar Integration</h2>
          <p>When you use our scheduling feature:</p>
          <ul>
            <li>
              We access your Google Calendar only with your explicit permission
            </li>
            <li>Calendar access is used solely for scheduling meetings</li>
            <li>We dont store or share your calendar data</li>
          </ul>
        </section>

        <section>
          <h2>4. Data Protection</h2>
          <p>
            We implement security measures to protect your personal information:
          </p>
          <ul>
            <li>Secure SSL encryption</li>
            <li>Regular security audits</li>
            <li>Limited access to personal data</li>
          </ul>
        </section>

        <section>
          <h2>5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Request data deletion</li>
            <li>Opt-out of communications</li>
          </ul>
        </section>

        <section>
          <h2>6. Google API Services</h2>
          <p>Our application uses Google Calendar API and adheres to:</p>
          <ul>
            <li>Google API Services User Data Policy</li>
            <li>Limited use of Google API data only for scheduling</li>
            <li>No transferring, selling, or misusing Google user data</li>
            <li>Access only with explicit user consent</li>
            <li>Users can revoke access through Google Security settings</li>
          </ul>
        </section>

        <section>
          <h2>7. Data Retention & Deletion</h2>
          <p>Regarding Google Calendar data:</p>
          <ul>
            <li>Calendar data is only accessed for scheduling</li>
            <li>We dont store calendar data beyond scheduling needs</li>
            <li>
              Users can request data deletion by contacting
              admin@arkalalchakravarty.com
            </li>
            <li>Account deletion requests are processed within 30 days</li>
          </ul>
        </section>

        <section className={styles.lastUpdated}>
          <p>Last Updated: January 9, 2025</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
