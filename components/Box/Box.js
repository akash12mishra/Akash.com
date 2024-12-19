import React from "react";
import styles from "./Box.module.scss";
import MeetingScheduler from "../MeetingScheduler/MeetingScheduler";

const Box = ({ data }) => {
  if (data === "AI Box Rendered") {
    return <div>AI Box Component</div>;
  }

  if (data.type === "meeting") {
    return <MeetingScheduler onSave={data.onSave} />;
  }

  return null;
};

export default Box;
