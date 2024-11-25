import React from "react";
import styles from "./FounderInfo.module.scss";
import founderLogo from "../../../assets/images/arka.png";
import Image from "next/image";

const FounderInfo = () => {
  return (
    <div className={styles.FounderInfo}>
      <div className={styles.founderImage}>
        <Image src={founderLogo} alt="Founder" className={styles.founderImg} />
      </div>

      <div className={styles.founderDetails}>
        <p>
          Manu is the man! He is the best front-end developer I have worked
          with. He took the requirements and quite literally ran with them.{" "}
          <br /> <br /> We are super happy with the result and product we got.
          He iss very intelligent, experienced, friendly, and helpful. To anyone
          reading this - I cannott recommend this Manu enough, your job will be
          done exceptionally well, and you will be delighted with the end result
        </p>
      </div>

      <div className={styles.founderSignature}>
        <h6>Arka Lal Chakravarty</h6>
        <p>Founder @ arkalalchakravarty.com</p>
      </div>
    </div>
  );
};

export default FounderInfo;
