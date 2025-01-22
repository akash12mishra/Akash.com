"use client";

import React from "react";
import styles from "./PricingSection.module.scss";
import { IoSparklesOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";

const PricingSection = () => {
  const router = useRouter();

  return (
    <div className={styles.PricingSection}>
      <div className={styles.pricingHeader}>
        <h2>Simple, transparent pricing</h2>
        <p>Choose the plan that is right for you</p>
      </div>

      <div className={styles.pricingCards}>
        <div className={`${styles.pricingCard} ${styles.regular}`}>
          {/* <div className={styles.limitedBadge}>Most Popular</div> */}
          <div className={styles.cardContent}>
            <h3> AI Bundle</h3>
            <p className={styles.seatsLeft}>
              Monthly Recurring (cancel anytime)
            </p>
            <div className={styles.price}>
              <span className={styles.amount}>$1,000</span>
              <span className={styles.period}>/month</span>
            </div>
            <div className={styles.features}>
              <div className={styles.feature}>
                ✓ Unlimited Custom AI automations
              </div>
              <div className={styles.feature}>
                ✓ Unlimited AI Agents & Chatbots
              </div>
              <div className={styles.feature}>✓ Unlimited Revisions</div>
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
            <button
              onClick={() =>
                window.open(
                  "https://calendly.com/arkalal-chakravarty/30min",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
              className={styles.actionBtn}
            >
              <IoSparklesOutline className={styles.btnIcon} />
              Book a Call
            </button>
          </div>
        </div>

        <div className={styles.pricingCard}>
          <div className={styles.limitedBadge}>Most Popular</div>
          <div className={styles.cardContent}>
            <h3>Development Bundle</h3>
            <p className={styles.seatsLeft}>One Time</p>
            <div className={styles.price}>
              <span className={styles.amount}>$2,000</span>
              {/* <span className={styles.period}>/month</span> */}
            </div>
            <div className={styles.features}>
              <div className={styles.feature}>
                ✓ Includes AI Bundle features for 30 days for free
              </div>
              {/* <div className={styles.feature}>✓ React / Next.js / code</div> */}
              <div className={styles.feature}>
                ✓ Complete MVP, Website, AI App and Sass development under 4
                weeks
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
            </div>
            <button
              onClick={() =>
                window.open(
                  "https://calendly.com/arkalal-chakravarty/30min",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
              className={styles.actionBtn}
            >
              <IoSparklesOutline className={styles.btnIcon} />
              Book a Call
            </button>
          </div>
        </div>

        <div className={`${styles.pricingCard} ${styles.regular}`}>
          <div className={styles.cardContent}>
            <h3>Retainer Bundle</h3>
            <p className={styles.seatsLeft}>
              Monthly Recurring (cancel anytime)
            </p>
            <div className={styles.price}>
              <span className={styles.amount}>$3,000</span>
              <span className={styles.period}>/month</span>
            </div>
            <div className={styles.features}>
              <div className={styles.feature}>
                ✓ Includes AI Bundle features
              </div>
              {/* <div className={styles.feature}>
                ✓ 80 hours of development time per month
              </div> */}
              {/* <div className={styles.feature}>✓ React / Next.js / code</div> */}
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
            </div>
            <button
              onClick={() =>
                window.open(
                  "https://calendly.com/arkalal-chakravarty/30min",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
              className={`${styles.actionBtn}`}
            >
              <IoSparklesOutline className={styles.btnIcon} />
              Book a Call
            </button>
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
