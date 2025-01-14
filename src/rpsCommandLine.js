import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import enquirer from "enquirer";

class RpsCommandLine {
  async selectLevel() {
    const response = await enquirer.prompt({
      type: "select",
      name: "level",
      message: "CPUとのフラッシュじゃんけんです。\n 難易度を選択してください。",
      choices: [
        {
          title: "Easy",
          content: "全3問。\n1問当たり3.5秒表示されます。",
          value: 3,
        },
        {
          title: "Normal",
          content: "全5問。\n1問当たり2.1秒表示されます。",
          value: 5,
        },
        {
          title: "Hard",
          content: "全7問。\n1問当たり1.5秒表示されます。",
          value: 7,
        },
      ],
      footer() {
        return `\n${this.focused.content}`;
      },
      result() {
        return this.focused.value;
      },
    });
    return response.level;
  }

  async selectRule() {
    const displayRules = ["勝つ", "負ける", "同じ"];
    const random = Math.floor(Math.random() * 3);
    process.stdout.write(
      `CPUに対して${displayRules[random]}手を選んでください`,
    );

    await this.#wait(2000);
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    const [WIN, LOSE, DRAW] = [0, 1, 2];
    switch (random) {
      case WIN:
        return { win: displayRules[random] };
      case LOSE:
        return { lose: displayRules[random] };
      case DRAW:
        return { draw: displayRules[random] };
    }
  }

  async selectCpuRps(level) {
    const nestedCpuRps = await this.#buildNestedCpuRps();
    const random = Math.floor(Math.random() * 10);

    const cpuSelections = [];
    for (let i = 0; i < level; i++) {
      cpuSelections[i] = nestedCpuRps[random][i];
      process.stdout.write(`${i + 1}回目 CPU: ${nestedCpuRps[random][i]}`);
      await this.#wait(10500 / level);
      console.clear();
    }
    return cpuSelections;
  }

  async #wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async #buildNestedCpuRps() {
    const fileName = fileURLToPath(import.meta.url);
    const dirName = path.dirname(fileName);
    const jsonFilePath = path.join(dirName, "../config/cpurps.json");
    const nestedRps = await fs.readFile(jsonFilePath, "utf-8");
    return JSON.parse(nestedRps);
  }

  async selectUserRps(level) {
    const userSelections = [];
    for (let i = 0; i < level; i++) {
      const response = await enquirer.prompt({
        type: "select",
        name: "rps",
        message: `${i + 1}回目の手を選んでください。`,
        choices: [{ title: "グー" }, { title: "チョキ" }, { title: "パー" }],
      });
      userSelections[i] = response.rps;
    }
    return userSelections;
  }
}

export default RpsCommandLine;
