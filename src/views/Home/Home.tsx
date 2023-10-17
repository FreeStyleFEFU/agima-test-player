import React, { FC } from "react";

import { Player } from "../../components/home/Player/Player";

import styles from "./Home.module.scss";

import { mockMusicItems } from "../../mock/music";

export const Home: FC = () => {
  return (
    <div className={styles.root}>
      <Player items={mockMusicItems} />
    </div>
  );
};
