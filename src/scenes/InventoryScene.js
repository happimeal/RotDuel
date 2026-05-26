import Phaser from "phaser";

import {
  WIDTH,
  PLAYER_TWO_USERNAME,
  TIER_COLORS,
} from "../data/constants.js";

import { PLAYER_INVENTORY } from "../data/cards.js";
import { cloneCard } from "../logic/battleLogic.js";
import { loadProfile } from "../logic/storage.js";

export default class InventoryScene extends Phaser.Scene {
  constructor() {
    super("InventoryScene");
  }

  create() {
    this.profile = loadProfile();

    if (!this.profile.username) {
      this.scene.start("UsernameScene");
      return;
    }

    this.lineup = [];
    this.ui = [];

    this.cameras.main.setBackgroundColor("#0d0d18");
    this.render();
  }

  clearUI() {
    this.ui.forEach((item) => item.destroy());
    this.ui = [];
  }

  addUI(item) {
    this.ui.push(item);
    return item;
  }

  render() {
    this.clearUI();

    this.addUI(
      this.add
        .text(WIDTH / 2, 45, "YOUR ROTMON INVENTORY", {
          fontSize: "42px",
          color: "#ffffff",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5)
    );

    this.addUI(
      this.add
        .text(WIDTH / 2, 84, `${this.profile.username}, choose your 3-card lineup in order`, {
          fontSize: "20px",
          color: "#bbbbbb",
          fontFamily: "Arial",
        })
        .setOrigin(0.5)
    );

    this.addUI(
      this.add
        .text(315, 135, "Available Cards", {
          fontSize: "26px",
          color: "#ffcc4d",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5)
    );

    this.addUI(
      this.add
        .text(820, 135, "Your Lineup", {
          fontSize: "26px",
          color: "#ffcc4d",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5)
    );

    PLAYER_INVENTORY.forEach((card, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);

      const x = 190 + col * 250;
      const y = 215 + row * 145;

      this.createInventoryCard(x, y, card);
    });

    for (let i = 0; i < 3; i++) {
      this.createLineupSlot(820, 215 + i * 150, i);
    }

    const ready = this.lineup.length === 3;

    this.createMainButton(
      820,
      660,
      330,
      60,
      ready ? "CREATE MATCH" : "SELECT 3 CARDS",
      ready,
      () => {
        if (!ready) return;

        this.scene.start("WaitingRoomScene", {
          playerLineup: this.lineup.map(cloneCard),
          playerOneUsername: this.profile.username,
          playerTwoUsername: PLAYER_TWO_USERNAME,
        });
      }
    );

    this.createSmallButton(95, 45, 120, 42, "BACK", () => {
      this.scene.start("MenuScene");
    });
  }

  createInventoryCard(x, y, card) {
    const selected = this.lineup.some((item) => item.id === card.id);
    const borderColor = selected ? 0x777777 : TIER_COLORS[card.tier];

    this.addUI(this.add.rectangle(x, y, 220, 125, borderColor));
    const bg = this.addUI(this.add.rectangle(x, y, 210, 115, selected ? 0x202020 : 0x101020));

    if (!selected) {
      bg.setInteractive({ useHandCursor: true });

      bg.on("pointerdown", () => {
        if (this.lineup.length < 3) {
          this.lineup.push(cloneCard(card));
          this.render();
        }
      });

      bg.on("pointerover", () => bg.setFillStyle(0x1d1d32));
      bg.on("pointerout", () => bg.setFillStyle(0x101020));
    }

    this.addUI(
      this.add
        .text(x, y - 40, card.name, {
          fontSize: "15px",
          color: "#ffffff",
          fontFamily: "Arial",
          fontStyle: "bold",
          align: "center",
          wordWrap: { width: 190 },
        })
        .setOrigin(0.5)
    );

    this.addUI(
      this.add
        .text(x, y - 10, `${card.tier} | ${card.ovr} OVR`, {
          fontSize: "15px",
          color: "#ffcc4d",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5)
    );

    this.addUI(
      this.add
        .text(x, y + 18, `Class: ${card.classType}`, {
          fontSize: "14px",
          color: "#dddddd",
          fontFamily: "Arial",
        })
        .setOrigin(0.5)
    );

    this.addUI(
      this.add
        .text(x, y + 43, selected ? "SELECTED" : "CLICK TO ADD", {
          fontSize: "13px",
          color: selected ? "#888888" : "#00f5d4",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5)
    );
  }

  createLineupSlot(x, y, index) {
    const card = this.lineup[index];

    this.addUI(this.add.rectangle(x, y, 330, 115, card ? TIER_COLORS[card.tier] : 0x333344));
    const bg = this.addUI(this.add.rectangle(x, y, 320, 105, 0x101020));

    this.addUI(
      this.add
        .text(x - 135, y - 38, `SLOT ${index + 1}`, {
          fontSize: "16px",
          color: "#ffcc4d",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0, 0.5)
    );

    if (!card) {
      this.addUI(
        this.add
          .text(x, y + 5, "Empty", {
            fontSize: "22px",
            color: "#777777",
            fontFamily: "Arial",
            fontStyle: "bold",
          })
          .setOrigin(0.5)
      );

      return;
    }

    bg.setInteractive({ useHandCursor: true });

    bg.on("pointerdown", () => {
      this.lineup.splice(index, 1);
      this.render();
    });

    this.addUI(
      this.add
        .text(x, y - 18, card.name, {
          fontSize: "18px",
          color: "#ffffff",
          fontFamily: "Arial",
          fontStyle: "bold",
          align: "center",
          wordWrap: { width: 280 },
        })
        .setOrigin(0.5)
    );

    this.addUI(
      this.add
        .text(x, y + 14, `${card.tier} | ${card.ovr} OVR | ${card.classType}`, {
          fontSize: "15px",
          color: "#dddddd",
          fontFamily: "Arial",
        })
        .setOrigin(0.5)
    );

    this.addUI(
      this.add
        .text(x, y + 42, "Click to remove", {
          fontSize: "13px",
          color: "#999999",
          fontFamily: "Arial",
        })
        .setOrigin(0.5)
    );
  }

  createMainButton(x, y, width, height, label, active, callback) {
    const button = this.addUI(this.add.rectangle(x, y, width, height, active ? 0xffcc4d : 0x333333));
    button.setInteractive({ useHandCursor: active });

    this.addUI(
      this.add
        .text(x, y, label, {
          fontSize: "22px",
          color: active ? "#000000" : "#888888",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5)
    );

    if (active) {
      button.on("pointerover", () => button.setFillStyle(0xffffff));
      button.on("pointerout", () => button.setFillStyle(0xffcc4d));
      button.on("pointerdown", callback);
    }
  }

  createSmallButton(x, y, width, height, label, callback) {
    const button = this.addUI(this.add.rectangle(x, y, width, height, 0xffffff));
    button.setInteractive({ useHandCursor: true });

    this.addUI(
      this.add
        .text(x, y, label, {
          fontSize: "16px",
          color: "#000000",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5)
    );

    button.on("pointerdown", callback);
  }
}