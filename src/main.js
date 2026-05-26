import Phaser from "phaser";
import "./style.css";

import { WIDTH, HEIGHT } from "./data/constants.js";

import MenuScene from "./scenes/MenuScene.js";
import InventoryScene from "./scenes/InventoryScene.js";
import WaitingRoomScene from "./scenes/WaitingRoomScene.js";
import DuelScene from "./scenes/DuelScene.js";
import ProfileScene from "./scenes/ProfileScene.js";

const config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  parent: "app",
  scene: [
    MenuScene,
    InventoryScene,
    WaitingRoomScene,
    DuelScene,
    ProfileScene,
  ],
};

new Phaser.Game(config);