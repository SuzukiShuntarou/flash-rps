#!/usr/bin/env node

import RpsCommandLine from "../src/rpsCommandLine.js";

class Main {
  async exec() {
    const cli = new RpsCommandLine();
    const currentLevel = await cli.selectLevel();
    const currentRule = await cli.selectRule();
    const cpuRps = await cli.selectCpuRps(currentLevel);
    const userRps = await cli.selectUserRps(currentLevel);

    cli.showResult(currentLevel, currentRule, cpuRps, userRps);
  }
}

const main = new Main();
await main.exec();
