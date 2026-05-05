"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ProjectShowcase.module.scss";
import Image from "next/image";
import { FaGithub, FaExternalLinkAlt, FaYoutube, FaPlay } from "react-icons/fa";
import VideoPopup from "./VideoPopup";

gsap.registerPlugin(ScrollTrigger);

let youTubeIframeApiPromise;

const getYouTubeVideoId = (url) => {
  if (!url) return "";
  if (url.includes("youtu.be")) {
    const id = url.split("/").pop();
    return id || "";
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2] && match[2].length === 11 ? match[2] : "";
};

const loadYouTubeIframeApi = () => {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.YT && window.YT.Player) return Promise.resolve(true);

  if (youTubeIframeApiPromise) return youTubeIframeApiPromise;

  youTubeIframeApiPromise = new Promise((resolve) => {
    if (!window.__ytIframeApiReadyCallbacks) {
      window.__ytIframeApiReadyCallbacks = [];
    }

    window.__ytIframeApiReadyCallbacks.push(() => resolve(true));

    const existingScript = document.getElementById("youtube-iframe-api");
    if (!existingScript) {
      const tag = document.createElement("script");
      tag.id = "youtube-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }

    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof previousReady === "function") previousReady();
      const callbacks = window.__ytIframeApiReadyCallbacks || [];
      window.__ytIframeApiReadyCallbacks = [];
      callbacks.forEach((cb) => {
        try {
          cb();
        } catch (e) {
          return;
        }
      });
    };
  });

  return youTubeIframeApiPromise;
};

const YouTubePreview = ({ videoUrl, poster, title, active }) => {
  const videoId = getYouTubeVideoId(videoUrl);
  const playerHostRef = useRef(null);
  const playerRef = useRef(null);
  const [playerReady, setPlayerReady] = useState(false);

  const [mediaRef, mediaInView] = useInView({
    threshold: 0.35,
    triggerOnce: false,
    rootMargin: "200px",
  });

  useEffect(() => {
    if (!videoId) return;
    let isCancelled = false;

    loadYouTubeIframeApi().then((ok) => {
      if (!ok || isCancelled) return;
      if (!playerHostRef.current) return;
      if (playerRef.current) return;

      playerRef.current = new window.YT.Player(playerHostRef.current, {
        host: "https://www.youtube-nocookie.com",
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          loop: 1,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          playlist: videoId,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            if (isCancelled) return;
            setPlayerReady(true);
            try {
              event.target.mute();
              if (active && mediaInView) event.target.playVideo();
            } catch (e) {
              return;
            }
          },
          onStateChange: (event) => {
            if (isCancelled) return;
            if (event.data === window.YT.PlayerState.ENDED) {
              try {
                event.target.seekTo(0);
                event.target.playVideo();
              } catch (e) {
                return;
              }
            }
          },
        },
      });
    });

    return () => {
      isCancelled = true;
      if (
        playerRef.current &&
        typeof playerRef.current.destroy === "function"
      ) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          return;
        }
      }
      playerRef.current = null;
      setPlayerReady(false);
    };
  }, [videoId]);

  useEffect(() => {
    const player = playerRef.current;
    if (!playerReady || !player) return;

    try {
      if (active && mediaInView) {
        player.mute();
        player.playVideo();
        return;
      }

      player.pauseVideo();
      if (!active) {
        player.seekTo(0);
      }
    } catch (e) {
      return;
    }
  }, [active, mediaInView, playerReady]);

  if (!videoId) {
    return (
      <Image
        src={poster}
        alt={title}
        width={600}
        height={340}
        className={styles.projectImage}
      />
    );
  }

  return (
    <div ref={mediaRef} className={styles.projectMediaRoot}>
      <Image
        src={poster}
        alt={title}
        width={600}
        height={340}
        className={styles.projectImage}
      />
      <div
        className={`${styles.youtubePreview} ${
          playerReady && active ? styles.youtubePreviewReady : ""
        }`}
      >
        <div className={styles.youtubePlayer}>
          <div ref={playerHostRef} className={styles.youtubePlayerHost} />
        </div>
      </div>
    </div>
  );
};

