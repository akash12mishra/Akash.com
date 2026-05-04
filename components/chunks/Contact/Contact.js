"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FaEnvelope,
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaCalendarAlt,
} from "react-icons/fa";
import { HiOutlineGlobeAlt } from "react-icons/hi";
import styles from "./Contact.module.scss";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const Contact = () => {
  const containerRef = useRef(null);
  const mainCardRef = useRef(null);
  const mockupRef = useRef(null);
  const requestRef = useRef(0);

  // Subtle mouse parallax on the iPhone mockup + card sheen position.
  // Only active while the section is roughly in view to avoid wasted RAF.
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!mainCardRef.current || !mockupRef.current) return;
      const rect = mainCardRef.current.getBoundingClientRect();
      // Skip work when card isn't on screen.
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      cancelAnimationFrame(requestRef.current);
      requestRef.current = requestAnimationFrame(() => {
        if (!mainCardRef.current || !mockupRef.current) return;
        const r = mainCardRef.current.getBoundingClientRect();
        const mouseX = e.clientX - r.left;
        const mouseY = e.clientY - r.top;
        mainCardRef.current.style.setProperty("--mouse-x", `${mouseX}px`);
        mainCardRef.current.style.setProperty("--mouse-y", `${mouseY}px`);

        const xVal = (e.clientX / window.innerWidth - 0.5) * 2;
        const yVal = (e.clientY / window.innerHeight - 0.5) * 2;
        gsap.to(mockupRef.current, {
          rotationY: xVal * 10,
          rotationX: -yVal * 10,
          ease: "power3.out",
          duration: 1.2,
        });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Cinematic scroll timeline: hero text → card rises & fills → phone + side
  // text + floating badges → 3 phone tabs cycle on scroll → card pulls back
  // → card exits up. After unpin, HireEngineer (next section) follows.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let ctx;
    const t = setTimeout(() => {
      ctx = gsap.context(() => {
        const isMobile = window.innerWidth < 768;

        // Initial states
        gsap.set(`.${styles.heroLine1}`, {
          autoAlpha: 0,
          y: 60,
          scale: 0.85,
          filter: "blur(20px)",
          rotationX: -20,
        });
        gsap.set(`.${styles.heroLine2}`, {
          autoAlpha: 1,
          clipPath: "inset(0 100% 0 0)",
        });
        gsap.set(`.${styles.mainCard}`, {
          y: window.innerHeight + 200,
          autoAlpha: 1,
        });
        gsap.set(
          [
            `.${styles.cardLeftText}`,
            `.${styles.cardRightText}`,
            `.${styles.mockupWrapper}`,
            `.${styles.floatingBadge}`,
            `.${styles.phoneWidget}`,
          ],
          { autoAlpha: 0 },
        );

        // Phone slides — first visible, others below
        const slides = gsap.utils.toArray(`.${styles.phoneSlide}`);
        const progressFills = gsap.utils.toArray(`.${styles.progressFill}`);
        if (slides.length) {
          gsap.set(slides[0], { autoAlpha: 1, y: "0%" });
          for (let i = 1; i < slides.length; i++) {
            gsap.set(slides[i], { autoAlpha: 0, y: "100%" });
          }
        }
        if (progressFills.length) {
          gsap.set(progressFills[0], { width: "100%" });
          for (let i = 1; i < progressFills.length; i++) {
            gsap.set(progressFills[i], { width: "0%" });
          }
        }

        // Intro reveal of the hero lines (fires once when entering)
        const introTl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top 70%",
            once: true,
          },
        });
        introTl
          .to(`.${styles.heroLine1}`, {
            duration: 1.4,
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            rotationX: 0,
            ease: "expo.out",
          })
          .to(
            `.${styles.heroLine2}`,
            {
              duration: 1.2,
              clipPath: "inset(0 0% 0 0)",
              ease: "power4.inOut",
            },
            "-=0.9",
          );

        // Main pinned cinematic timeline.
        // `tl` is referenced inside the snap callback below — that's safe
        // because the callback only runs when the user scrolls, by which
        // time `tl` is fully constructed (closure captures the reference).
        let tl;
        // Tracks the last tab index the snap landed on. Clamping the next
        // snap to lastIdx ± 1 means a single hard scroll can never skip a
        // tab — even if scrub-based timeline progress flew past two tabs
        // before the user's scroll gesture settled.
        let lastTabIdx = 0;
        tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "+=6500",
            pin: true,
            scrub: 0.6,
            // Match the pin configuration the rest of the site uses under
            // Lenis (see ProjectShowcase). Without pinType: "fixed" +
            // fastScrollEnd, the hand-off from BuildInPublic into the
            // Contact pin can feel like the section snaps into place
            // instead of gliding in with Lenis's deceleration.
            pinType: "fixed",
            invalidateOnRefresh: true,
            fastScrollEnd: true,
            anticipatePin: 1,
            // Snap to discrete tab states ONLY while inside the tab phase
            // of the timeline. Outside that range (intro / exit) we return
            // the unchanged progress so scrolling stays free and cinematic.
            // Inside the range, the snap is clamped to ±1 step from the
            // last landed tab — guaranteeing one-tab-per-gesture.
            snap: {
              snapTo: (progress) => {
                if (!tl || !tl.labels) return progress;
                const dur = tl.duration();
                const tabsStart = tl.labels.tabs;
                const exitStart = tl.labels.exit;
                if (!dur || tabsStart == null || exitStart == null)
                  return progress;
                const startP = tabsStart / dur;
                const endP = exitStart / dur;
                // Outside tab phase → reset tracker to the appropriate
                // boundary so re-entry starts from a sensible index.
                if (progress < startP - 0.015) {
                  lastTabIdx = 0;
                  return progress;
                }
                if (progress > endP + 0.015) {
                  lastTabIdx = 2;
                  return progress;
                }
                // Snap targets: tab 0, tab 1, tab 2.
                const points = [
                  startP,
                  (tabsStart + 1.0) / dur,
                  (tabsStart + 2.0) / dur,
                ];
                // Direction of movement relative to the last snap index.
                const lastP = points[lastTabIdx];
                let nextIdx = lastTabIdx;
                if (progress > lastP) nextIdx = Math.min(2, lastTabIdx + 1);
                else if (progress < lastP)
                  nextIdx = Math.max(0, lastTabIdx - 1);
                lastTabIdx = nextIdx;
                return points[nextIdx];
              },
              duration: { min: 0.3, max: 0.6 },
              delay: 0.08,
              ease: "power2.inOut",
              directional: true,
            },
          },
        });

        // Lead settle: pin engages but the cinematic holds for a beat
        // before anything starts moving — so the transition from natural
        // page scroll into the pinned timeline feels seamless.
        const LEAD = 0.8;

        tl
          // Hero text + bg fully fade as card takes over.
          .to(
            [`.${styles.heroTextWrapper}`, `.${styles.bgGrid}`],
            {
              scale: 1.15,
              filter: "blur(20px)",
              autoAlpha: 0,
              ease: "power2.inOut",
              duration: 2,
            },
            LEAD,
          )
          // Card rises into view
          .to(
            `.${styles.mainCard}`,
            { y: 0, ease: "power3.inOut", duration: 2 },
            LEAD,
          )
          // Card expands to fullscreen
          .to(`.${styles.mainCard}`, {
            width: "100%",
            height: "100%",
            borderRadius: "0px",
            ease: "power3.inOut",
            duration: 1.5,
          })
          // Phone mockup enters with 3D pop
          .fromTo(
            `.${styles.mockupWrapper}`,
            {
              y: 300,
              z: -500,
              rotationX: 50,
              rotationY: -30,
              autoAlpha: 0,
              scale: 0.6,
            },
            {
              y: 0,
              z: 0,
              rotationX: 0,
              rotationY: 0,
              autoAlpha: 1,
              scale: 1,
              ease: "expo.out",
              duration: 2.5,
            },
            "-=0.8",
          )
          // Phone widgets stagger in
          .fromTo(
            `.${styles.phoneWidget}`,
            { y: 40, autoAlpha: 0, scale: 0.95 },
            {
              y: 0,
              autoAlpha: 1,
              scale: 1,
              stagger: 0.12,
              ease: "back.out(1.2)",
              duration: 1.2,
            },
            "-=1.6",
          )
          // Floating badges
          .fromTo(
            `.${styles.floatingBadge}`,
            { y: 100, autoAlpha: 0, scale: 0.7, rotationZ: -10 },
            {
              y: 0,
              autoAlpha: 1,
              scale: 1,
              rotationZ: 0,
              ease: "back.out(1.5)",
              duration: 1.4,
              stagger: 0.18,
            },
            "-=2.0",
          )
          // Side text panels
          .fromTo(
            `.${styles.cardLeftText}`,
            { x: -50, autoAlpha: 0 },
            { x: 0, autoAlpha: 1, ease: "power4.out", duration: 1.4 },
            "-=1.4",
          )
          .fromTo(
            `.${styles.cardRightText}`,
            { x: 50, autoAlpha: 0, scale: 0.85 },
            { x: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 1.4 },
            "<",
          )
          // Cycle phone tabs (slide 0 → 1 → 2) — original snappy pacing
          .addLabel("tabs", "+=0.3");

        for (let i = 0; i < slides.length - 1; i++) {
          const next = i + 1;
          tl.to(
            slides[i],
            { y: "-100%", autoAlpha: 0, duration: 0.6, ease: "power2.inOut" },
            `tabs+=${i + 0.05}`,
          );
          tl.fromTo(
            slides[next],
            { y: "100%", autoAlpha: 0 },
            { y: "0%", autoAlpha: 1, duration: 0.6, ease: "power2.inOut" },
            `tabs+=${i + 0.15}`,
          );
          if (progressFills[next]) {
            tl.fromTo(
              progressFills[next],
              { width: "0%" },
              { width: "100%", duration: 0.5, ease: "none" },
              `tabs+=${i + 0.15}`,
            );
          }
        }

        // Card pulls back & exits up — letting the next section (HireEngineer) take over
        tl.addLabel("exit", `+=0.4`)
          .to(
            [
              `.${styles.mockupWrapper}`,
              `.${styles.floatingBadge}`,
              `.${styles.cardLeftText}`,
              `.${styles.cardRightText}`,
            ],
            {
              scale: 0.9,
              y: -40,
              z: -200,
              autoAlpha: 0,
              ease: "power3.in",
              duration: 1.0,
              stagger: 0.05,
            },
            "exit",
          )
          .to(
            `.${styles.mainCard}`,
            {
              width: isMobile ? "92vw" : "85vw",
              height: isMobile ? "92vh" : "85vh",
              borderRadius: isMobile ? "32px" : "40px",
              ease: "expo.inOut",
              duration: 1.2,
            },
            "exit+=0.4",
          )
          // Card flies off the top to hand over to HireEngineer. power1.out
          // front-loads the motion so the card clears the viewport in the
          // first ~30% of the tween — meaning even with scrub: 0.6 lag,
          // the visible exit is already complete by the time the pin
          // releases.
          .to(`.${styles.mainCard}`, {
            y: -window.innerHeight - 300,
            ease: "power1.out",
            duration: 0.7,
          })
          // Empty tail buffer past the fly-up: holds the pin a little longer
          // after the card has flown off-screen. With scrub: 0.6, the
          // timeline can lag ~4% behind scroll position; without this tail
          // the pin can release while the fly-up is still ~80% complete,
          // leaving the card's bottom edge mid-viewport (the "line"). The
          // tail is invisible — the card is already fully above the
          // section's clip — so it just adds a small post-exit pinned scroll
          // before HireEngineer takes over.
          .to({}, { duration: 0.5 });
      }, container);

      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 300);
    }, 100);

    return () => {
      clearTimeout(t);
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section
      id="contact"
      ref={containerRef}
      className={styles.contactSection}
      style={{ perspective: "1500px" }}
    >
      <div className={styles.filmGrain} aria-hidden="true" />
      <div className={styles.bgGrid} aria-hidden="true" />

      {/* HERO TEXTS — visible before scroll, fade as card rises */}
      <div className={styles.heroTextWrapper}>
        <span className={styles.sectionTag}>Contact</span>
        <h2 className={`${styles.heroLine1} ${styles.heroLine}`}>
          Let's start a
        </h2>
        <h2
          className={`${styles.heroLine2} ${styles.heroLine} ${styles.heroLineAccent}`}
        >
          conversation.
        </h2>
      </div>

      {/* THE PHYSICAL CARD — rises and fills the viewport */}
      <div className={styles.cardLayer} style={{ perspective: "1500px" }}>
        <div
          ref={mainCardRef}
          className={`${styles.mainCard} ${styles.depthCard}`}
        >
          <div className={styles.cardSheen} aria-hidden="true" />

          <div className={styles.cardGrid}>
            {/* RIGHT (desktop) / TOP (mobile): Brand wordmark */}
            <div className={`${styles.cardRightText} ${styles.brandCol}`}>
              <h3 className={styles.brandWordmark}>
                Arka Lal
                <br />
                Chakravarty
              </h3>
            </div>

            {/* CENTER: iPhone mockup */}
            <div
              className={`${styles.mockupWrapper}`}
              style={{ perspective: "1000px" }}
            >
              <div className={styles.mockupScale}>
                <div ref={mockupRef} className={styles.iphoneBezel}>
                  {/* Hardware buttons */}
                  <span
                    className={`${styles.hwBtn} ${styles.hwBtnSilencer}`}
                    aria-hidden="true"
                  />
                  <span
                    className={`${styles.hwBtn} ${styles.hwBtnVolUp}`}
                    aria-hidden="true"
                  />
                  <span
                    className={`${styles.hwBtn} ${styles.hwBtnVolDown}`}
                    aria-hidden="true"
                  />
                  <span
                    className={`${styles.hwBtn} ${styles.hwBtnPower}`}
                    aria-hidden="true"
                  />

                  <div className={styles.iphoneScreen}>
                    <div className={styles.screenGlare} aria-hidden="true" />

                    {/* Dynamic Island */}
                    <div className={styles.dynamicIsland}>
                      <span className={styles.islandDot} aria-hidden="true" />
                    </div>

                    <div className={styles.appShell}>
                      <div
                        className={`${styles.phoneWidget} ${styles.appHeader}`}
                      >
                        <div>
                          <span className={styles.appHeaderEyebrow}>Today</span>
                          <span className={styles.appHeaderTitle}>
                            Reach Out
                          </span>
                        </div>
                        <div className={styles.avatar}>AC</div>
                      </div>

                      {/* Tab progress bars (Dynamic-Island style segmented indicator) */}
                      <div
                        className={`${styles.phoneWidget} ${styles.tabProgress}`}
                      >
                        <div className={styles.progressBar}>
                          <div className={styles.progressFill} />
                        </div>
                        <div className={styles.progressBar}>
                          <div className={styles.progressFill} />
                        </div>
                        <div className={styles.progressBar}>
                          <div className={styles.progressFill} />
                        </div>
                      </div>

                      {/* The 3 cycling tabs */}
                      <div className={styles.phoneSlides}>
                        {/* Tab 1 — Email */}
                        <div className={styles.phoneSlide}>
                          <div
                            className={`${styles.slideIcon} ${styles.slideIconOrange}`}
                          >
                            <FaEnvelope />
                          </div>
                          <h4 className={styles.slideTitle}>Send Email</h4>
                          <p className={styles.slideText}>
                            I reply to every message within 24 hours.
                          </p>
                          <div className={styles.emailPill}>
                            admin@arkalalchakravarty.com
                          </div>
                          <a
                            href="mailto:admin@arkalalchakravarty.com"
                            className={styles.slideCta}
                          >
                            Send Email
                          </a>
                        </div>

                        {/* Tab 2 — Calendar */}
                        <div className={styles.phoneSlide}>
                          <div
                            className={`${styles.slideIcon} ${styles.slideIconAmber}`}
                          >
                            <FaCalendarAlt />
                          </div>
                          <h4 className={styles.slideTitle}>Book a Call</h4>
                          <p className={styles.slideText}>
                            A focused 30-minute conversation.
                          </p>
                          <a
                            href="https://calendly.com/arkalal-chakravarty/30min"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.slideCta}
                          >
                            Book a Call
                          </a>
                        </div>

                        {/* Tab 3 — Social */}
                        <div className={styles.phoneSlide}>
                          <div
                            className={`${styles.slideIcon} ${styles.slideIconViolet}`}
                          >
                            <HiOutlineGlobeAlt />
                          </div>
                          <h4 className={styles.slideTitle}>Stay connected</h4>
                          <p className={styles.slideText}>
                            Follow along and let's grow our network.
                          </p>
                          <div className={styles.socialRow}>
                            <a
                              href="https://www.linkedin.com/in/arkalal/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.socialLink}
                              aria-label="LinkedIn"
                            >
                              <FaLinkedin />
                            </a>
                            <a
                              href="https://x.com/arka_codes"
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.socialLink}
                              aria-label="X (Twitter)"
                            >
                              <FaTwitter />
                            </a>
                            <a
                              href="https://github.com/arkalal"
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.socialLink}
                              aria-label="GitHub"
                            >
                              <FaGithub />
                            </a>
                          </div>
                        </div>
                      </div>

                      <div
                        className={styles.homeIndicator}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>

                {/* Floating glass badges */}
                <div
                  className={`${styles.floatingBadge} ${styles.badgeTopLeft}`}
                >
                  <div
                    className={`${styles.badgeIcon} ${styles.badgeIconOrange}`}
                  >
                    <span aria-hidden="true">✦</span>
                  </div>
                  <div>
                    <p className={styles.badgeTitle}>24h Response</p>
                    <p className={styles.badgeSub}>Always on time</p>
                  </div>
                </div>

                <div
                  className={`${styles.floatingBadge} ${styles.badgeBottomRight}`}
                >
                  <div
                    className={`${styles.badgeIcon} ${styles.badgeIconAmber}`}
                  >
                    <span aria-hidden="true">⚡</span>
                  </div>
                  <div>
                    <p className={styles.badgeTitle}>Open to work</p>
                    <p className={styles.badgeSub}>Worldwide</p>
                  </div>
                </div>
              </div>
            </div>

            {/* LEFT (desktop) / BOTTOM (mobile): Tagline */}
            <div className={`${styles.cardLeftText}`}>
              <h3 className={styles.taglineHeading}>
                Three ways to reach out.
              </h3>
              <p className={styles.taglineBody}>
                Whether it's a quick email, a 30-minute call, or a hello on
                social — pick what works for you and let's build something
                exceptional together.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
