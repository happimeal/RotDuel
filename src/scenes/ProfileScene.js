import Phaser from "phaser";
import { WIDTH } from "../data/constants.js";
import { loadProfile } from "../logic/storage.js";

export default class ProfileScene extends Phaser.Scene {
  constructor() {
    super("ProfileScene");
  }

  create() {
    const profile = loadProfile();

    this.cameras.main.setBackgroundColor("#0d0d18");

    this.add
      .text(WIDTH / 2, 80, "PROFILE", {
        fontSize: "54px",
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(WIDTH / 2, 145, profile.username || "Username system coming next", {
        fontSize: "26px",
        color: "#ffcc4d",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(WIDTH / 2, 235, `XP: ${profile.xp}`, {
        fontSize: "24px",
        color: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    this.add
      .text(WIDTH / 2, 285, `Coins: ${profile.coins}`, {
        fontSize: "24px",
        color: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    this.add
      .text(WIDTH / 2, 335, `Wins: ${profile.wins}   Losses: ${profile.losses}   Draws: ${profile.draws}`, {
        fontSize: "24px",
        color: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    this.add
      .text(WIDTH / 2, 385, `Bronze Shards: ${profile.bronzeShards}`, {
        fontSize: "24px",
        color: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    this.createButton(WIDTH / 2, 560, 260, 55, "BACK", () => {
      this.scene.start("MenuScene");
    });
  }

  createButton(x, y, width, height, label, callback) {
    const button = this.add.rectangle(x, y, width, height, 0xffcc4d);
    button.setInteractive({ useHandCursor: true });

    this.add
      .text(x, y, label, {
        fontSize: "22px",
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