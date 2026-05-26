import Phaser from "phaser";

import {
  WIDTH,
  PLAYER_TWO_USERNAME,
  TIER_COLORS,
} from "../data/constants.js";

import { cloneCard } from "../logic/battleLogic.js";

import {
  loadProfile,
  getInventoryItems,
  getOwnedCards,
  openStarterPack,
} from "../logic/storage.js";

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

    this.activeTab = "All";
    this.lineup = [];
    this.message = "";
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

    const ownedCards = getOwnedCards();

    this.addUI(
      this.add
        .text(WIDTH / 2, 38, "INVENTORY", {
          fontSize: "42px",
          color: "#ffffff",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5)
    );

    this.addUI(
      this.add
        .text(WIDTH / 2, 76, `${this.profile.username}'s items`, {
          fontSize: "19px",
          color: "#bbbbbb",
          fontFamily: "Arial",
        })
        .setOrigin(0.5)
    );

    this.createTabs();

    this.addUI(
      this.add
        .text(310, 150, `${this.activeTab}`, {
          fontSize: "25px",
          color: "#ffcc4d",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5)
    );

    this.addUI(
      this.add
        .text(820, 150, "3-Card Lineup", {
          fontSize: "25px",
          color: "#ffcc4d",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5)
    );

    this.drawInventoryItems();

    for (let i = 0; i < 3; i++) {
      this.createLineupSlot(820, 220 + i * 135, i);
    }

    this.addUI(
      this.add
        .text(WIDTH / 2, 640, this.message, {
          fontSize: "18px",
          color: "#ff4d6d",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5)
    );

    const hasCards = ownedCards.length > 0;
    const ready = this.lineup.length === 3;

    this.createMainButton(
      820,
      645,
      330,
      58,
      hasCards ? (ready ? "CREATE MATCH" : "SELECT 3 CARDS") : "SELECT CARDS TO START",
      hasCards && ready,
      () => {
        if (!hasCards) {
          this.message = "Select cards to start";
          this.render();
          return;
        }

        if (!ready) {
          this.message = "Select cards to start";
          this.render();
          return;
        }

        this.scene.start("WaitingRoomScene", {
          playerLineup: this.lineup.map(cloneCard),
          playerOneUsername: this.profile.username,
          playerTwoUsername: PLAYER_TWO_USERNAME,
        });
      }
    );

    this.createSmallButton(95, 42, 120, 42, "BACK", () => {
      this.scene.start("MenuScene");
    });
  }

  createTabs() {
    const tabs = ["All", "Cards", "Packs", "Shards"];

    tabs.forEach((tab, index) => {
      const x = 305 + index * 125;
      const selected = this.activeTab === tab;

      const button = this.addUI(this.add.rectangle(x, 112, 105, 38, selected ? 0xffcc4d : 0x252538));
      button.setInteractive({ useHandCursor: true });

      this.addUI(
        this.add
          .text(x, 112, tab, {
            fontSize: "16px",
            color: selected ? "#000000" : "#ffffff",
            fontFamily: "Arial",
            fontStyle: "bold",
          })
          .setOrigin(0.5)
      );

      button.on("pointerdown", () => {
        this.activeTab = tab;
        this.message = "";
        this.render();
      });
    });
  }

  drawInventoryItems() {
    const items = getInventoryItems(this.activeTab);

    if (items.length === 0) {
      this.addUI(
        this.add
          .text(310, 310, "No items in this section.", {
            fontSize: "22px",
            color: "#777777",
            fontFamily: "Arial",
            fontStyle: "bold",
          })
          .setOrigin(0.5)
      );

      return;
    }

    items.forEach((item, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);

      const x = 185 + col * 250;
      const y = 230 + row * 135;

      if (item.itemType === "card") {
        this.createInventoryCard(x, y, item);
      }

      if (item.itemType === "pack") {
        this.createPackItem(x, y, item);
      }

      if (item.itemType === "shard") {
        this.createShardItem(x, y, item);
      }
    });
  }

  createInventoryCard(x, y, card) {
    const selected = this.lineup.some((item) => item.id === card.id);
    const borderColor = selected ? 0x777777 : TIER_COLORS[card.tier];

    this.addUI(this.add.rectangle(x, y, 220, 120, borderColor));
    const bg = this.addUI(this.add.rectangle(x, y, 210, 110, selected ? 0x202020 : 0x101020));

    if (!selected) {
      bg.setInteractive({ useHandCursor: true });

      bg.on("pointerdown", () => {
        if (this.lineup.length < 3) {
          this.lineup.push(cloneCard(card));
          this.message = "";
          this.render();
        }
      });

      bg.on("pointerover", () => bg.setFillStyle(0x1d1d32));
      bg.on("pointerout", () => bg.setFillStyle(0x101020));
    }

    this.addUI(
      this.add
        .text(x, y - 38, card.name, {
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
        .text(x, y - 8, `${card.tier} | ${card.ovr} OVR`, {
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

  createPackItem(x, y, pack) {
    this.addUI(this.add.rectangle(x, y, 220, 120, 0x9b5de5));
    const bg = this.addUI(this.add.rectangle(x, y, 210, 110, 0x101020));

    bg.setInteractive({ useHandCursor: true });

    bg.on("pointerdown", () => {
      if (pack.id === "starter-pack") {
        const result = openStarterPack();

        this.profile = result.profile;
        this.activeTab = "Cards";
        this.message = result.message;
        this.render();
      }
    });

    bg.on("pointerover", () => bg.setFillStyle(0x1d1d32));
    bg.on("pointerout", () => bg.setFillStyle(0x101020));

    this.addUI(
      this.add
        .text(x, y - 32, pack.name, {
          fontSize: "18px",
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
        .text(x, y + 3, "PACK", {
          fontSize: "15px",
          color: "#ffcc4d",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5)
    );

    this.addUI(
      this.add
        .text(x, y + 35, "CLICK TO OPEN", {
          fontSize: "13px",
          color: "#00f5d4",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5)
    );
  }

  createShardItem(x, y, shard) {
    this.addUI(this.add.rectangle(x, y, 220, 120, 0xcd7f32));
    this.addUI(this.add.rectangle(x, y, 210, 110, 0x101020));

    this.addUI(
      this.add
        .text(x, y - 15, shard.name, {
          fontSize: "18px",
          color: "#ffffff",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5)
    );

    this.addUI(
      this.add
        .text(x, y + 20, `Quantity: ${shard.quantity}`, {
          fontSize: "16px",
          color: "#ffcc4d",
          fontFamily: "Arial",
        })
        .setOrigin(0.5)
    );
  }

  createLineupSlot(x, y, index) {
    const card = this.lineup[index];

    this.addUI(this.add.rectangle(x, y, 330, 105, card ? TIER_COLORS[card.tier] : 0x333344));
    const bg = this.addUI(this.add.rectangle(x, y, 320, 95, 0x101020));

    this.addUI(
      this.add
        .text(x - 135, y - 35, `SLOT ${index + 1}`, {
          fontSize: "15px",
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
            fontSize: "20px",
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
        .text(x, y - 16, card.name, {
          fontSize: "17px",
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
          fontSize: "14px",
          color: "#dddddd",
          fontFamily: "Arial",
        })
        .setOrigin(0.5)
    );

    this.addUI(
      this.add
        .text(x, y + 38, "Click to remove", {
          fontSize: "12px",
          color: "#999999",
          fontFamily: "Arial",
        })
        .setOrigin(0.5)
    );
  }

  createMainButton(x, y, width, height, label, active, callback) {
    const button = this.addUI(this.add.rectangle(x, y, width, height, active ? 0xffcc4d : 0x333333));
    button.setInteractive({ useHandCursor: true });

    this.addUI(
      this.add
        .text(x, y, label, {
          fontSize: "20px",
          color: active ? "#000000" : "#888888",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5)
    );

    button.on("pointerdown", callback);

    if (active) {
      button.on("pointerover", () => button.setFillStyle(0xffffff));
      button.on("pointerout", () => button.setFillStyle(0xffcc4d));
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