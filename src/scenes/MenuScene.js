import Phaser from "phaser";
import { WIDTH, HEIGHT } from "../data/constants.js";
import { loadProfile, playerHasCards } from "../logic/storage.js";

const LEFT_CHAT_WIDTH = 245;

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

    this.activeBattleTab = "ALL BATTLES";
    this.lobbyMessage = "";
    this.ui = [];

    this.chatMessages = [
      { user: "Nettikun 👑", text: "Got some fun ideas coming like 2v2s", color: "#8b8cff" },
      { user: "Pokefan202", text: "🔥🔥", color: "#ffcc4d" },
      { user: "Nettikun 👑", text: "Join the discord if you feeling keen for updates", color: "#8b8cff" },
      { user: "GeorgeFloyd", text: "RotDuel meta is early", color: "#ff4d6d" },
      { user: "GeorgeFloyd", text: "Starter pack first then battle", color: "#ff4d6d" },
      { user: "Nettikun 👑", text: "Gm gm", color: "#8b8cff" },
    ];

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

    this.cameras.main.setBackgroundColor("#05050a");

    this.drawGlobalChat();
    this.drawHeader();
    this.drawLiveTicker();
    this.drawBattleTabs();
    this.drawBattleList();
  }

  drawGlobalChat() {
    this.addUI(this.add.rectangle(LEFT_CHAT_WIDTH / 2, HEIGHT / 2, LEFT_CHAT_WIDTH, HEIGHT, 0x090914));
    this.addUI(this.add.line(LEFT_CHAT_WIDTH, HEIGHT / 2, 0, -HEIGHT / 2, 0, HEIGHT / 2, 0x1d1d2e));

    this.addUI(
      this.add.text(20, 22, "●  4 ONLINE", {
        fontSize: "17px",
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
      }).setOrigin(0, 0.5)
    );

    this.addUI(
      this.add.text(LEFT_CHAT_WIDTH / 2, 76, "ROTDUEL", {
        fontSize: "30px",
        color: "#ffcc4d",
        fontFamily: "Arial",
        fontStyle: "bold",
      }).setOrigin(0.5)
    );

    this.addUI(
      this.add.text(LEFT_CHAT_WIDTH / 2, 110, "GLOBAL CHAT", {
        fontSize: "14px",
        color: "#8d8da8",
        fontFamily: "Arial",
        fontStyle: "bold",
      }).setOrigin(0.5)
    );

    let y = 155;

    this.chatMessages.forEach((message) => {
      this.addUI(
        this.add.text(42, y, message.user, {
          fontSize: "15px",
          color: message.color,
          fontFamily: "Arial",
          fontStyle: "bold",
        }).setOrigin(0, 0.5)
      );

      this.addUI(
        this.add.text(50, y + 25, message.text, {
          fontSize: "14px",
          color: "#ffffff",
          fontFamily: "Arial",
          backgroundColor: "#171724",
          padding: { left: 8, right: 8, top: 5, bottom: 5 },
          wordWrap: { width: 165 },
        }).setOrigin(0, 0.5)
      );

      y += 72;
    });

    this.addUI(this.add.rectangle(LEFT_CHAT_WIDTH / 2, HEIGHT - 42, LEFT_CHAT_WIDTH, 64, 0x070710));

    const chatButton = this.addUI(this.add.rectangle(LEFT_CHAT_WIDTH / 2, HEIGHT - 42, 180, 36, 0x171724));
    chatButton.setInteractive({ useHandCursor: true });

    this.addUI(
      this.add.text(LEFT_CHAT_WIDTH / 2, HEIGHT - 42, "SEND CHAT", {
        fontSize: "14px",
        color: "#8d8da8",
        fontFamily: "Arial",
        fontStyle: "bold",
      }).setOrigin(0.5)
    );

    chatButton.on("pointerdown", () => {
      const text = window.prompt("Type a global chat message:");

      if (!text || !text.trim()) return;

      this.chatMessages.push({
        user: this.profile.username,
        text: text.trim().slice(0, 70),
        color: "#00f5d4",
      });

      this.chatMessages = this.chatMessages.slice(-7);
      this.render();
    });
  }

  drawHeader() {
    this.addUI(this.add.rectangle(LEFT_CHAT_WIDTH + (WIDTH - LEFT_CHAT_WIDTH) / 2, 36, WIDTH - LEFT_CHAT_WIDTH, 72, 0x090914));
    this.addUI(this.add.line(LEFT_CHAT_WIDTH + (WIDTH - LEFT_CHAT_WIDTH) / 2, 72, -((WIDTH - LEFT_CHAT_WIDTH) / 2), 0, (WIDTH - LEFT_CHAT_WIDTH) / 2, 0, 0x1d1d2e));

    const navItems = [
      { label: "⚔ DUELS", scene: null },
      { label: "🎒 INVENTORY", scene: "InventoryScene" },
      { label: "🎁 REWARDS", scene: null },
      { label: "? HOW IT WORKS", scene: null },
      { label: "👤 PROFILE", scene: "ProfileScene" },
    ];

    navItems.forEach((item, index) => {
      const x = LEFT_CHAT_WIDTH + 70 + index * 125;
      const selected = index === 0;

      const text = this.addUI(
        this.add.text(x, 36, item.label, {
          fontSize: "15px",
          color: selected ? "#c67cff" : "#8d8da8",
          fontFamily: "Arial",
          fontStyle: "bold",
        }).setOrigin(0, 0.5)
      );

      text.setInteractive({ useHandCursor: true });

      text.on("pointerdown", () => {
        if (item.scene) this.scene.start(item.scene);
      });

      if (selected) {
        this.addUI(this.add.rectangle(x + 38, 69, 90, 3, 0xc67cff));
      }
    });

    this.addUI(
      this.add.text(WIDTH - 250, 36, this.profile.username, {
        fontSize: "15px",
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
      }).setOrigin(0.5)
    );

    const createButton = this.addUI(this.add.rectangle(WIDTH - 92, 36, 150, 44, 0x38c76b));
    createButton.setInteractive({ useHandCursor: true });

    this.addUI(
      this.add.text(WIDTH - 92, 36, "⚔ CREATE BATTLE", {
        fontSize: "14px",
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
      }).setOrigin(0.5)
    );

    createButton.on("pointerover", () => createButton.setFillStyle(0x4ee07c));
    createButton.on("pointerout", () => createButton.setFillStyle(0x38c76b));

    createButton.on("pointerdown", () => {
      if (!playerHasCards()) {
        this.lobbyMessage = "Select cards to start";
        this.render();
        return;
      }

      this.scene.start("InventoryScene");
    });
  }

  drawLiveTicker() {
    const x = LEFT_CHAT_WIDTH + 20;
    const y = 93;
    const w = WIDTH - LEFT_CHAT_WIDTH - 40;

    this.addUI(this.add.rectangle(x + w / 2, y + 56, w, 112, 0x080812));
    this.addUI(this.add.rectangle(x + w / 2, y + 56, w - 2, 110, 0x0e0e1c));

    this.addUI(this.add.rectangle(x + 45, y + 56, 66, 32, 0x163d24));

    this.addUI(
      this.add.text(x + 45, y + 56, "● LIVE", {
        fontSize: "13px",
        color: "#5bff7a",
        fontFamily: "Arial",
        fontStyle: "bold",
      }).setOrigin(0.5)
    );

    const liveCards = [
      { name: "Bronze Tralalero", price: "$29.00" },
      { name: "Ruby Crocodilo", price: "$120.00" },
      { name: "Mystic Cappuccina", price: "$78.00" },
      { name: "Tank Patapim", price: "$101.00" },
    ];

    liveCards.forEach((card, index) => {
      const cardX = x + 150 + index * 165;

      this.addUI(this.add.rectangle(cardX, y + 56, 150, 72, 0x1c1c24));
      this.addUI(this.add.rectangle(cardX - 47, y + 56, 48, 56, 0x2b2b3d));

      this.addUI(
        this.add.text(cardX - 47, y + 56, "CARD", {
          fontSize: "10px",
          color: "#ffcc4d",
          fontFamily: "Arial",
          fontStyle: "bold",
        }).setOrigin(0.5)
      );

      this.addUI(
        this.add.text(cardX - 10, y + 44, card.name, {
          fontSize: "12px",
          color: "#ffffff",
          fontFamily: "Arial",
          fontStyle: "bold",
          wordWrap: { width: 85 },
        }).setOrigin(0, 0.5)
      );

      this.addUI(
        this.add.text(cardX - 10, y + 70, card.price, {
          fontSize: "13px",
          color: "#5bff7a",
          fontFamily: "Arial",
          fontStyle: "bold",
        }).setOrigin(0, 0.5)
      );
    });
  }

  drawBattleTabs() {
    const startX = LEFT_CHAT_WIDTH + 38;
    const y = 225;

    const tabs = ["ALL BATTLES", "READY TO JOIN", "ONGOING", "RECENT"];

    tabs.forEach((tab, index) => {
      const x = startX + index * 145;
      const selected = this.activeBattleTab === tab;

      const tabText = this.addUI(
        this.add.text(x, y, tab, {
          fontSize: "15px",
          color: selected ? "#ffffff" : "#8d8da8",
          fontFamily: "Arial",
          fontStyle: "bold",
        }).setOrigin(0, 0.5)
      );

      tabText.setInteractive({ useHandCursor: true });

      tabText.on("pointerdown", () => {
        this.activeBattleTab = tab;
        this.lobbyMessage = "";
        this.render();
      });

      if (selected) {
        this.addUI(this.add.rectangle(x + 45, y + 27, 95, 3, 0xc67cff));
      }
    });

    this.addUI(
      this.add.text(WIDTH - 150, y, "SORT: Newest first", {
        fontSize: "14px",
        color: "#bbbbbb",
        fontFamily: "Arial",
        backgroundColor: "#171724",
        padding: { left: 12, right: 12, top: 8, bottom: 8 },
      }).setOrigin(0.5)
    );

    this.addUI(
      this.add.text(LEFT_CHAT_WIDTH + 420, y, "1", {
        fontSize: "12px",
        color: "#5bff7a",
        fontFamily: "Arial",
        fontStyle: "bold",
        backgroundColor: "#163d24",
        padding: { left: 7, right: 7, top: 3, bottom: 3 },
      }).setOrigin(0.5)
    );
  }

  getBattlesForTab() {
    const battles = [
      {
        type: "ready",
        id: 1,
        entry: "FREE",
        title: "Starter Rotmon",
        status: "Waiting for 1 player",
        creator: this.profile.username,
        button: "JOIN",
      },
      {
        type: "ongoing",
        id: 2,
        entry: "FREE",
        title: "Bronze Duel",
        status: "Ongoing: Round 2",
        creator: "Nettikun",
        button: "WATCH",
      },
      {
        type: "recent",
        id: 3,
        entry: "FREE",
        title: "Bronze Duel",
        status: "Finished: 2 - 1",
        creator: "GeorgeFloyd",
        button: "RESULT",
      },
    ];

    if (this.activeBattleTab === "READY TO JOIN") {
      return battles.filter((battle) => battle.type === "ready");
    }

    if (this.activeBattleTab === "ONGOING") {
      return battles.filter((battle) => battle.type === "ongoing");
    }

    if (this.activeBattleTab === "RECENT") {
      return battles.filter((battle) => battle.type === "recent");
    }

    return battles;
  }

  drawBattleList() {
    const battles = this.getBattlesForTab();

    const x = LEFT_CHAT_WIDTH + 20;
    let y = 285;
    const w = WIDTH - LEFT_CHAT_WIDTH - 40;

    this.addUI(
      this.add.text(LEFT_CHAT_WIDTH + 35, 260, this.lobbyMessage, {
        fontSize: "17px",
        color: "#ff4d6d",
        fontFamily: "Arial",
        fontStyle: "bold",
      }).setOrigin(0, 0.5)
    );

    if (battles.length === 0) {
      this.addUI(
        this.add.text(x + w / 2, 380, "No battles in this section.", {
          fontSize: "24px",
          color: "#777777",
          fontFamily: "Arial",
          fontStyle: "bold",
        }).setOrigin(0.5)
      );

      return;
    }

    battles.forEach((battle) => {
      this.drawBattleCard(x, y, w, battle);
      y += 150;
    });
  }

  drawBattleCard(x, y, w, battle) {
    this.addUI(this.add.rectangle(x + w / 2, y + 72, w, 132, 0x17172a));
    this.addUI(this.add.rectangle(x + w / 2, y + 72, w - 2, 130, 0x111122));

    const statusColor =
      battle.type === "ready" ? "#5bff7a" : battle.type === "ongoing" ? "#ffcc4d" : "#8d8da8";

    this.addUI(
      this.add.text(x + 25, y + 28, `📦  ${battle.id}   ${battle.entry}`, {
        fontSize: "21px",
        color: "#5bff7a",
        fontFamily: "Arial",
        fontStyle: "bold",
      }).setOrigin(0, 0.5)
    );

    this.addUI(
      this.add.text(x + 160, y + 30, battle.title, {
        fontSize: "15px",
        color: "#8d8da8",
        fontFamily: "Arial",
      }).setOrigin(0, 0.5)
    );

    this.addUI(this.add.rectangle(x + 85, y + 80, 70, 70, 0x2c2c4a));

    this.addUI(
      this.add.text(x + 85, y + 80, "PACK", {
        fontSize: "13px",
        color: "#ffcc4d",
        fontFamily: "Arial",
        fontStyle: "bold",
      }).setOrigin(0.5)
    );

    this.addUI(this.add.rectangle(x + 145 + (w - 340) / 2, y + 80, w - 340, 80, 0x080812));

    this.addUI(
      this.add.text(x + w - 155, y + 34, `•••  ${battle.status}`, {
        fontSize: "15px",
        color: statusColor,
        fontFamily: "Arial",
        fontStyle: "bold",
      }).setOrigin(0.5)
    );

    this.addUI(this.add.circle(x + w - 115, y + 78, 22, 0x9b5de5));

    this.addUI(
      this.add.text(x + w - 115, y + 78, "P1", {
        fontSize: "12px",
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
      }).setOrigin(0.5)
    );

    this.addUI(
      this.add.text(x + w - 80, y + 78, "vs", {
        fontSize: "14px",
        color: "#c67cff",
        fontFamily: "Arial",
        fontStyle: "bold",
      }).setOrigin(0.5)
    );

    this.addUI(this.add.circle(x + w - 45, y + 78, 22, 0x232338));

    this.addUI(
      this.add.text(x + w - 45, y + 78, battle.type === "ready" ? "?" : "P2", {
        fontSize: "18px",
        color: "#777777",
        fontFamily: "Arial",
        fontStyle: "bold",
      }).setOrigin(0.5)
    );

    const buttonColor = battle.type === "ready" ? 0x38c76b : 0x252538;
    const actionButton = this.addUI(this.add.rectangle(x + w - 85, y + 118, 130, 40, buttonColor));
    actionButton.setInteractive({ useHandCursor: true });

    this.addUI(
      this.add.text(x + w - 85, y + 118, battle.button, {
        fontSize: "14px",
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
      }).setOrigin(0.5)
    );

    actionButton.on("pointerdown", () => {
      if (!playerHasCards()) {
        this.lobbyMessage = "Select cards to start";
        this.render();
        return;
      }

      if (battle.type === "ready") {
        this.scene.start("InventoryScene");
      }
    });
  }
}