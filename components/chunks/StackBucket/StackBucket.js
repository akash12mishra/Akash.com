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
  Events, // Import Events from matter-js
} from "matter-js";

const StackBucket = () => {
  const sceneRef = useRef(null);
  const [inView, setInView] = useState(false); // Track if the component is in view

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true); // Trigger the animation when in view
        } else {
          setInView(false); // Optionally stop the animation when out of view
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the component is in view
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
    if (!inView) return; // Don't initialize the engine unless the component is in view

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
        height: 300, // Reduced bucket height
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
        render: { fillStyle: "black" },
      }), // Bottom wall
      Bodies.rectangle(0, bucketHeight / 2, 20, bucketHeight, {
        isStatic: true,
        render: { fillStyle: "black" },
      }), // Left wall
      Bodies.rectangle(bucketWidth, bucketHeight / 2, 20, bucketHeight, {
        isStatic: true,
        render: { fillStyle: "black" },
      }), // Right wall
    ];

    World.add(world, walls);

    // Create image objects
    const createImageBodies = () => {
      const imageBodies = images.map((src, index) => {
        const x = 100 + index * 90; // Distribute images horizontally
        const y = 50; // Initial Y position

        const body = Bodies.rectangle(x, y, 50, 50, {
          render: {
            sprite: {
              texture: src,
              xScale: 0.2,
              yScale: 0.2,
            },
          },
        });

        // Apply a small random force to spread out the objects
        const randomForceX = (Math.random() - 0.5) * 0.05;
        const randomForceY = (Math.random() - 0.5) * 0.05;
        Body.applyForce(body, body.position, {
          x: randomForceX,
          y: randomForceY,
        });

        return body;
      });

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

    // Prevent objects from escaping boundaries
    Events.on(engine, "collisionActive", (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        [bodyA, bodyB].forEach((body) => {
          // Ensure the object stays within bounds by checking positions
          if (body.position.x < 25) {
            Body.setVelocity(body, {
              x: Math.abs(body.velocity.x),
              y: body.velocity.y,
            });
          }
          if (body.position.x > bucketWidth - 25) {
            Body.setVelocity(body, {
              x: -Math.abs(body.velocity.x),
              y: body.velocity.y,
            });
          }
          if (body.position.y < 25) {
            Body.setVelocity(body, {
              x: body.velocity.x,
              y: Math.abs(body.velocity.y),
            });
          }
        });
      });
    });

    // Cleanup on unmount or when component goes out of view
    return () => {
      Render.stop(render);
      Runner.stop(runner);
      World.clear(world);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, [inView]); // Re-run the effect only when `inView` changes

  return <div ref={sceneRef} className={styles.StackBucket}></div>;
};

export default StackBucket;
