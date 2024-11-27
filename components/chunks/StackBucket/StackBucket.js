"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./StackBucket.module.scss";
import {
  Engine,
  Render,
  Runner,
  Bodies,
  World,
  Mouse,
  MouseConstraint,
  Body,
} from "matter-js";
import Image from "next/image";

const StackBucket = () => {
  const sceneRef = useRef(null);
  const wrapperRef = useRef(null);
  const [activeSection, setActiveSection] = useState("stackImages"); // "stackImages" or "stackBucket"
  const [lockScroll, setLockScroll] = useState(false); // Lock scrolling during transitions

  // Handle scroll and manage transitions dynamically
  useEffect(() => {
    const handleScroll = (e) => {
      if (lockScroll) {
        e.preventDefault();
        return;
      }

      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const scrollPosition = wrapper.scrollTop;
      const scrollHeight = wrapper.scrollHeight;
      const wrapperHeight = wrapper.offsetHeight;

      // When scrolling reaches the end of the section
      if (
        activeSection === "stackImages" &&
        scrollPosition + wrapperHeight >= scrollHeight &&
        e.deltaY > 0 // Scroll down
      ) {
        setLockScroll(true);
        setActiveSection("stackBucket");
        setTimeout(() => setLockScroll(false), 1000); // Unlock after transition
      } else if (
        activeSection === "stackBucket" &&
        scrollPosition <= 0 &&
        e.deltaY < 0 // Scroll up
      ) {
        setLockScroll(true);
        setActiveSection("stackImages");
        setTimeout(() => setLockScroll(false), 1000); // Unlock after transition
      }
    };

    const wrapper = wrapperRef.current;
    wrapper.addEventListener("wheel", handleScroll, { passive: false });

    return () => {
      wrapper.removeEventListener("wheel", handleScroll);
    };
  }, [activeSection, lockScroll]);

  // Matter.js setup for the bucket section
  useEffect(() => {
    if (activeSection !== "stackBucket") return;

    const images = [
      "/images/nextJS.png",
      "/images/mongoDB.png",
      "/images/openai.png",
      "/images/react.png",
      "/images/vercel.png",
    ];

    const engine = Engine.create();
    const world = engine.world;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: 400,
        height: 400,
        wireframes: false,
        background: "#fff",
      },
    });

    const bucketWalls = [
      Bodies.rectangle(200, 395, 400, 10, {
        isStatic: true,
        render: { fillStyle: "white" }, // Bottom wall as light gray border
      }),
      Bodies.rectangle(20, 200, 10, 400, {
        isStatic: true,
        render: { fillStyle: "white" }, // Left wall as light gray border
      }),
      Bodies.rectangle(380, 200, 10, 400, {
        isStatic: true,
        render: { fillStyle: "white" }, // Right wall as light gray border
      }),
    ];

    World.add(world, bucketWalls);

    const dropBodiesSequentially = () => {
      const startX = 200;
      const initialY = 50;

      images.forEach((src, index) => {
        setTimeout(() => {
          const body = Bodies.rectangle(startX, initialY, 50, 50, {
            restitution: 0.7,
            friction: 0.1,
            render: {
              sprite: {
                texture: src,
                xScale: 0.2,
                yScale: 0.2,
              },
            },
          });

          World.add(world, body);

          if (index === 2) {
            Body.applyForce(
              body,
              { x: startX, y: initialY },
              { x: -0.05, y: 0 }
            );
          } else if (index === 3) {
            Body.applyForce(
              body,
              { x: startX, y: initialY },
              { x: 0.05, y: 0 }
            );
          }
        }, index * 500);
      });
    };

    dropBodiesSequentially();

    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      World.clear(world);
      Engine.clear(engine);
      render.canvas.remove();
    };
  }, [activeSection]);

  const sentence = (
    <>
      <span className={`${styles.word} ${styles.filled}`}>Tech</span>
      <span className={`${styles.word} ${styles.bordered}`}>Stack</span>
    </>
  );

  return (
    <div ref={wrapperRef} className={styles.StackBucketWrap}>
      <div className={styles.stackHead}>{sentence}</div>

      {/* stackImages */}
      <div
        className={`${styles.stackImages} ${
          activeSection === "stackImages" ? styles.visible : styles.hidden
        }`}
      >
        <Image
          src="/images/nextJS.png"
          alt="NextJS"
          className={styles.stackImg}
          width={100}
          height={100}
        />

        <Image
          src="/images/mongoDB.png"
          alt="MongoDB"
          className={styles.stackImg}
          width={100}
          height={100}
        />

        <Image
          src="/images/openai.png"
          alt="OpenAI"
          className={styles.stackImg}
          width={100}
          height={100}
        />

        <Image
          src="/images/react.png"
          alt="React"
          className={styles.stackImg}
          width={100}
          height={100}
        />

        <Image
          src="/images/vercel.png"
          alt="Vercel"
          className={styles.stackImg}
          width={100}
          height={100}
        />
      </div>

      {/* stackBucket */}
      <div
        ref={sceneRef}
        className={`${styles.StackBucket} ${
          activeSection === "stackBucket" ? styles.visible : styles.hidden
        }`}
      >
        <p>Interact - Drag & Drop with cursor</p>
      </div>
    </div>
  );
};

export default StackBucket;
