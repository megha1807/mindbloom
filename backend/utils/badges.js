function getBadges(stats) {

  const badges = [];

    if (stats.sessions >= 1) badges.push("🎯 First Focus Session");
  if (stats.sessions >= 5) badges.push("🔥 Consistent");
  if (stats.sessions >= 20) badges.push("💪 Deep Worker");
  if (stats.goals >= 5) badges.push("🎯 Goal Setter");
  if (stats.streak >= 7) badges.push("🏆 7 Day Streak");
  if (stats.goals >= 10) badges.push("🏆 Goal Master");

  return badges;

}

module.exports = getBadges;