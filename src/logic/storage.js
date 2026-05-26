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

  return {
    ...getDefaultProfile(),
    ...JSON.parse(savedProfile),
  };
}

export function saveProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}