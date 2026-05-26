import Phaser from "phaser";

import {
  WIDTH,
  TIER_COLORS,
  CLASS_COLORS,
} from "../data/constants.js";

import { resolveMatch } from "../logic/battleLogic.js";

export default class DuelScene extends Phaser.Scene {
  constructor() {
    super("DuelScene");
  }

  init(data) {
    this.playerLineup = data.playerLineup;
    this.enemyLineup = data.enemyLineup;
    this.playerOneUsername = data.playerOneUsername;
    this.playerTwoUsername = data.playerTwoUsername;
    this.match = resolveMatch(this.playerLineup, this.enemyLineup);
    this.currentRound = 0;
    this.displayPlayerWins = 0;
    this.displayEnemyWins = 0;
    this.roundObjects = [];
  }

  create() {
    this.cameras.main.setBackgroundColor("#10101c");

    this.add
      .text(WIDTH / 2, 38, "ROTDUEL", {
        fontSize: "42px",
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(WIDTH / 2, 76, `${this.playerOneUsername} vs ${this.playerTwoUsername}`, {
        fontSize: "22px",
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.scoreText = this.add
      .text(WIDTH / 2, 108, "Best of 3 | Score: 0 - 0", {
        fontSize: "20px",
        color: "#ffcc4d",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(WIDTH / 2, 136, "Player 1 created the match, so Player 1 reveals first every round.", {
        fontSize: "15px",
        color: "#999999",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    this.time.delayedCall(800, () => {
      this.revealRound();
    });
  }

  clearRoundObjects() {
    this.roundObjects.forEach((item) => item.destroy());
    this.roundObjects = [];
  }

  addRoundObject(item) {
    this.roundObjects.push(item);
    return item;
  }

  revealRound() {
    this.clearRoundObjects();

    const round = this.match.rounds[this.currentRound];
    const roundNumber = this.currentRound + 1;

    this.addRoundObject(
      this.add
        .text(WIDTH / 2, 175, `ROUND ${roundNumber}`, {
          fontSize: "38px",
          color: "#ffffff",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5)
    );

    this.createHiddenLargeCard(310, 390, "PLAYER 1", this.playerOneUsername);
    this.createHiddenLargeCard(790, 390, "PLAYER 2", this.playerTwoUsername);

    this.time.delayedCall(900, () => {
      this.showRevealStep(310, 390, round.playerCard.tier, TIER_COLORS[round.playerCard.tier]);
    });

    this.time.delayedCall(2150, () => {
      this.showRevealStep(310, 390, `${round.playerCard.ovr} OVR`, TIER_COLORS[round.playerCard.tier]);
    });

    this.time.delayedCall(3400, () => {
      this.showRevealStep(310, 390, round.playerCard.classType, CLASS_COLORS[round.playerCard.classType]);
    });

    this.time.delayedCall(4650, () => {
      this.createLargeCard(310, 390, round.playerCard, "PLAYER 1", this.playerOneUsername);
    });

    this.time.delayedCall(6100, () => {
      this.showRevealStep(790, 390, round.enemyCard.tier, TIER_COLORS[round.enemyCard.tier]);
    });

    this.time.delayedCall(7350, () => {
      this.showRevealStep(790, 390, `${round.enemyCard.ovr} OVR`, TIER_COLORS[round.enemyCard.tier]);
    });

    this.time.delayedCall(8600, () => {
      this.showRevealStep(790, 390, round.enemyCard.classType, CLASS_COLORS[round.enemyCard.classType]);
    });

    this.time.delayedCall(9850, () => {
      this.createLargeCard(790, 390, round.enemyCard, "PLAYER 2", this.playerTwoUsername);
    });

    this.time.delayedCall(11200, () => {
      this.showRoundResult(round);
    });

    this.time.delayedCall(13900, () => {
      this.currentRound++;

      if (this.currentRound < 3) {
        this.revealRound();
      } else {
        this.showFinalResult();
      }
    });
  }

  createHiddenLargeCard(x, y, playerLabel, username) {
    this.addRoundObject(this.add.rectangle(x, y, 360, 430, 0x333344));
    this.addRoundObject(this.add.rectangle(x, y, 345, 415, 0x080812));

    this.addRoundObject(
      this.add
        .text(x, y - 175, `${playerLabel}: ${username}`, {
          fontSize: "18px",
          color: "#ffcc4d",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5)
    );

    this.addRoundObject(
      this.add
        .text(x, y - 15, "CARD HIDDEN", {
          fontSize: "34px",
          color: "#777777",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5)
    );

    this.addRoundObject(
      this.add
        .text(x, y + 35, "Waiting for reveal...", {
          fontSize: "18px",
          color: "#555555",
          fontFamily: "Arial",
        })
        .setOrigin(0.5)
    );
  }

  showRevealStep(x, y, text, color) {
    const box = this.addRoundObject(this.add.rectangle(x, y, 280, 120, color));
    const label = this.addRoundObject(
      this.add
        .text(x, y, text, {
          fontSize: "38px",
          color: "#000000",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5)
    );

    box.setScale(0.75);
    label.setScale(0.75);

    this.tweens.add({
      targets: [box, label],
      scale: 1,
      duration: 180,
      ease: "Back.Out",
    });
  }

  createLargeCard(x, y, card, playerLabel, username) {
    this.addRoundObject(this.add.rectangle(x, y, 360, 430, TIER_COLORS[card.tier]));
    this.addRoundObject(this.add.rectangle(x, y, 345, 415, 0x0a0a14));

    this.addRoundObject(
      this.add
        .text(x, y - 175, `${playerLabel}: ${username}`, {
          fontSize: "18px",
          color: "#ffcc4d",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5)
    );

    this.addRoundObject(
      this.add
        .text(x, y - 125, card.name, {
          fontSize: "26px",
          color: "#ffffff",
          fontFamily: "Arial",
          fontStyle: "bold",
          align: "center",
          wordWrap: { width: 300 },
        })
        .setOrigin(0.5)
    );

    this.addRoundObject(
      this.add
        .text(x, y - 70, `${card.tier} | ${card.ovr} OVR`, {
          fontSize: "22px",
          color: "#ffcc4d",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5)
    );

    this.addRoundObject(this.add.rectangle(x, y - 25, 170, 34, CLASS_COLORS[card.classType]));

    this.addRoundObject(
      this.add
        .text(x, y - 25, card.classType, {
          fontSize: "18px",
          color: "#000000",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5)
    );

    this.addRoundObject(
      this.add
        .text(x, y + 35, `HP ${card.hp}   ATK ${card.atk}   DEF ${card.def}`, {
          fontSize: "17px",
          color: "#dddddd",
          fontFamily: "Arial",
        })
        .setOrigin(0.5)
    );

    this.addRoundObject(
      this.add
        .text(x, y + 70, `SPD ${card.spd}   LUCK ${card.luck}   AURA ${card.aura}`, {
          fontSize: "17px",
          color: "#dddddd",
          fontFamily: "Arial",
        })
        .setOrigin(0.5)
    );

    this.addRoundObject(
      this.add
        .text(x, y + 125, card.special, {
          fontSize: "21px",
          color: "#ffffff",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5)
    );
  }

  showRoundResult(round) {
    const isDraw = round.winner === "draw";
    const playerWon = round.winner === "player";
    const enemyWon = round.winner === "enemy";

    if (playerWon) {
      this.displayPlayerWins++;
    }

    if (enemyWon) {
      this.displayEnemyWins++;
    }

    this.scoreText.setText(`Best of 3 | Score: ${this.displayPlayerWins} - ${this.displayEnemyWins}`);

    const resultColor = isDraw ? "#ffffff" : playerWon ? "#00f5d4" : "#ff4d6d";

    let resultText = "Round is a draw";
    let detailText = "Both cards finished with the same total score.";

    if (playerWon) {
      resultText = `${this.playerOneUsername} wins Round ${this.currentRound + 1}`;
      detailText = `${round.playerCard.name} beats ${round.enemyCard.name}`;
    }

    if (enemyWon) {
      resultText = `${this.playerTwoUsername} wins Round ${this.currentRound + 1}`;
      detailText = `${round.enemyCard.name} beats ${round.playerCard.name}`;
    }

    this.addRoundObject(this.add.rectangle(WIDTH / 2, 640, 820, 125, 0x05050a));

    this.addRoundObject(
      this.add
        .text(WIDTH / 2, 600, round.classMessage, {
          fontSize: "20px",
          color: "#ffcc4d",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5)
    );

    this.addRoundObject(
      this.add
        .text(WIDTH / 2, 632, resultText, {
          fontSize: "28px",
          color: resultColor,
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5)
    );

    this.addRoundObject(
      this.add
        .text(WIDTH / 2, 663, detailText, {
          fontSize: "17px",
          color: "#dddddd",
          fontFamily: "Arial",
        })
        .setOrigin(0.5)
    );

    this.addRoundObject(
      this.add
        .text(
          WIDTH / 2,
          690,
          `${this.playerOneUsername}: ${round.playerScore.score} = Tier ${round.playerScore.tierPower} + OVR ${round.playerScore.ovrPower} + Class ${round.playerScore.classBonus}  |  ${this.playerTwoUsername}: ${round.enemyScore.score} = Tier ${round.enemyScore.tierPower} + OVR ${round.enemyScore.ovrPower} + Class ${round.enemyScore.classBonus}`,
          {
            fontSize: "14px",
            color: "#aaaaaa",
            fontFamily: "Arial",
          }
        )
        .setOrigin(0.5)
    );
  }

  showFinalResult() {
    this.clearRoundObjects();

    const playerWon = this.match.winner === "player";
    const enemyWon = this.match.winner === "enemy";

    let title = "MATCH DRAW";
    let titleColor = "#ffffff";
    let winnerLine = "No winner. Both players tied.";

    if (playerWon) {
      title = "YOU WIN";
      titleColor = "#00f5d4";
      winnerLine = `${this.playerOneUsername} wins the match`;
    }

    if (enemyWon) {
      title = "YOU LOSE";
      titleColor = "#ff4d6d";
      winnerLine = `${this.playerTwoUsername} wins the match`;
    }

    this.addRoundObject(
      this.add
        .text(WIDTH / 2, 170, title, {
          fontSize: "76px",
          color: titleColor,
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5)
    );

    this.addRoundObject(
      this.add
        .text(WIDTH / 2, 245, winnerLine, {
          fontSize: "30px",
          color: "#ffffff",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5)
    );

    this.addRoundObject(
      this.add
        .text(WIDTH / 2, 295, `Final Score: ${this.match.playerWins} - ${this.match.enemyWins} | Draws: ${this.match.draws}`, {
          fontSize: "32px",
          color: "#ffcc4d",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5)
    );

    let rewardText = "+12 XP   +20 Coins   Draw Bonus";

    if (playerWon) {
      rewardText = "+25 XP   +50 Coins   +1 Bronze Shard";
    }

    if (enemyWon) {
      rewardText = "+8 XP   +10 Coins   +1 Pity Point";
    }

    this.addRoundObject(
      this.add
        .text(WIDTH / 2, 350, rewardText, {
          fontSize: "26px",
          color: "#ffcc4d",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5)
    );

    this.match.rounds.forEach((round, index) => {
      let text = `Round ${index + 1}: ${round.playerCard.name} vs ${round.enemyCard.name} — Draw`;
      let color = "#ffffff";

      if (round.winner === "player") {
        text = `Round ${index + 1}: ${round.playerCard.name} vs ${round.enemyCard.name} — ${this.playerOneUsername} won`;
        color = "#00f5d4";
      }

      if (round.winner === "enemy") {
        text = `Round ${index + 1}: ${round.playerCard.name} vs ${round.enemyCard.name} — ${this.playerTwoUsername} won`;
        color = "#ff4d6d";
      }

      this.addRoundObject(
        this.add
          .text(WIDTH / 2, 430 + index * 35, text, {
            fontSize: "18px",
            color,
            fontFamily: "Arial",
          })
          .setOrigin(0.5)
      );
    });

    this.createFinalButton(WIDTH / 2, 600, 330, 60, "BACK TO INVENTORY", () => {
      this.scene.start("InventoryScene");
    });
  }

  createFinalButton(x, y, width, height, label, callback) {
    const button = this.addRoundObject(this.add.rectangle(x, y, width, height, 0xffcc4d));
    button.setInteractive({ useHandCursor: true });

    this.addRoundObject(
      this.add
        .text(x, y, label, {
          fontSize: "22px",
          color: "#000000",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5)
    );

    button.on("pointerover", () => button.setFillStyle(0xffffff));
    button.on("pointerout", () => button.setFillStyle(0xffcc4d));
    button.on("pointerdown", callback);
  }
}