#!/usr/bin/env node

import RpsCommandLine from "../src/rpsCommandLine.js";

class Main {
  async exec() {
    const cli = new RpsCommandLine();
    const { questionCount, displayTime } = await cli.selectLevel();
    const currentRule = await cli.selectRule();
    const cpuSelections = await cli.selectCpuRps(questionCount, displayTime);
    const userSelections = await cli.selectUserRps(questionCount);

    cli.showResult(questionCount, currentRule, cpuSelections, userSelections);
  }
}

const main = new Main();
await main.exec();
