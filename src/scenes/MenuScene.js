import Phaser from "phaser";
import { WIDTH, HEIGHT } from "../data/constants.js";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#070710");

    this.add
      .text(WIDTH / 2, 120, "ROTDUEL", {
        fontSize: "86px",
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(WIDTH / 2, 185, "3 cards. 3 reveals. 1 winner.", {
        fontSize: "26px",
        color: "#ffcc4d",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(WIDTH / 2, 245, "Create a match. Opponent joins. Player 1 reveals first.", {
        fontSize: "22px",
        color: "#dddddd",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    this.createButton(WIDTH / 2, 365, 360, 70, "OPEN INVENTORY", () => {
      this.scene.start("InventoryScene");
    });

    this.createButton(WIDTH / 2, 455, 360, 60, "PROFILE", () => {
      this.scene.start("ProfileScene");
    });

    this.add
      .text(WIDTH / 2, HEIGHT - 55, "Prototype: local bot match, no wallet, no real multiplayer yet", {
        fontSize: "18px",
        color: "#999999",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);
  }

  createButton(x, y, width, height, label, callback) {
    const button = this.add.rectangle(x, y, width, height, 0xffcc4d);
    button.setInteractive({ useHandCursor: true });

    this.add
      .text(x, y, label, {
        fontSize: "24px",
        color: "#000000",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    button.on("pointerover", () => button.setFillStyle(0xffffff));
    button.on("pointerout", () => button.setFillStyle(0xffcc4d));
    button.on("pointerdown", callback);
  }
}