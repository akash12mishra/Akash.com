"use client";

import React from "react";
import styles from "./Services.module.scss";
import { MdWeb } from "react-icons/md";
import discoWebImg from "../../../assets/images/discoWeb.png";
import Image from "next/image";
import { IoCodeSlash } from "react-icons/io5";
import { IoLogoVercel } from "react-icons/io5";
import codeImg from "../../../assets/images/codeService.png";
import vercelImg from "../../../assets/images/vercelService.png";
import deployImg from "../../../assets/images/deployService.png";
import { GrDeploy } from "react-icons/gr";
import aiAutoImg from "../../../assets/images/AIAutomation.jpeg";
import { BsRobot } from "react-icons/bs";
import { IoSparklesOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa";
import AIAgentImg from "../../../assets/images/AIAgents.png";
import ReactImg from "../../../assets/images/React-components.png";
import SEOImg from "../../../assets/images/SEO.png";
import WebImg from "../../../assets/images/Website.png";
import EmailImg from "../../../assets/images/EmailMarket.png";
import { FaReact } from "react-icons/fa";
import { MdOutlineMarkEmailRead } from "react-icons/md";

const Services = () => {
  const router = useRouter();

  return (
    <div className={styles.Services}>
      <div className={styles.ServicesTitle}>
        <h2>We Engineer everything on your behalf!</h2>
        <p>
          Handle everything from planning, design to development and building{" "}
          <br /> custom AI automation solutions!
        </p>
      </div>

      <div className={styles.ServicesGrid}>
        <div className={styles.ServicesGridOne}>
          <div className={styles.ServicesGridItem}>
            <div className={styles.ServicesGridItemTitle}>
              <MdWeb className={styles.ServicesGridIcon} />
              <h3>Website/MVP planning, design and development</h3>
              <p>
                We plan, design, and develop MVPs so spectacular, <br /> your
                rivals will feel the heat.
              </p>
            </div>

            <div className={styles.ServicesGridItemIcons}>
              <Image
                className={styles.serviceGridWebImg}
                src={WebImg}
                alt="discoWeb"
              />
            </div>
          </div>

          <div className={styles.ServicesGridItem}>
            <div className={styles.ServicesGridItemTitle}>
              <GrDeploy className={styles.ServicesGridIcon} />
              <h3>Full Deployment and Maintenance</h3>
              <p>
                We deploy, maintain, and optimize your website relentlessly,
                ensuring unstoppable uptime and unstoppable results.
              </p>
            </div>

            <div className={styles.ServicesGridItemIcons}>
              <Image alt="" src={codeImg} className={styles.ServicesGridIcon} />

              <Image
                alt=""
                src={vercelImg}
                className={styles.ServicesGridIcon}
              />

              <Image
                alt=""
                src={deployImg}
                className={styles.ServicesGridIcon}
              />
            </div>
          </div>
        </div>

        <div className={styles.ServicesGridTwo}>
          <div className={styles.ServicesGridItem}>
            <div className={styles.ServicesGridItemTitle}>
              <BsRobot className={styles.ServicesGridIcon} />

              <h3>Custom AI Automations & Integrations</h3>

              <p>
                We integrate cutting-edge AI automations for maximum efficiency,{" "}
                <br />
                freeing you to innovate without constraints.
              </p>

              <button onClick={() => router.push("/chatPlay")}>
                Chat with AI{" "}
                <IoSparklesOutline className={styles.demoSparkleService} />{" "}
              </button>
            </div>

            <div className={styles.ServicesGridItemIcons}>
              <Image
                alt=""
                src={aiAutoImg}
                className={styles.ServicesGridIcon}
              />
            </div>
          </div>
        </div>

        <div className={styles.ServicesGridThree}>
          <div className={styles.gridLeft}>
            <div className={styles.gridItem}>
              <div className={styles.content}>
                <div>
                  <FaGoogle className={styles.icon} />
                  <h3>Get found on Google</h3>
                  <p>Your Search visibility, your success.</p>
                </div>
                <Image
                  alt="Find on Google"
                  src={SEOImg}
                  className={styles.featureImage}
                />
              </div>
            </div>
          </div>
          <div className={styles.gridRight}>
            <div className={styles.gridItem}>
              <div className={styles.content}>
                <div>
                  <FaReact className={styles.icon} />
                  <h3>Custom React Components</h3>
                  <p>Keep track of your progress</p>
                </div>
                <Image
                  alt="Updates"
                  src={ReactImg}
                  className={styles.featureImage}
                />
              </div>
            </div>

            <div className={styles.gridItem}>
              <div className={styles.content}>
                <div>
                  <BsRobot className={styles.icon} />
                  <h3>Unlimited AI Agents</h3>
                  <p>From development to deployment</p>
                </div>
                <Image
                  alt="Deployment"
                  src={AIAgentImg}
                  className={styles.featureImage}
                />
              </div>
            </div>

            <div className={styles.gridItem}>
              <div className={styles.content}>
                <div>
                  <MdOutlineMarkEmailRead className={styles.icon} />
                  <h3>Email Marketing & Business Automations</h3>
                  <p>Complete end-to-end marketing automations</p>
                </div>
                <Image
                  alt="Deployment"
                  src={EmailImg}
                  className={styles.featureImage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
