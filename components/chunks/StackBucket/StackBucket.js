"use client";

import React, { useEffect, useRef } from "react";
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

  useEffect(() => {
    const images = [
      "/images/React.png",
      "/images/nextJS.png",
      "/images/mongoDB.png",
      "/images/openai.png",
      "/images/vercel.png",
    ];

    const engine = Engine.create();
    const world = engine.world;

    // Configure gravity
    engine.gravity.y = 1;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: 600,
        height: 400,
        wireframes: false,
        background: "#f8f8f8",
      },
    });

    const bucketWidth = 600;
    const bucketHeight = 400;

    // Add bucket boundaries
    const walls = [
      Bodies.rectangle(bucketWidth / 2, bucketHeight, bucketWidth, 20, {
        isStatic: true,
        render: { fillStyle: "#ccc" },
      }), // Bottom wall
      Bodies.rectangle(0, bucketHeight / 2, 20, bucketHeight, {
        isStatic: true,
        render: { fillStyle: "#ccc" },
      }), // Left wall
      Bodies.rectangle(bucketWidth, bucketHeight / 2, 20, bucketHeight, {
        isStatic: true,
        render: { fillStyle: "#ccc" },
      }), // Right wall
    ];

    World.add(world, walls);

    // Manually create a stack of image objects
    const createImageBodies = () => {
      const imageBodies = [];
      const rows = 3; // Number of rows
      const cols = 5; // Number of columns
      const spacing = 50; // Space between objects

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = 50 + col * spacing; // X position
          const y = 50 + row * spacing; // Y position
          const randomImage = images[Math.floor(Math.random() * images.length)]; // Random image

          const body = Bodies.rectangle(x, y, 50, 50, {
            render: {
              sprite: {
                texture: randomImage,
                xScale: 0.2,
                yScale: 0.2,
              },
            },
          });

          imageBodies.push(body);
        }
      }

      World.add(world, imageBodies);
    };

    createImageBodies();

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

    // Run the engine and renderer
    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    // Cleanup on unmount
    return () => {
      Render.stop(render);
      Runner.stop(runner);
      World.clear(world);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, []);

  return <div ref={sceneRef} className={styles.StackBucket}></div>;
};

export default StackBucket;
