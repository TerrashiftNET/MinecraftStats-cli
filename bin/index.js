#! /usr/bin/env node
import _yargs from "yargs";
import boxen from "boxen";
import chalk from "chalk";
import { hideBin } from "yargs/helpers";
const yargs = _yargs(hideBin(process.argv));
import fs from "fs";
import filereader from "./util/fileReader.js";
import leaderboardParser from "./util/leaderboardParser.js";

const options = yargs
  .usage("Usage: -c <path to config file>")
  .option("c", { type: "string", demandOption: true })
  .alias("c", "config").argv;

// check if the config file exists
if (!options.config) {
  console.log(chalk.red("Config file not found"));
  process.exit(1);
}
if (!fs.existsSync(options.config)) {
  console.log(chalk.red(`Config file not found at ${options.config}`));
  process.exit(1);
}

// read the config file
let rawConfig = fs.readFileSync(options.config);
let config = JSON.parse(rawConfig);
let statsDir = config.dir;

// check if the stats directory exists
if (!statsDir) {
  console.log(chalk.red("Stats directory not found"));
  process.exit(1);
}
if (!fs.existsSync(statsDir)) {
  console.log(chalk.red(`Stats directory not found at ${statsDir}`));
  process.exit(1);
}

export { statsDir };

console.log(boxen(chalk.green("Stats directory found"), { padding: 1 }));
console.log(boxen(chalk.green("Reading files..."), { padding: 1 }));
filereader();
console.log(boxen(chalk.green("File reading complete"), { padding: 1 }));
console.log(boxen(chalk.green("Parsing leaderboards..."), { padding: 1 }));
leaderboardParser();
console.log(boxen(chalk.green("Leaderboard parsing complete"), { padding: 1 }));
