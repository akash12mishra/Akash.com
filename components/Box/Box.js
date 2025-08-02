import React from "react";
import styles from "./Box.module.scss";

const Box = ({ data }) => {
  if (data === "AI Box Rendered") {
    return <div>AI Box Component</div>;
  }

  // Meeting scheduler has been removed in cleanup
  if (data.type === "meeting") {
    return (
      <div className={styles.notAvailableMessage}>
        Meeting scheduling is not available
      </div>
    );
  }

  return null;
};

export default Box;
