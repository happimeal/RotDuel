import Phaser from "phaser";
import { WIDTH, HEIGHT } from "../data/constants.js";
import { loadProfile, setUsername } from "../logic/storage.js";

export default class UsernameScene extends Phaser.Scene {
  constructor() {
    super("UsernameScene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#070710");

    this.profile = loadProfile();

    this.add
      .text(WIDTH / 2, 105, "ROTDUEL", {
        fontSize: "82px",
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(WIDTH / 2, 170, "Lock your lineup. Reveal the rot.", {
        fontSize: "26px",
        color: "#ffcc4d",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.messageText = this.add
      .text(
        WIDTH / 2,
        250,
        this.profile.username
          ? `Welcome back, ${this.profile.username}`
          : "Create your username to begin",
        {
          fontSize: "26px",
          color: "#ffffff",
          fontFamily: "Arial",
          fontStyle: "bold",
        }
      )
      .setOrigin(0.5);

    this.add
      .text(WIDTH / 2, 300, "Your username will show when you create or join matches.", {
        fontSize: "18px",
        color: "#aaaaaa",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    if (this.profile.username) {
      this.createButton(WIDTH / 2, 395, 320, 62, "CONTINUE", () => {
        this.scene.start("MenuScene");
      });

      this.createButton(WIDTH / 2, 475, 320, 54, "CHANGE USERNAME", () => {
        this.askForUsername();
      });
    } else {
      this.createButton(WIDTH / 2, 420, 340, 68, "CREATE USERNAME", () => {
        this.askForUsername();
      });
    }

    this.errorText = this.add
      .text(WIDTH / 2, HEIGHT - 90, "", {
        fontSize: "18px",
        color: "#ff4d6d",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
  }

  askForUsername() {
    const currentName = this.profile.username || "";
    const username = window.prompt("Enter your RotDuel username:", currentName);

    if (username === null) {
      return;
    }

    const cleanedUsername = username.trim();

    if (cleanedUsername.length < 3) {
      this.errorText.setText("Username must be at least 3 characters.");
      return;
    }

    if (cleanedUsername.length > 16) {
      this.errorText.setText("Username must be 16 characters or less.");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(cleanedUsername)) {
      this.errorText.setText("Use letters, numbers, and underscores only.");
      return;
    }

    setUsername(cleanedUsername);
    this.scene.start("MenuScene");
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