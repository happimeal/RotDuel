import Phaser from "phaser";
import "./style.css";

const WIDTH = 1100;
const HEIGHT = 740;

const PLAYER_ONE_USERNAME = "You";
const PLAYER_TWO_USERNAME = "Bot_Joined";

const CLASS_COUNTERS = {
  Speed: "Mystic",
  Mystic: "Tank",
  Tank: "Bruiser",
  Bruiser: "Trickster",
  Trickster: "Speed",
};

const TIER_POWER = {
  Bronze: 0,
  Silver: 10,
  Gold: 20,
  Emerald: 30,
  Sapphire: 40,
  Ruby: 50,
  Amethyst: 60,
  Diamond: 70,
  "Pink Diamond": 80,
};

const CLASS_ADVANTAGE_BONUS = 6;

const CLASS_COLORS = {
  Speed: 0x4cc9f0,
  Tank: 0x9b5de5,
  Bruiser: 0xf15bb5,
  Trickster: 0x00f5d4,
  Mystic: 0xfee440,
};

const TIER_COLORS = {
  Bronze: 0xcd7f32,
  Silver: 0xc0c0c0,
  Gold: 0xffd700,
  Emerald: 0x50c878,
  Sapphire: 0x0f52ba,
  Ruby: 0xe0115f,
  Amethyst: 0x9966cc,
  Diamond: 0xb9f2ff,
  "Pink Diamond": 0xff69b4,
};

const PLAYER_INVENTORY = [
  {
    id: "tralalero-bronze",
    name: "Tralalero Tralala",
    tier: "Bronze",
    ovr: 65,
    classType: "Speed",
    hp: 100,
    atk: 26,
    def: 14,
    spd: 35,
    luck: 18,
    aura: 12,
    special: "Shoe Dash",
  },
  {
    id: "bombardiro-bronze",
    name: "Bombardiro Crocodilo",
    tier: "Bronze",
    ovr: 67,
    classType: "Tank",
    hp: 130,
    atk: 30,
    def: 22,
    spd: 12,
    luck: 10,
    aura: 16,
    special: "Bomb Bite",
  },
  {
    id: "sahur-bronze",
    name: "Tung Tung Tung Sahur",
    tier: "Bronze",
    ovr: 64,
    classType: "Trickster",
    hp: 110,
    atk: 23,
    def: 16,
    spd: 23,
    luck: 25,
    aura: 18,
    special: "Drum Stun",
  },
  {
    id: "ballerina-bronze",
    name: "Ballerina Cappuccina",
    tier: "Bronze",
    ovr: 66,
    classType: "Mystic",
    hp: 105,
    atk: 24,
    def: 15,
    spd: 22,
    luck: 20,
    aura: 30,
    special: "Cappuccino Spiral",
  },
  {
    id: "chimpanzini-bronze",
    name: "Chimpanzini Bananini",
    tier: "Bronze",
    ovr: 66,
    classType: "Bruiser",
    hp: 120,
    atk: 29,
    def: 18,
    spd: 18,
    luck: 14,
    aura: 14,
    special: "Banana Smash",
  },
  {
    id: "assassino-bronze",
    name: "Cappuccino Assassino",
    tier: "Bronze",
    ovr: 65,
    classType: "Speed",
    hp: 95,
    atk: 28,
    def: 12,
    spd: 34,
    luck: 24,
    aura: 16,
    special: "Espresso Slice",
  },
];

