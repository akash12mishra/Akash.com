"use client";

import { useRef, useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Global ref so other components can stop/start Lenis
if (typeof window !== "undefined") {
  window.__lenis = null;
}

const SmoothScroll = ({ children }) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      // duration + easing produces a soft, decelerating glide into
      // every pin (Contact, etc.) which is the feel the rest of the
      // site is tuned for. The Projects → GitHub stutter was *not*
      // caused by these settings — it was caused by per-frame layout
      // reads, a competing translateY entry on the next section, and
      // ungated infinite tweens, all fixed elsewhere — so we keep the
      // original smooth-glide tuning here.
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 2,
      // We drive Lenis from GSAP's ticker (below). Disable Lenis's own
      // rAF so they don't fight for frame ownership.
      autoRaf: false,
    });
    lenisRef.current = lenis;
    window.__lenis = lenis;

    // Official Lenis ↔ ScrollTrigger integration. Without this,
    // ScrollTrigger reads native scroll events at a different cadence
    // than Lenis is interpolating, so pinned scrub timelines drift —
    // visible as a "stuck" beat at pin-release boundaries (e.g.
    // Projects → GitHub).
    const onLenisScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onLenisScroll);

    const tickerFn = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    // Refresh once after Lenis has wired itself up so any triggers
    // already registered by descendant components recompute their
    // start/end against the post-Lenis scroll model.
    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refreshId);
      gsap.ticker.remove(tickerFn);
      lenis.off("scroll", onLenisScroll);
      lenis.destroy();
      lenisRef.current = null;
      window.__lenis = null;
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;
