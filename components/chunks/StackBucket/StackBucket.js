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
      { src: "/images/nextJS.png", id: "nextJS" },
      { src: "/images/vercel.png", id: "vercel" },
      { src: "/images/react.png", id: "react" },
      { src: "/images/openai.png", id: "openAI" },
      { src: "/images/mongoDB.png", id: "mongoDB" },
    ];

    const engine = Engine.create();
    const world = engine.world;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: 300, // Narrower bucket width
        height: 400,
        wireframes: false,
        background: "#fff",
      },
    });

    // Add walls (bucket borders) to simulate a cylindrical container
    const bucketWalls = [
      Bodies.rectangle(150, 395, 300, 10, {
        isStatic: true,
        render: { fillStyle: "white" }, // Bottom wall
      }),
      Bodies.rectangle(50, 200, 10, 400, {
        isStatic: true,
        render: { fillStyle: "white" }, // Left curved wall
      }),
      Bodies.rectangle(250, 200, 10, 400, {
        isStatic: true,
        render: { fillStyle: "white" }, // Right curved wall
      }),
    ];

    World.add(world, bucketWalls);

    // Function to drop objects sequentially
    const dropBodiesSequentially = () => {
      const startX = 150; // Center of the bucket
      const initialY = 50;
      const positions = {
        nextJS: { x: 150, y: 300, angle: 0 }, // Horizontal base
        vercel: { x: 150, y: 240, angle: 0 }, // On top of NextJS
        react: { x: 100, y: 190, angle: -Math.PI / 8 }, // Left side
        openAI: { x: 200, y: 170, angle: Math.PI / 8 }, // Top-right, slightly over "C"
        mongoDB: { x: 140, y: 120, angle: -Math.PI / 12 }, // Top, inclined above OpenAI
      };

      images.forEach((img, index) => {
        setTimeout(() => {
          const body = Bodies.rectangle(startX, initialY, 50, 50, {
            restitution: 0.7,
            friction: 0.5,
            render: {
              sprite: {
                texture: img.src,
                xScale: 0.2,
                yScale: 0.2,
              },
            },
          });

          World.add(world, body);

          // After falling, position the objects in the desired stacking pattern
          setTimeout(() => {
            Body.setPosition(body, {
              x: positions[img.id].x,
              y: positions[img.id].y,
            });
            Body.setAngle(body, positions[img.id].angle);
            Body.setStatic(body, true); // Lock the body in place
          }, 1000);
        }, index * 800);
      });
    };

    dropBodiesSequentially();

    // Add mouse control for interactivity
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }, // Hide drag line
      },
    });

    World.add(world, mouseConstraint); // Enable dragging

    render.mouse = mouse;

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
