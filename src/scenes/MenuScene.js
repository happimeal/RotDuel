import Phaser from "phaser";
import { WIDTH, HEIGHT } from "../data/constants.js";
import { loadProfile } from "../logic/storage.js";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  create() {
    this.profile = loadProfile();

    if (!this.profile.username) {
      this.scene.start("UsernameScene");
      return;
    }

    this.cameras.main.setBackgroundColor("#070710");

    this.add
      .text(WIDTH / 2, 90, "ROTDUEL", {
        fontSize: "82px",
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(WIDTH / 2, 150, "3 cards. 3 reveals. 1 winner.", {
        fontSize: "26px",
        color: "#ffcc4d",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(WIDTH / 2, 205, `Logged in as ${this.profile.username}`, {
        fontSize: "22px",
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(WIDTH / 2, 250, `XP ${this.profile.xp}   Coins ${this.profile.coins}   W/L/D ${this.profile.wins}/${this.profile.losses}/${this.profile.draws}`, {
        fontSize: "18px",
        color: "#aaaaaa",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    this.createButton(WIDTH / 2, 350, 360, 70, "PLAY DUEL", () => {
      this.scene.start("InventoryScene");
    });

    this.createButton(WIDTH / 2, 440, 360, 60, "PROFILE", () => {
      this.scene.start("ProfileScene");
    });

    this.createButton(WIDTH / 2, 515, 360, 54, "CHANGE USERNAME", () => {
      this.scene.start("UsernameScene");
    });

    this.add
      .text(WIDTH / 2, HEIGHT - 45, "Prototype: local bot match, no wallet, no real multiplayer yet", {
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