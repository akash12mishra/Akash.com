import React from "react";
import styles from "./BuildInPublic.module.scss";
import Image from "next/image";
import linkPost1 from "../../../assets/images/Socials/linkPost1.png";
import linkPost2 from "../../../assets/images/Socials/linkPost2.png";
import linkPost3 from "../../../assets/images/Socials/linkPost3.png";
import xPost1 from "../../../assets/images/Socials/xPost1.png";
import xPost2 from "../../../assets/images/Socials/xPost2.png";
import xPost3 from "../../../assets/images/Socials/xPost3.png";

const testimonials = [
  {
    id: 1,
    image: linkPost1,
    link: "https://twitter.com/demo1",
  },
  {
    id: 2,
    image: linkPost2,
    link: "https://twitter.com/demo2",
  },
  {
    id: 3,
    image: linkPost3,
    link: "https://twitter.com/demo3",
  },
];

const bottomTestimonials = [
  {
    id: 4,
    image: xPost1,
    link: "https://twitter.com/demo4",
  },
  {
    id: 5,
    image: xPost2,
    link: "https://twitter.com/demo5",
  },
  {
    id: 6,
    image: xPost3,
    link: "https://twitter.com/demo6",
  },
];

const BuildInPublic = () => {
  return (
    <div className={styles.BuildInPublic}>
      <div className={styles.testimonialHeader}>
        <span className={styles.label}>#buildinpublic</span>
        <h2 className={styles.title}>
          My <span>#buildinpublic</span> Journey
        </h2>
        <p className={styles.subtitle}>
          Experience my unwavering dedication to building innovative projects
          and sharing every milestone in real-time on X and LinkedIn via
          #buildinpublic.
        </p>
      </div>

      <div className={styles.cardsContainer}>
        <div className={styles.gradientLeft}></div>
        <div className={styles.gradientRight}></div>

        <div className={styles.scrollContainer}>
          <div className={styles.row}>
            {[...testimonials, ...testimonials].map((item, index) => (
              <a
                key={`${item.id}-${index}`}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.card}
              >
                <div className={styles.content}>
                  <Image
                    src={item.image}
                    alt="Social media post"
                    width={500}
                    height={300}
                    className={styles.avatar}
                  />
                </div>
              </a>
            ))}
          </div>

          <div className={`${styles.row} ${styles.reverse}`}>
            {[...bottomTestimonials, ...bottomTestimonials].map(
              (item, index) => (
                <a
                  key={`${item.id}-${index}`}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.card}
                >
                  <div className={styles.content}>
                    <Image
                      src={item.image}
                      alt="Social media post"
                      width={500}
                      height={300}
                      className={styles.avatar}
                    />
                  </div>
                </a>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildInPublic;
