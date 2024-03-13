import { statsDir } from "../index.js";
import fs from "fs";

function filereader() {
  const users = JSON.parse(fs.readFileSync(`${statsDir}/usercache.json`));
  for (const user of users) {
    const uuid = user.uuid;
    // check if the user has a stats file
    if (fs.existsSync(`${statsDir}/stats/${uuid}.json`)) {
      var stats = JSON.parse(fs.readFileSync(`${statsDir}/stats/${uuid}.json`));
      // remove the DataVersion key from the stats file
        delete stats.DataVersion;
      // create a new file for the user's stats in the output directory
      // it should keep the same name as the original file
      // but also include the user's name and uuid
        const newFile = `${statsDir}/output/${user.name}_${uuid}.json`;
        // make the output directory if it doesn't exist
        if (!fs.existsSync(`${statsDir}/output`)) {
            fs.mkdirSync(`${statsDir}/output`);
        }
        var data = JSON.stringify(stats, null, 2);
        // add the user's name and uuid to the stats file
        data = data.replace(/^{/, `{"name":"${user.name}","uuid":"${uuid}",`);
        // format the file
        data = data.replace(/"([a-zA-Z0-9_]+)":/g, '\n\t"$1":');

        fs.writeFileSync
        (newFile, data);

        console.log(`File created: ${newFile}`);
    }
  }

}

export default filereader;
