import {
  CLASS_COUNTERS,
  TIER_POWER,
  CLASS_ADVANTAGE_BONUS,
} from "../data/constants.js";

import { BOT_INVENTORY } from "../data/cards.js";

export function cloneCard(card) {
  return { ...card };
}

export function hasClassAdvantage(card, enemyCard) {
  return CLASS_COUNTERS[card.classType] === enemyCard.classType;
}

export function getClassMessage(cardA, cardB) {
  if (hasClassAdvantage(cardA, cardB)) {
    return `${cardA.classType} beats ${cardB.classType}`;
  }

  if (hasClassAdvantage(cardB, cardA)) {
    return `${cardB.classType} beats ${cardA.classType}`;
  }

  return "No class advantage";
}

export function calculateCardScore(card, enemyCard) {
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

export function resolveRound(playerCard, enemyCard) {
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

export function shuffleCards(cards) {
  const copiedCards = [...cards];

  for (let i = copiedCards.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [copiedCards[i], copiedCards[randomIndex]] = [copiedCards[randomIndex], copiedCards[i]];
  }

  return copiedCards;
}

export function generateOpponentLineup() {
  return shuffleCards(BOT_INVENTORY).slice(0, 3).map(cloneCard);
}

export function resolveMatch(playerLineup, enemyLineup) {
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