const PROFILE_KEY = "rotduelProfile";

export function getDefaultProfile() {
  return {
    username: "",
    xp: 0,
    coins: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    bronzeShards: 0,
  };
}

export function loadProfile() {
  const savedProfile = localStorage.getItem(PROFILE_KEY);

  if (!savedProfile) {
    return getDefaultProfile();
  }

  try {
    return {
      ...getDefaultProfile(),
      ...JSON.parse(savedProfile),
    };
  } catch {
    return getDefaultProfile();
  }
}

export function saveProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function setUsername(username) {
  const profile = loadProfile();

  const updatedProfile = {
    ...profile,
    username,
  };

  saveProfile(updatedProfile);
  return updatedProfile;
}

export function hasUsername() {
  const profile = loadProfile();
  return Boolean(profile.username);
}

export function applyMatchRewards(matchWinner) {
  const profile = loadProfile();

  let rewardText = "";

  if (matchWinner === "player") {
    profile.wins += 1;
    profile.xp += 25;
    profile.coins += 50;
    profile.bronzeShards += 1;
    rewardText = "+25 XP   +50 Coins   +1 Bronze Shard";
  } else if (matchWinner === "enemy") {
    profile.losses += 1;
    profile.xp += 8;
    profile.coins += 10;
    rewardText = "+8 XP   +10 Coins   +1 Pity Point";
  } else {
    profile.draws += 1;
    profile.xp += 12;
    profile.coins += 20;
    rewardText = "+12 XP   +20 Coins   Draw Bonus";
  }

  saveProfile(profile);

  return {
    profile,
    rewardText,
  };
}

export function resetProfile() {
  const blankProfile = getDefaultProfile();
  saveProfile(blankProfile);
  return blankProfile;
}