import Phaser from "phaser";

import { WIDTH, TIER_COLORS } from "../data/constants.js";
import { generateOpponentLineup } from "../logic/battleLogic.js";

export default class WaitingRoomScene extends Phaser.Scene {
  constructor() {
    super("WaitingRoomScene");
  }

  init(data) {
    this.playerLineup = data.playerLineup;
    this.enemyLineup = generateOpponentLineup();
    this.playerOneUsername = data.playerOneUsername;
    this.playerTwoUsername = data.playerTwoUsername;
  }

  create() {
    this.cameras.main.setBackgroundColor("#070710");

    this.add
      .text(WIDTH / 2, 70, "MATCH CREATED", {
        fontSize: "52px",
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(WIDTH / 2, 120, `${this.playerOneUsername} created the match`, {
        fontSize: "22px",
        color: "#ffcc4d",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(310, 185, `Player 1: ${this.playerOneUsername}`, {
        fontSize: "26px",
        color: "#ffcc4d",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(790, 185, "Waiting for Player 2...", {
        fontSize: "26px",
        color: "#ffcc4d",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.playerLineup.forEach((card, index) => {
      this.drawSmallCard(310, 265 + index * 125, card, `Slot ${index + 1}`);
    });

    for (let i = 0; i < 3; i++) {
      this.drawHiddenSlot(790, 265 + i * 125, `Enemy Slot ${i + 1}`);
    }

    this.statusText = this.add
      .text(WIDTH / 2, 640, "Waiting for another player to join...", {
        fontSize: "24px",
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.time.delayedCall(1600, () => {
      this.statusText.setText(`${this.playerTwoUsername} joined. Lineups locked.`);
    });

    this.time.delayedCall(3000, () => {
      this.scene.start("DuelScene", {
        playerLineup: this.playerLineup,
        enemyLineup: this.enemyLineup,
        playerOneUsername: this.playerOneUsername,
        playerTwoUsername: this.playerTwoUsername,
      });
    });
  }

  drawSmallCard(x, y, card, label) {
    this.add.rectangle(x, y, 330, 95, TIER_COLORS[card.tier]);
    this.add.rectangle(x, y, 320, 85, 0x101020);

    this.add
      .text(x - 145, y - 28, label, {
        fontSize: "14px",
        color: "#ffcc4d",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0, 0.5);

    this.add
      .text(x, y - 4, card.name, {
        fontSize: "18px",
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
        align: "center",
        wordWrap: { width: 280 },
      })
      .setOrigin(0.5);

    this.add
      .text(x, y + 27, `${card.tier} | ${card.ovr} OVR | ${card.classType}`, {
        fontSize: "15px",
        color: "#dddddd",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);
  }

  drawHiddenSlot(x, y, label) {
    this.add.rectangle(x, y, 330, 95, 0x333344);
    this.add.rectangle(x, y, 320, 85, 0x101020);

    this.add
      .text(x - 145, y - 28, label, {
        fontSize: "14px",
        color: "#ffcc4d",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0, 0.5);

    this.add
      .text(x, y + 5, "Hidden Until Reveal", {
        fontSize: "20px",
        color: "#777777",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
  }
}