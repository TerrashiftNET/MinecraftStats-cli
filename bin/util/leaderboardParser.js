import fs from "fs";
import { statsDir } from "../index.js";

function leaderboardParser() {
  for (const file of fs.readdirSync(`./stats`)) {
    const stat = JSON.parse(fs.readFileSync(`./stats/${file}`));
    let id = stat.id;
    let path = stat.reader.path;
    let leaderboard = [];
    let playerFiles = fs.readdirSync(`${statsDir}/output/stats`);

    if (path.length == 2) {
      for (const playerFile of playerFiles) {
        let player = JSON.parse(
          fs.readFileSync(`${statsDir}/output/stats/${playerFile}`)
        );
        let playerID = playerFile.split(".")[0];
        let playerStats = player.stats;

        if (playerStats[path[0]] && playerStats[path[0]][path[1]]) {
          let value = playerStats[path[0]][path[1]];
          leaderboard.push({ id: playerID, value: value });
        }
        // create the leaderboard directory if it doesn't exist
        if (!fs.existsSync(`./data/output/leaderboard`)) {
          fs.mkdirSync(`./data/output/leaderboard`);
        }
        leaderboard.sort((a, b) => b.value - a.value);
        fs.writeFileSync(
          `./data/output/leaderboard/${id}.json`,
          JSON.stringify({ leaderboard })
        );
      }
    } else if (path.length == 1) {
      let path = stat.reader.path;
      let playerFiles = fs.readdirSync(`${statsDir}/output/stats`);
      let leaderboard = [];

      for (const playerFile of playerFiles) {
        let player = JSON.parse(
          fs.readFileSync(`${statsDir}/output/stats/${playerFile}`)
        );
        let playerID = playerFile.split(".")[0];
        let playerStats = player.stats;

        for (const pattern of path) {
          let category = Object.keys(playerStats).filter((key) =>
            new RegExp(pattern).test(key)
          );
          if (category.length > 0) {
            let value = 0;
            for (const key of category) {
              value += Object.values(playerStats[key]).reduce(
                (a, b) => a + b,
                0
              );
            }
            leaderboard.push({ id: playerID, value: value });
          }
        }
      }

      if (!fs.existsSync(`./data/output/leaderboard`)) {
        fs.mkdirSync(`./data/output/leaderboard`);
      }
      leaderboard.sort((a, b) => b.value - a.value);
      fs.writeFileSync(
        `./data/output/leaderboard/${id}.json`,
        JSON.stringify({ leaderboard })
      );
    }
  }
}

export default leaderboardParser;
