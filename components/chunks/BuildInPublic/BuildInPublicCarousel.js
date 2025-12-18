"use client";

import React, { useRef, useEffect } from "react";
import styles from "./BuildInPublicCarousel.module.scss";
import Script from "next/script";
import { FiExternalLink } from "react-icons/fi";

const linkedInPosts = [
  {
    id: "li-1",
    src: "https://www.linkedin.com/embed/feed/update/urn:li:share:7393220213707739136",
  },
  {
    id: "li-2",
    src: "https://www.linkedin.com/embed/feed/update/urn:li:share:7393219927739940864",
  },
  {
    id: "li-3",
    src: "https://www.linkedin.com/embed/feed/update/urn:li:share:7389239436724719617",
  },
];

const xPosts = [
  {
    id: "x-1",
    html: `<blockquote class="twitter-tweet" data-theme="light" data-width="100%"><p lang="en" dir="ltr">3.7 years ago — I just wanted to learn how to code.<br><br>Today — I build &amp; ship AI SaaS MVPs in ≤21 days for founders worldwide ⚡<br><br>From working on US Gov healthcare projects → to launching my own agency → to helping startups scale fast.<br><br>Every step was a lesson in execution &amp;…</p>&mdash; Arka Lal Chakravarty (@arka_codes) <a href="https://twitter.com/arka_codes/status/1987905587892330618?ref_src=twsrc%5Etfw">November 10, 2025</a></blockquote>`,
    link: "https://twitter.com/arka_codes/status/1987905587892330618",
  },
  {
    id: "x-2",
    html: `<blockquote class="twitter-tweet" data-theme="light" data-width="100%"><p lang="en" dir="ltr">AI isn't killing jobs — it's killing slow execution.<br><br>The best builders now use:<br>⚙️ Agents to automate workflows<br>🧠 RAG pipelines for memory<br>⚡ Fast MVP cycles to stay ahead<br><br>We're entering the Agentic SaaS Era —<br>where apps think, act, and improve on their own.<br><br>Learn this stack…</p>&mdash; Arka Lal Chakravarty (@arka_codes) <a href="https://twitter.com/arka_codes/status/1983919323950543094?ref_src=twsrc%5Etfw">October 30, 2025</a></blockquote>`,
    link: "https://twitter.com/arka_codes/status/1983919323950543094",
  },
  {
    id: "x-3",
    html: `<blockquote class="twitter-tweet" data-theme="light" data-width="100%"><p lang="en" dir="ltr">Most SaaS founders fail quietly — not because of bad ideas,<br>but because they never launch.<br><br>Here's my 21-day playbook to go from idea → live MVP 👇<br><br>1️⃣ Days 1-3: Validate ONE painful problem.<br>2️⃣ Days 4-10: Build the core value only.<br>3️⃣ Days 11-17: Add AI-powered automation to…</p>&mdash; Arka Lal Chakravarty (@arka_codes) <a href="https://twitter.com/arka_codes/status/1983773028132462664?ref_src=twsrc%5Etfw">October 30, 2025</a></blockquote>`,
    link: "https://twitter.com/arka_codes/status/1983773028132462664",
  },
];

const BuildInPublicCarousel = () => {
  const sectionRef = useRef(null);
  const loadXWidgets = (rootEl) => {
    if (typeof window === "undefined") return;
    if (!window?.twttr?.widgets?.load) return;
    window.twttr.widgets.load(rootEl || undefined);
  };

  useEffect(() => {
    const id = window.setTimeout(() => {
      loadXWidgets(sectionRef.current);
    }, 50);

    return () => {
      window.clearTimeout(id);
    };
  }, []);

  // No animation controls for posts - using CSS animations instead

  // No animation controls for Twitter posts - will use CSS animation instead

  return (
    <section
      id="buildinpublic"
      className={styles.buildinPublicSection}
      ref={sectionRef}
    >
      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="afterInteractive"
        charSet="utf-8"
        onLoad={() => loadXWidgets(sectionRef.current)}
      />
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>#buildinpublic</span>
          <h2 className={styles.sectionTitle}>My Journey</h2>
          <p className={styles.sectionDescription}>
            Experience my unwavering dedication to building innovative projects
            and sharing every milestone in real-time on X and LinkedIn.
          </p>
        </div>

        <div className={styles.carouselContainer}>
          <div className={styles.bentoGrid}>
            <div className={styles.bentoColumn}>
              {linkedInPosts.map((post) => (
                <div key={post.id} className={styles.bentoCard}>
                  <a
                    href={post.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.openPost}
                    aria-label="Open LinkedIn post"
                  >
                    <FiExternalLink size={14} />
                    <span>Open</span>
                  </a>
                  <iframe
                    src={post.src}
                    title={`LinkedIn post ${post.id}`}
                    className={styles.linkedinFrame}
                    loading="lazy"
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
              ))}
            </div>

            <div className={styles.bentoColumn}>
              {xPosts.map((post) => (
                <div key={post.id} className={styles.bentoCard}>
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.openPost}
                    aria-label="Open X post"
                  >
                    <FiExternalLink size={14} />
                    <span>Open</span>
                  </a>
                  <div className={styles.tweetEmbed}>
                    <div dangerouslySetInnerHTML={{ __html: post.html }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuildInPublicCarousel;
