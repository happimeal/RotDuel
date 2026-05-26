import Phaser from "phaser";
import "./style.css";

import { WIDTH, HEIGHT } from "./data/constants.js";

import UsernameScene from "./scenes/UsernameScene.js";
import MenuScene from "./scenes/MenuScene.js";
import InventoryScene from "./scenes/InventoryScene.js";
import WaitingRoomScene from "./scenes/WaitingRoomScene.js";
import DuelScene from "./scenes/DuelScene.js";
import ProfileScene from "./scenes/ProfileScene.js";

function isMobileOrTablet() {
  const userAgent = navigator.userAgent.toLowerCase();

  const mobileOrTabletUserAgent =
    /android|iphone|ipad|ipod|tablet|mobile|silk|kindle|playbook/.test(userAgent);

  const touchTablet = navigator.maxTouchPoints > 1 && window.innerWidth <= 1400;

  const tooSmallForDesktop = window.innerWidth < 1100 || window.innerHeight < 680;

  return mobileOrTabletUserAgent || touchTablet || tooSmallForDesktop;
}

function showMaintenanceScreen() {
  const app = document.querySelector("#app");

  app.innerHTML = `
    <div class="maintenance-screen">
      <div class="maintenance-card">
        <div class="maintenance-badge">ROTDUEL</div>
        <h1>Mobile version under maintenance</h1>
        <p>
          RotDuel is currently only available on desktop while the mobile and tablet layout is being built.
        </p>
        <p class="maintenance-small">
          Please open this website on a desktop or laptop screen.
        </p>
      </div>
    </div>
  `;
}

if (isMobileOrTablet()) {
  showMaintenanceScreen();
} else {
  const config = {
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
    parent: "app",
    backgroundColor: "#05050a",
    scale: {
      mode: Phaser.Scale.NONE,
      autoCenter: Phaser.Scale.NO_CENTER,
    },
    scene: [
      UsernameScene,
      MenuScene,
      InventoryScene,
      WaitingRoomScene,
      DuelScene,
      ProfileScene,
    ],
  };

  new Phaser.Game(config);
}