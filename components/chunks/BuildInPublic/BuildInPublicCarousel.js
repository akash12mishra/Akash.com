"use client";

import React from "react";
import styles from "./BuildInPublicCarousel.module.scss";
import Image from "next/image";
import { FiExternalLink } from "react-icons/fi";

import linkPost1 from "../../../assets/images/Socials/linkPost1.png";
import linkPost2 from "../../../assets/images/Socials/linkPost2.png";
import linkPost3 from "../../../assets/images/Socials/linkPost3.png";
import xPost1 from "../../../assets/images/Socials/xPost1.png";
import xPost2 from "../../../assets/images/Socials/xPost2.png";
import xPost3 from "../../../assets/images/Socials/xPost3.png";

const allPosts = [
  {
    id: "li-1",
    image: linkPost1,
    platform: "linkedin",
    link: "https://www.linkedin.com/posts/arkalal_the-harsh-truth-about-building-saas-mvps-activity-7381168964229513216-w0RJ?utm_source=share&utm_medium=member_desktop&rcm=ACoAACEK0AwBq29eqk-Q-7_FsDHB32Yxq4h0p_s",
  },
  {
    id: "x-1",
    image: xPost1,
    platform: "x",
    link: "https://x.com/arka_codes/status/1983773028132462664",
  },
  {
    id: "li-2",
    image: linkPost2,
    platform: "linkedin",
    link: "https://www.linkedin.com/posts/arkalal_ive-seen-a-shift-in-how-developers-activity-7383524420293890048-2HJG?utm_source=share&utm_medium=member_desktop&rcm=ACoAACEK0AwBq29eqk-Q-7_FsDHB32Yxq4h0p_s",
  },
  {
    id: "x-2",
    image: xPost2,
    platform: "x",
    link: "https://x.com/arka_codes/status/1982832159036432523",
  },
  {
    id: "li-3",
    image: linkPost3,
    platform: "linkedin",
    link: "https://www.linkedin.com/posts/arkalal_building-a-scalable-saas-mvp-isnt-just-about-activity-7393490086593605632-sdBk?utm_source=share&utm_medium=member_desktop&rcm=ACoAACEK0AwBq29eqk-Q-7_FsDHB32Yxq4h0p_s",
  },
  {
    id: "x-3",
    image: xPost3,
    platform: "x",
    link: "https://x.com/arka_codes/status/1982605665861554439",
  },
];

const BuildInPublicCarousel = () => {
  return (
    <section id="buildinpublic" className={styles.buildinPublicSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>#buildinpublic</span>
        </div>

        <div className={styles.masonryGrid}>
          {allPosts.map((post) => (
            <a
              key={post.id}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.postCard} ${styles[post.platform]}`}
            >
              <div className={styles.cardInner}>
                <div className={styles.postImageWrapper}>
                  <Image
                    src={post.image}
                    alt={`${post.platform === "linkedin" ? "LinkedIn" : "X"} Post`}
                    width={400}
                    height={500}
                    className={styles.postImage}
                  />
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.viewLink}>
                    <FiExternalLink size={14} />
                    <span>View Post</span>
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BuildInPublicCarousel;
