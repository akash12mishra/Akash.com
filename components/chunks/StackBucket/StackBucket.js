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
} from "matter-js";

const StackBucket = () => {
  const sceneRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        } else {
          setInView(false);
        }
      },
      { threshold: 0.5 }
    );

    if (sceneRef.current) {
      observer.observe(sceneRef.current);
    }

    return () => {
      if (sceneRef.current) {
        observer.unobserve(sceneRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!inView) return;

    const images = [
      "/images/React.png",
      "/images/nextJS.png",
      "/images/mongoDB.png",
      "/images/openai.png",
      "/images/vercel.png",
    ];

    const engine = Engine.create();
    const world = engine.world;

    engine.gravity.y = 1;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: 600,
        height: 400,
        wireframes: false,
        background: "#fff",
      },
    });

    const bucketWidth = 600;
    const bucketHeight = 400;

    // Add bucket boundaries to mimic a cylinder shape
    const walls = [
      Bodies.rectangle(bucketWidth / 2, bucketHeight, bucketWidth, 20, {
        isStatic: true,
        render: { visible: false },
      }), // Bottom boundary
      Bodies.rectangle(bucketWidth / 8, bucketHeight / 2, 20, bucketHeight, {
        isStatic: true,
        render: { visible: false },
        angle: Math.PI / 6, // Tilt to simulate a curve
      }), // Left side (curved effect)
      Bodies.rectangle(
        (7 * bucketWidth) / 8,
        bucketHeight / 2,
        20,
        bucketHeight,
        {
          isStatic: true,
          render: { visible: false },
          angle: -Math.PI / 6, // Tilt to simulate a curve
        }
      ), // Right side (curved effect)
    ];

    World.add(world, walls);

    // Function to create and drop objects sequentially
    const dropBodiesSequentially = () => {
      const startX = bucketWidth / 2; // Center of the bucket
      const spacing = 50; // Space between stacked objects

      images.forEach((src, index) => {
        setTimeout(() => {
          const x = startX;
          const y = 50; // Objects start falling from the top

          const body = Bodies.rectangle(x, y, 50, 50, {
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
        }, index * 800); // Drop each object every 800ms
      });
    };

    dropBodiesSequentially();

    // Add mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });

    World.add(world, mouseConstraint);
    render.mouse = mouse;

    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    // Cleanup on unmount or when component goes out of view
    return () => {
      Render.stop(render);
      Runner.stop(runner);
      World.clear(world);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, [inView]);

  const sentence = (
    <>
      <span className={`${styles.word} ${styles.filled}`}>Tech</span>
      <span className={`${styles.word} ${styles.bordered}`}>Stack</span>
    </>
  );

  return (
    <div className={styles.StackBucketWrap}>
      <div className={styles.stackHead}>{sentence}</div>

      <div ref={sceneRef} className={styles.StackBucket}>
        <p>Interact - Drag & Drop with cursor</p>
      </div>
    </div>
  );
};

export default StackBucket;
