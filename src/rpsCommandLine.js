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
    const rule = { 0: "勝つ", 1: "負ける", 2: "同じ" };
    const random = Math.floor(Math.random() * 3);
    process.stdout.write(`CPUに対して${rule[random]}手を選んでください`);

    await this.#wait(2000);
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    return rule[random];
  }

  async selectCpuRps(level) {
    const rpsJson = await this.#buildCpuRpsJson();
    const random = Math.floor(Math.random() * 10);

    let cpuRPS = {};
    for (let i = 0; i < level; i++) {
      cpuRPS[i] = rpsJson[random][i];
      process.stdout.write(`${i + 1}回目 CPU: ${rpsJson[random][i]}`);
      await this.#wait(10500 / level);
      console.clear();
    }
    return cpuRPS;
  }

  async #wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async #buildCpuRpsJson() {
    const fileName = fileURLToPath(import.meta.url);
    const dirName = path.dirname(fileName);
    const jsonFilePath = path.join(dirName, "../config/cpurps.json");
    const rps = await fs.readFile(jsonFilePath, "utf-8");
    return JSON.parse(rps);
  }

  async selectUserRps(level) {
    let userSelected = {};
    for (let i = 0; i < level; i++) {
      const response = await enquirer.prompt({
        type: "select",
        name: "rps",
        message: `${i + 1}回目の手を選んでください。`,
        choices: [{ title: "グー" }, { title: "チョキ" }, { title: "パー" }],
      });
      userSelected[i] = response.rps;
    }
    return userSelected;
  }
}

export default RpsCommandLine;
