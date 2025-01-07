"use client";

import React from "react";
import styles from "./PricingSection.module.scss";
import { IoSparklesOutline } from "react-icons/io5";

const PricingSection = () => {
  return (
    <div className={styles.PricingSection}>
      <div className={styles.pricingHeader}>
        <h2>Simple, transparent pricing</h2>
        <p>Grab your early bird access quickly!</p>
      </div>

      <div className={styles.pricingCards}>
        <div className={styles.pricingCard}>
          <div className={styles.limitedBadge}>Limited Time Offer</div>
          <div className={styles.cardContent}>
            <h3>Early Bird Access</h3>
            <p className={styles.seatsLeft}>Only 2 seats remaining</p>
            <div className={styles.price}>
              <span className={styles.amount}>$1,500</span>
              <span className={styles.period}>/month</span>
            </div>
            <div className={styles.features}>
              <div className={styles.feature}>
                ✓ Full access to all features
              </div>
              <div className={styles.feature}>✓ React / Next.js / code</div>
              <div className={styles.feature}>
                ✓ Unlimited Custom AI automations
              </div>
              <div className={styles.feature}>
                ✓ Unlimited AI Agents & Chatbots
              </div>
              <div className={styles.feature}>
                ✓ Unlimited MVPs, Website, AI Apps and Sass development
              </div>
              <div className={styles.feature}>
                ✓ Unlimited Custom React Components
              </div>
              <div className={styles.feature}>✓ Unlimited Revisions</div>
              <div className={styles.feature}>✓ Search Engine Optimization</div>
              <div className={styles.feature}>
                ✓ 24-hour support response time
              </div>
              <div className={styles.feature}>
                ✓ Full Access to private Google workspace
              </div>
              <div className={styles.feature}>
                ✓ Full Access to Email marketing automations
              </div>
            </div>
            <button className={styles.actionBtn}>
              <IoSparklesOutline className={styles.btnIcon} />
              Get Started Now
            </button>
          </div>
        </div>

        <div className={`${styles.pricingCard} ${styles.regular}`}>
          <div className={styles.cardContent}>
            <h3>Regular Access</h3>
            <p className={styles.seatsLeft}>Available after early bird ends</p>
            <div className={styles.price}>
              <span className={styles.amount}>$3,000</span>
              <span className={styles.period}>/month</span>
            </div>
            <div className={styles.features}>
              <div className={styles.feature}>
                ✓ Full access to all features
              </div>
              <div className={styles.feature}>✓ React / Next.js / code</div>
              <div className={styles.feature}>
                ✓ Unlimited Custom AI automations
              </div>
              <div className={styles.feature}>
                ✓ Unlimited AI Agents & Chatbots
              </div>
              <div className={styles.feature}>
                ✓ Unlimited MVPs, Website, AI Apps and Sass development
              </div>
              <div className={styles.feature}>
                ✓ Unlimited Custom React Components
              </div>
              <div className={styles.feature}>✓ Unlimited Revisions</div>
              <div className={styles.feature}>✓ Search Engine Optimization</div>
              <div className={styles.feature}>
                ✓ 24-hour support response time
              </div>
              <div className={styles.feature}>
                ✓ Full Access to private Google workspace
              </div>
              <div className={styles.feature}>
                ✓ Full Access to Email marketing automations
              </div>
            </div>
            <button className={styles.actionBtn}>Join Waitlist</button>
          </div>
        </div>
      </div>

      <div className={styles.guarantee}>
        All plans include 7-day money-back guarantee
      </div>
    </div>
  );
};

export default PricingSection;