const TILT_ANGLE = 4;
const FLOAT_Y = 10;
const FLOAT_OFFSETS = [0, 0.7, 0.3, 0.9, 0.5, 0.2, 0.8];

const ProjectShowcase = () => {
  const [videoPopup, setVideoPopup] = useState({
    isOpen: false,
    videoId: "",
  });

  const sectionRef = useRef(null);
  const galleryRef = useRef(null);
  const cardsAreaRef = useRef(null);
  const stripRef = useRef(null);
  const bgHeadingRef = useRef(null);

  const cardEls = useRef([]);
  const ctxRef = useRef(null);

  const openVideoPopup = (videoId) => {
    setVideoPopup({ isOpen: true, videoId });
  };

  const closeVideoPopup = () => {
    setVideoPopup({ isOpen: false, videoId: "" });
  };

  const allProjects = [
    {
      id: 1,
      name: "Disco",
      description:
        "Full-scale influencer marketing platform with in-depth creator discovery, filtering, and profile enrichment.",
      image: "/images/projects/selfWork/disco-image.png",
      technologies: ["Next.js 16", "Node.js", "MongoDB"],
      liveLink: null,
      githubLink: null,
      featured: true,
      demoVideo: "https://youtu.be/9Dhl5c9lDN8",
      previewVideo: "https://youtu.be/GLAM1qw2ZHA",
    },
    {
      id: 8,
      name: "AtomX Website",
      description:
        "Redesigned and built the entire atomX website with proper SEO and modern UI aligned with the brand. Crafted attractive GSAP and Framer Motion animations to deliver a best-in-class user experience.",
      image: "/images/projects/clientWork/atomX-preview.png",
      technologies: ["Next.js", "GSAP", "Framer Motion", "SCSS", "SEO"],
      liveLink: null,
      githubLink: null,
      featured: true,
      demoVideo: "https://youtu.be/EBH4IC-zW2Y",
      previewVideo: "https://youtu.be/EBH4IC-zW2Y",
    },
    {
      id: 2,
      name: "NixBuilder — AI App Builder",
      description:
        "AI-powered platform that enables users to build full SaaS MVP applications end-to-end using natural language prompts, without writing code.",
      image: "/images/projects/selfWork/nixbuilder-image.png",
      technologies: [
        "Next.js 16",
        "Node.js",
        "Supabase",
        "OpenRouter LLM APIs",
        "Vercel AI SDK",
      ],
      liveLink: null,
      githubLink: null,
      featured: true,
      demoVideo: "https://youtu.be/BYfE1g8MC0g",
      previewVideo: "https://youtu.be/zcdSslIl5pw",
    },
    {
      id: 3,
      name: "AI RAG Copilot",
      description:
        "Advanced AI Integrated RAG system chatbot agent, where you can chat with your created knowledge base data and allow LLM Models to take actions on your behalf.",
      image: "/images/projects/clientWork/copilot-app.png",
      technologies: [
        "NextJS",
        "LangChain",
        "OpenRouter",
        "OpenAI",
        "NodeJS",
        "RAG",
        "Vector DB",
        "Prisma",
      ],
      liveLink: null,
      githubLink: null,
      featured: true,
      demoVideo: "https://youtu.be/UaMSO7ypGEs",
      previewVideo: "https://youtu.be/Y1sDX0leo5o",
    },
    {
      id: 4,
      name: "BrowzPot",
      description:
        "AI powered chrome extension Software that helps in your day to day productivity automation from writing emails to getting summaries from web pages to taking notes instantly on your browser and many more ! (Under Development)",
      image: "/images/projects/selfWork/browzpot-app.png",
      technologies: ["NextJS", "NextAuthJS", "MongoDB", "NodeJS", "OpenAI"],
      liveLink: "https://browzpot.com",
      githubLink: "https://github.com/arkalal/BrowzPot",
      featured: true,
      demoVideo: "https://youtu.be/GwutUEqp2gc",
      previewVideo: "https://youtu.be/PSeyteGONXg",
    },
  ];

  // --- GSAP horizontal scroll ---
  useEffect(() => {
    const ctxCleanups = [];
    // Wait for images and cards to render before measuring
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        const strip = stripRef.current;
        const gallery = galleryRef.current;
        const cardsArea = cardsAreaRef.current;
        const cards = cardEls.current.filter(Boolean);

        if (!strip || !gallery || !cardsArea || !cards.length) return;

        let stripWidth;
        let startX;
        let endX;
        // Visual distance the strip translates (off-right → off-left).
        let sweepDistance;
        // Actual scroll distance the user travels through the pin.
        // Decoupled from sweepDistance so the cards can complete a full
        // visual sweep without forcing a 2.4× longer pin — that long pin
        // was what made Contact's pin engage feel like a hard snap under
        // Lenis smooth scroll.
        let scrollDistance;
        // Precomputed at refresh time so the scroll onUpdate handler
        // does ZERO DOM reads — that was the source of the stutter at
        // the Projects → GitHub pin-release boundary (forced layouts
        // every frame from getBoundingClientRect).
        //
        // We use offsetLeft / offsetWidth (pure layout values) here
        // instead of getBoundingClientRect — bbox is affected by any
        // transforms that happen to be on the strip or cards at the
        // moment refresh fires (e.g. on a post-image-load refresh
        // after the user has already scrolled), and that error was
        // freezing every card at the same tilt instead of letting the
        // tilt swing left/right as cards passed the area's center.
        let cardOffsets = [];
        let areaCenter = 0;
        let halfAreaWidth = 0;

        function refresh() {
          stripWidth = strip.scrollWidth;
          // Cards sweep fully — start off the right edge of cardsArea,
          // end past the left edge so every card visually exits to the
          // left.
          startX = cardsArea.offsetWidth;
          endX = -stripWidth;
          sweepDistance = startX - endX;
          // Lengthen the pin so the horizontal sweep feels slower per
          // scroll-pixel — even on a hard wheel flick the user has time
          // to register each card. Stays under the prior breaking-point
          // (≈ stripWidth + cardsArea.offsetWidth ≈ 1.42×) that made
          // Contact's pin engage feel like a snap under Lenis.
          scrollDistance = stripWidth * 1.3;

          // Each card's center expressed in the strip's untranslated
          // local x-axis (offsetLeft already accounts for strip's
          // padding, since strip is the offsetParent).
          cardOffsets = cards.map(
            (card) => card.offsetLeft + card.offsetWidth / 2
          );
          // The cardsArea is the strip's offsetParent. Strip's
          // offsetLeft within it is 0 horizontally (cardsArea has
          // no horizontal padding), so the cardsArea center expressed
          // in the strip's local x-axis is just half its width.
          areaCenter = cardsArea.offsetWidth / 2;
          halfAreaWidth = areaCenter || 1;
        }

        refresh();

        // Park the strip off the right edge before the pin engages —
        // prevents a single frame of cards-at-default-position before the
        // scrollTrigger applies the fromTo "from" value.
        gsap.set(strip, { x: startX, force3D: true });

        const floatTweens = cards.map((card, i) =>
          gsap.to(card, {
            y: FLOAT_Y,
            duration: 2.2 + i * 0.3,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: (FLOAT_OFFSETS[i % FLOAT_OFFSETS.length] || 0) * 2,
            force3D: true,
            paused: true,
          })
        );

        // Only run the infinite float tweens while the gallery is in
        // view. Letting them run continuously caused the cards to
        // repaint forever, fighting the strip's transform during the
        // pin-release into GitHub.
        ScrollTrigger.create({
          trigger: gallery,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            if (self.isActive) floatTweens.forEach((t) => t.play());
            else floatTweens.forEach((t) => t.pause());
          },
        });

        gsap.set(cards, { opacity: 0, y: 50, force3D: true });

        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gallery,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        });

        // Pre-compile a quickTo for each card's rotation. This avoids
        // creating a fresh tween on every scroll frame (the previous
        // gsap.to-in-onUpdate pattern produced hundreds of tweens/sec
        // and caused stutter at the pin boundary into the next section).
        const rotateTo = cards.map((card) =>
          gsap.quickTo(card, "rotation", {
            duration: 0.4,
            ease: "power2.out",
          })
        );

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: gallery,
            start: "top top",
            end: () => `+=${scrollDistance}`,
            pin: gallery,
            scrub: true,
            invalidateOnRefresh: true,
            pinSpacing: true,
            anticipatePin: 1,
            // Lenis uses native window scroll, so pinType: "fixed" is
            // the right choice — "transform" is for custom (non-window)
            // scrollers and is known to introduce sub-pixel vibration
            // under native-scroll smooth scrollers like Lenis.
            pinType: "fixed",
            fastScrollEnd: true,
            onUpdate: (self) => {
              // No DOM reads during scroll — derive each card's center
              // from the precomputed offsets and the timeline progress.
              // This keeps the pin-release transition into GitHub
              // smooth, since the scroll handler no longer triggers
              // forced layouts every frame.
              const stripX = startX - self.progress * sweepDistance;
              for (let i = 0; i < cards.length; i++) {
                const cardCenter = cardOffsets[i] + stripX;
                const offset = (cardCenter - areaCenter) / halfAreaWidth;
                const clamped = offset < -1 ? -1 : offset > 1 ? 1 : offset;
                rotateTo[i](clamped * -TILT_ANGLE);
              }
            },
          },
        });

        tl.fromTo(
          strip,
          { x: () => startX },
          {
            x: () => endX,
            ease: "none",
            force3D: true,
          },
          0
        );

        // Fade the background "Recent Work" heading from prominent to
        // soft as the user scrolls horizontally, so it reads boldly when
        // the area is empty and recedes as cards slide over it.
        if (bgHeadingRef.current) {
          tl.fromTo(
            bgHeadingRef.current,
            { opacity: 0.9 },
            { opacity: 0.08, ease: "none" },
            0
          );
        }

        ScrollTrigger.addEventListener("refreshInit", refresh);
        // Make the listener removable on unmount so HMR / route changes
        // don't accumulate stale refresh callbacks.
        ctxCleanups.push(() =>
          ScrollTrigger.removeEventListener("refreshInit", refresh)
        );

        // Refresh after images load — but defer to an idle moment so
        // the refresh never fires while the user is actively scrolling
        // through the section. A mid-scroll ScrollTrigger.refresh()
        // briefly reverts the pin to take measurements and that revert
        // is exactly the visible "stuck frame" people sometimes saw at
        // the Projects → GitHub boundary. (Card layout is fixed-width
        // with a fixed image aspect-ratio so the refresh isn't even
        // needed for correctness — only as a safety net.)
        const safeRefresh = () => {
          const ric = window.requestIdleCallback;
          if (typeof ric === "function") {
            ric(() => ScrollTrigger.refresh(), { timeout: 1500 });
          } else {
            setTimeout(() => ScrollTrigger.refresh(), 200);
          }
        };
        const imgs = strip.querySelectorAll("img");
        let loaded = 0;
        const onLoad = () => {
          loaded++;
          if (loaded >= imgs.length) {
            safeRefresh();
          }
        };
        imgs.forEach((img) => {
          if (img.complete) {
            loaded++;
          } else {
            img.addEventListener("load", onLoad);
          }
        });
        if (loaded >= imgs.length) {
          safeRefresh();
        }
      }, sectionRef);

      ctxRef.current = ctx;
    }, 100);

    return () => {
      clearTimeout(timer);
      ctxCleanups.forEach((fn) => fn());
      if (ctxRef.current) ctxRef.current.revert();
    };
  }, []);

  return (
    <section id="projects" className={styles.projectsSection} ref={sectionRef}>
      {/* Horizontal scroll gallery — header inside so it stays visible when pinned */}
      <div className={styles.gallery} ref={galleryRef}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Projects</span>
          <p className={styles.subheading}>
            A selection of my recent projects and applications built with modern
            technologies.
          </p>
        </div>

        <div className={styles.cardsArea} ref={cardsAreaRef}>
          {/* Background heading sits behind the strip; cards slide over it */}
          <div
            className={styles.bgHeading}
            ref={bgHeadingRef}
            aria-hidden="true"
          >
            Recent Work
          </div>

          {/* Fade edges */}
          <div className={styles.fadeLeft} />
          <div className={styles.fadeRight} />

          <div className={styles.strip} ref={stripRef}>
          {allProjects.map((project, i) => (
            <div
              key={project.id}
              ref={(el) => (cardEls.current[i] = el)}
              className={styles.projectCard}
            >
              <ProjectCard
                project={project}
                openVideoPopup={openVideoPopup}
              />
            </div>
          ))}
          </div>
        </div>
      </div>

      <VideoPopup
        isOpen={videoPopup.isOpen}
        onClose={closeVideoPopup}
        videoId={videoPopup.videoId}
      />
    </section>
  );
};

