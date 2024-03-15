import { statsDir } from "../index.js";
import fs from "fs";

function filereader() {
  const users = JSON.parse(fs.readFileSync(`${statsDir}/usercache.json`));

  for (const user of users) {
    const uuid = user.uuid;
    if (fs.existsSync(`${statsDir}/stats/${uuid}.json`)) {
      var stats = JSON.parse(fs.readFileSync(`${statsDir}/stats/${uuid}.json`));
      delete stats.DataVersion;
      const newFile = `${statsDir}/output/stats/${uuid}.json`;
      if (!fs.existsSync(`${statsDir}/output/`)) {
        fs.mkdirSync(`${statsDir}/output/`);
        if (!fs.existsSync(`${statsDir}/output/stats/`)) {
          fs.mkdirSync(`${statsDir}/output/stats/`);
        }
      }
      var data = JSON.stringify(stats, null, 2);
      data = data.replace(/^{/, `{"name":"${user.name}","uuid":"${uuid}",`);
      // format the file
      data = data.replace(/"([a-zA-Z0-9_]+)":/g, '\n\t"$1":');

      fs.writeFileSync(newFile, data);

      console.log(`File created: ${newFile}`);
    }
  }
}

export default filereader;
