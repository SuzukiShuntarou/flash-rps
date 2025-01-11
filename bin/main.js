#!/usr/bin/env node

import RpsCommandLine from "../src/rpscommandline.js";
import RpsJudge from "../src/rpsjudge.js";

class Main {
  async exec() {
    const cli = new RpsCommandLine();
    const currentLevel = await cli.selectLevel();
    const currentRule = await cli.selectRule();
    const cpuRps = await cli.selectCpuRps();
    const userRps = await cli.selectUserRps();

    const judge = new RpsJudge(currentLevel, currentRule, cpuRps, userRps);
    judge.showResult();
  }
}

const main = new Main();
await main.exec();
