import Phaser from "phaser";
import { WIDTH } from "../data/constants.js";
import { loadProfile, resetProfile } from "../logic/storage.js";

export default class ProfileScene extends Phaser.Scene {
  constructor() {
    super("ProfileScene");
  }

  create() {
    this.profile = loadProfile();

    if (!this.profile.username) {
      this.scene.start("UsernameScene");
      return;
    }

    this.cameras.main.setBackgroundColor("#0d0d18");

    this.add
      .text(WIDTH / 2, 70, "PROFILE", {
        fontSize: "54px",
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(WIDTH / 2, 130, this.profile.username, {
        fontSize: "30px",
        color: "#ffcc4d",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(WIDTH / 2, 200, `XP: ${this.profile.xp}`, {
        fontSize: "24px",
        color: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    this.add
      .text(WIDTH / 2, 250, `Coins: ${this.profile.coins}`, {
        fontSize: "24px",
        color: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    this.add
      .text(WIDTH / 2, 300, `Wins: ${this.profile.wins}`, {
        fontSize: "24px",
        color: "#00f5d4",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(WIDTH / 2, 350, `Losses: ${this.profile.losses}`, {
        fontSize: "24px",
        color: "#ff4d6d",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(WIDTH / 2, 400, `Draws: ${this.profile.draws}`, {
        fontSize: "24px",
        color: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    this.add
      .text(WIDTH / 2, 450, `Bronze Shards: ${this.profile.bronzeShards}`, {
        fontSize: "24px",
        color: "#cd7f32",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.createButton(WIDTH / 2, 555, 260, 55, "BACK", () => {
      this.scene.start("MenuScene");
    });

    this.createButton(WIDTH / 2, 625, 260, 48, "RESET PROFILE", () => {
      const confirmed = window.confirm("Reset profile stats and username?");

      if (confirmed) {
        resetProfile();
        this.scene.start("UsernameScene");
      }
    });
  }

  createButton(x, y, width, height, label, callback) {
    const button = this.add.rectangle(x, y, width, height, 0xffcc4d);
    button.setInteractive({ useHandCursor: true });

    this.add
      .text(x, y, label, {
        fontSize: "20px",
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