// Project Card Component — keeps same styling/functionality
const ProjectCard = ({ project, openVideoPopup }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) setIsHovering(false);
  }, [isMobile]);

  useEffect(() => {
    if (!isHovering && !isMobile) setIsPreviewPlaying(false);
  }, [isHovering, isMobile]);

  const handlePlayClick = (e) => {
    e.stopPropagation();
    const videoUrl = project.previewVideo || project.demoVideo;
    if (videoUrl) openVideoPopup(videoUrl);
  };

  return (
    <>
      <div
        className={styles.projectImageWrapper}
        onMouseEnter={() => {
          if (!isMobile) setIsHovering(true);
        }}
        onMouseLeave={() => {
          if (!isMobile) setIsHovering(false);
        }}
      >
        {project.previewVideo && isPreviewPlaying ? (
          <YouTubePreview
            videoUrl={project.previewVideo}
            poster={project.image}
            title={project.name}
            active={
              isMobile ? isPreviewPlaying : isHovering && isPreviewPlaying
            }
          />
        ) : (
          <>
            <Image
              src={project.image}
              alt={project.name}
              width={600}
              height={340}
              className={styles.projectImage}
            />
            {project.previewVideo && (isMobile || isHovering) && (
              <motion.button
                className={styles.playButton}
                onClick={handlePlayClick}
                initial={
                  isMobile
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.8 }
                }
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={isMobile ? {} : { scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={styles.playButtonInner}>
                  <FaPlay className={styles.playIcon} />
                </div>
                <div className={styles.playButtonRing} />
              </motion.button>
            )}
          </>
        )}
      </div>

      <div className={styles.projectContent}>
        <h3 className={styles.projectName}>{project.name}</h3>
        <p className={styles.projectDescription}>{project.description}</p>

        <div className={styles.techStack}>
          {project.technologies.map((tech, index) => (
            <span key={index} className={styles.techBadge}>
              {tech}
            </span>
          ))}
        </div>

        <div className={styles.projectLinks}>
          {project.githubLink && (
            <a
              href={project.githubLink}
              className={styles.projectLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub /> Code
            </a>
          )}

          {project.demoVideo && (
            <button
              className={`${styles.projectLink} ${styles.liveLink}`}
              onClick={(e) => {
                e.preventDefault();
                openVideoPopup(project.previewVideo || project.demoVideo);
              }}
            >
              <FaYoutube /> Live Demo
            </button>
          )}

          {project.liveLink && !project.demoVideo && (
            <a
              href={project.liveLink}
              className={`${styles.projectLink} ${styles.liveLink}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaExternalLinkAlt /> Live Demo
            </a>
          )}
        </div>
      </div>
    </>
  );
};

export default ProjectShowcase;
