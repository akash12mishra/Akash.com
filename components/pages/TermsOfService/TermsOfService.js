import React from "react";
import styles from "./TermsOfService.module.scss";

const TermsOfService = () => {
  return (
    <div className={styles.TermsOfService}>
      <div className={styles.termsContainer}>
        <h1>Terms of Service</h1>

        <section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to arkalalchakravarty.com. By accessing our website, you
            agree to these terms of service.
          </p>
        </section>

        <section>
          <h2>2. Services</h2>
          <p>
            We provide web development, AI integration, and consulting services
            including:
          </p>
          <ul>
            <li>Website planning, design and development</li>
            <li>Full Deployment and Maintenance</li>
            <li>Custom AI Automations & Integrations</li>
          </ul>
        </section>

        <section>
          <h2>3. Meeting Scheduling</h2>
          <p>When scheduling meetings through our platform:</p>
          <ul>
            <li>All scheduled meetings are subject to availability</li>
            <li>Cancellations must be made at least 24 hours in advance</li>
            <li>Meeting links will be provided via email</li>
          </ul>
        </section>

        <section>
          <h2>4. Privacy & Data</h2>
          <p>
            We respect your privacy and handle data in accordance with our
            Privacy Policy.
          </p>
        </section>

        <section>
          <h2>5. Intellectual Property</h2>
          <p>
            All content on arkalalchakravarty.com is protected by intellectual
            property rights.
          </p>
        </section>

        <section>
          <h2>6. Limitation of Liability</h2>
          <p>
            Our services are provided as is without any warranties, express or
            implied.
          </p>
        </section>

        <section>
          <h2>7. Google API Services</h2>
          <p>By using our service you also agree to:</p>
          <ul>
            <li>Googles Privacy Policy</li>
            <li>Googles Terms of Service</li>
            <li>
              Our limited use of Google Calendar data solely for scheduling
              purposes
            </li>
          </ul>
        </section>

        <section className={styles.lastUpdated}>
          <p>Last Updated: January 9, 2025</p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
