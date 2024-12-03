import React from "react";
import styles from "./Services.module.scss";
import { MdWeb } from "react-icons/md";
import discoWebImg from "../../../assets/images/discoWeb.png";
import Image from "next/image";
import { IoCodeSlash } from "react-icons/io5";
import { IoLogoVercel } from "react-icons/io5";

const Services = () => {
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
              <h3>Website planning, design and development</h3>
              <p>
                We will build you a website that is so good, it will make <br />{" "}
                all the other websites jealous. Trust me, <br /> not kidding.
              </p>
            </div>

            <div className={styles.ServicesGridItemIcons}>
              <Image
                className={styles.serviceGridWebImg}
                src={discoWebImg}
                alt="discoWeb"
              />
            </div>
          </div>

          <div className={styles.ServicesGridItem}>
            <div className={styles.ServicesGridItemTitle}>
              <MdWeb className={styles.ServicesGridIcon} />
              <h3>Full Deployment and Maintenance</h3>
              <p>
                We will build you a website that is so good, it will make <br />{" "}
                all the other websites jealous. Trust me, <br /> not kidding.
              </p>
            </div>

            <div className={styles.ServicesGridItemIcons}>
              <IoCodeSlash className={styles.ServicesGridIcon} />
              <IoLogoVercel className={styles.ServicesGridIcon} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
