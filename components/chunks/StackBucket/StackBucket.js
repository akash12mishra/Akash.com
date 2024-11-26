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
  Events,
  Composite, // Import Composite for managing bodies
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
      Bodies.rectangle(bucketWidth / 2, bucketHeight + 10, bucketWidth, 20, {
        isStatic: true,
        render: { visible: false },
      }), // Bottom wall
      Bodies.rectangle(-10, bucketHeight / 2, 20, bucketHeight, {
        isStatic: true,
        render: { visible: false },
      }), // Left wall
      Bodies.rectangle(bucketWidth + 10, bucketHeight / 2, 20, bucketHeight, {
        isStatic: true,
        render: { visible: false },
      }), // Right wall
    ];

    World.add(world, walls);

    // Create non-overlapping image objects
    const createImageBodies = () => {
      const imageBodies = images.map((src, index) => {
        const x = 100 + index * 90; // Initial X position
        const y = 50; // Initial Y position

        const body = Bodies.rectangle(x, y, 50, 50, {
          restitution: 0.9, // Bounciness
          friction: 0.2, // Friction for realistic collision
          frictionAir: 0.05,
          density: 0.01, // Mass
          render: {
            sprite: {
              texture: src,
              xScale: 0.2,
              yScale: 0.2,
            },
          },
        });

        return body;
      });

      World.add(world, imageBodies);

      // Prevent overlap by applying separating forces dynamically
      Events.on(engine, "beforeUpdate", () => {
        for (let i = 0; i < imageBodies.length; i++) {
          for (let j = i + 1; j < imageBodies.length; j++) {
            const bodyA = imageBodies[i];
            const bodyB = imageBodies[j];

            const dx = bodyA.position.x - bodyB.position.x;
            const dy = bodyA.position.y - bodyB.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = 50; // Minimum distance to avoid overlap

            if (distance < minDistance) {
              const overlap = minDistance - distance;
              const force = overlap * 0.02; // Adjust force for smooth separation

              const angle = Math.atan2(dy, dx);
              const fx = Math.cos(angle) * force;
              const fy = Math.sin(angle) * force;

              Body.applyForce(bodyA, bodyA.position, { x: fx, y: fy });
              Body.applyForce(bodyB, bodyB.position, { x: -fx, y: -fy });
            }
          }
        }
      });
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

    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    // Prevent objects from escaping boundaries
    Events.on(engine, "beforeUpdate", () => {
      Composite.allBodies(world).forEach((body) => {
        if (body.position.y > bucketHeight - 25) {
          Body.setPosition(body, {
            x: body.position.x,
            y: bucketHeight - 25,
          });
          Body.setVelocity(body, {
            x: body.velocity.x,
            y: -Math.abs(body.velocity.y),
          });
        }

        if (body.position.x < 25) {
          Body.setPosition(body, {
            x: 25,
            y: body.position.y,
          });
          Body.setVelocity(body, {
            x: Math.abs(body.velocity.x),
            y: body.velocity.y,
          });
        }

        if (body.position.x > bucketWidth - 25) {
          Body.setPosition(body, {
            x: bucketWidth - 25,
            y: body.position.y,
          });
          Body.setVelocity(body, {
            x: -Math.abs(body.velocity.x),
            y: body.velocity.y,
          });
        }
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
  }, [inView]);

  return <div ref={sceneRef} className={styles.StackBucket}></div>;
};

export default StackBucket;
