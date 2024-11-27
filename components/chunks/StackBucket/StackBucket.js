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
        height: 300,
        wireframes: false,
        background: "#fff",
      },
    });

    const bucketWidth = 600;
    const bucketHeight = 300;

    // Add bucket boundaries
    const walls = [
      Bodies.rectangle(bucketWidth / 2, bucketHeight, bucketWidth, 20, {
        isStatic: true,
        render: { visible: false },
      }),
      Bodies.rectangle(-10, bucketHeight / 2, 20, bucketHeight, {
        isStatic: true,
        render: { visible: false },
      }),
      Bodies.rectangle(bucketWidth + 10, bucketHeight / 2, 20, bucketHeight, {
        isStatic: true,
        render: { visible: false },
      }),
    ];

    World.add(world, walls);

    // Function to create and drop bodies sequentially
    const dropBodiesSequentially = () => {
      const startX = 80; // Starting X position
      const spacing = 100; // Space between objects

      images.forEach((src, index) => {
        setTimeout(() => {
          const x = startX + index * spacing;
          const y = 50;

          const body = Bodies.rectangle(x, y, 50, 50, {
            restitution: 0.9,
            friction: 0.2,
            frictionAir: 0.05,
            density: 0.01,
            render: {
              sprite: {
                texture: src,
                xScale: 0.2,
                yScale: 0.2,
              },
            },
          });

          World.add(world, body);
        }, index * 500); // Delay each drop by 500ms
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

  return (
    <div ref={sceneRef} className={styles.StackBucket}>
      <h3>My Tech Stack</h3>
      <p>Interact - Drag & Drop with cursor</p>
    </div>
  );
};

export default StackBucket;