const BOT_INVENTORY = [
  {
    id: "bot-bombardiro",
    name: "Bombardiro Crocodilo",
    tier: "Bronze",
    ovr: 67,
    classType: "Tank",
    hp: 130,
    atk: 30,
    def: 22,
    spd: 12,
    luck: 10,
    aura: 16,
    special: "Bomb Bite",
  },
  {
    id: "bot-brr",
    name: "Brr Brr Patapim",
    tier: "Bronze",
    ovr: 66,
    classType: "Tank",
    hp: 128,
    atk: 25,
    def: 24,
    spd: 13,
    luck: 12,
    aura: 15,
    special: "Forest Slam",
  },
  {
    id: "bot-lirili",
    name: "Lirili Larila",
    tier: "Bronze",
    ovr: 65,
    classType: "Mystic",
    hp: 104,
    atk: 22,
    def: 15,
    spd: 24,
    luck: 22,
    aura: 31,
    special: "Mirage Pulse",
  },
  {
    id: "bot-frigo",
    name: "Frigo Camelo",
    tier: "Bronze",
    ovr: 64,
    classType: "Mystic",
    hp: 108,
    atk: 21,
    def: 17,
    spd: 19,
    luck: 17,
    aura: 34,
    special: "Frozen Aura",
  },
  {
    id: "bot-bobrito",
    name: "Bobrito Bandito",
    tier: "Bronze",
    ovr: 66,
    classType: "Trickster",
    hp: 106,
    atk: 25,
    def: 15,
    spd: 25,
    luck: 27,
    aura: 18,
    special: "Bandit Feint",
  },
  {
    id: "bot-bombombini",
    name: "Bombombini Gusini",
    tier: "Bronze",
    ovr: 65,
    classType: "Bruiser",
    hp: 118,
    atk: 28,
    def: 17,
    spd: 18,
    luck: 13,
    aura: 15,
    special: "Goose Charge",
  },
];

function cloneCard(card) {
  return { ...card };
}

function hasClassAdvantage(card, enemyCard) {
  return CLASS_COUNTERS[card.classType] === enemyCard.classType;
}

function getClassMessage(cardA, cardB) {
  if (hasClassAdvantage(cardA, cardB)) {
    return `${cardA.classType} beats ${cardB.classType}`;
  }

  if (hasClassAdvantage(cardB, cardA)) {
    return `${cardB.classType} beats ${cardA.classType}`;
  }

  return "No class advantage";
}

function calculateCardScore(card, enemyCard) {
  const tierPower = TIER_POWER[card.tier] ?? 0;
  const ovrPower = card.ovr;
  const classBonus = hasClassAdvantage(card, enemyCard) ? CLASS_ADVANTAGE_BONUS : 0;
  const score = tierPower + ovrPower + classBonus;

  return {
    score,
    tierPower,
    ovrPower,
    classBonus,
  };
}

function resolveRound(playerCard, enemyCard) {
  const playerScore = calculateCardScore(playerCard, enemyCard);
  const enemyScore = calculateCardScore(enemyCard, playerCard);

  let winner = "draw";

  if (playerScore.score > enemyScore.score) {
    winner = "player";
  }

  if (enemyScore.score > playerScore.score) {
    winner = "enemy";
  }

  return {
    playerCard,
    enemyCard,
    playerScore,
    enemyScore,
    winner,
    classMessage: getClassMessage(playerCard, enemyCard),
  };
}

function generateOpponentLineup() {
  return Phaser.Utils.Array.Shuffle([...BOT_INVENTORY])
    .slice(0, 3)
    .map(cloneCard);
}

function resolveMatch(playerLineup, enemyLineup) {
  const rounds = [];
  let playerWins = 0;
  let enemyWins = 0;
  let draws = 0;

  for (let i = 0; i < 3; i++) {
    const round = resolveRound(playerLineup[i], enemyLineup[i]);

    if (round.winner === "player") {
      playerWins++;
    } else if (round.winner === "enemy") {
      enemyWins++;
    } else {
      draws++;
    }

    rounds.push(round);
  }

  let winner = "draw";

  if (playerWins > enemyWins) {
    winner = "player";
  }

  if (enemyWins > playerWins) {
    winner = "enemy";
  }

  return {
    rounds,
    playerWins,
    enemyWins,
    draws,
    winner,
  };
}

class MenuScene extends Phaser.Scene {
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

    this.add
      .text(WIDTH / 2, 480, "Prototype: local bot match, no wallet, no real multiplayer yet", {
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
        fontSize: "26px",
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

class InventoryScene extends Phaser.Scene {
  constructor() {
    super("InventoryScene");
  }

  create() {
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
        .text(WIDTH / 2, 84, "Choose your 3-card lineup in order", {
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
          playerOneUsername: PLAYER_ONE_USERNAME,
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

class WaitingRoomScene extends Phaser.Scene {
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

class DuelScene extends Phaser.Scene {
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

const config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  parent: "app",
  scene: [MenuScene, InventoryScene, WaitingRoomScene, DuelScene],
};

new Phaser.Game(config);