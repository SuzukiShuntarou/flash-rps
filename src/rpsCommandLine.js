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
    const ruleIndex = Math.floor(Math.random() * 3);
    process.stdout.write(
      `CPUに対して${displayRules[ruleIndex]}手を選んでください`,
    );

    await this.#wait(2000);
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    const [WIN, LOSE, DRAW] = [0, 1, 2];
    switch (ruleIndex) {
      case WIN:
        return { win: displayRules[ruleIndex] };
      case LOSE:
        return { lose: displayRules[ruleIndex] };
      case DRAW:
        return { draw: displayRules[ruleIndex] };
    }
  }

  async selectCpuRps(level) {
    const nestedCpuRps = await this.#buildNestedCpuRps();
    const cpuRpsIndex = Math.floor(Math.random() * 10);

    const cpuSelections = [];
    for (let i = 0; i < level; i++) {
      cpuSelections[i] = nestedCpuRps[cpuRpsIndex][i];
      process.stdout.write(`${i + 1}回目 CPU: ${nestedCpuRps[cpuRpsIndex][i]}`);
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

  showResult(currentLevel, currentRule, cpuSelections, userSelections) {
    const results = this.#judgeResults(
      currentLevel,
      currentRule,
      cpuSelections,
      userSelections,
    );
    if (results.includes(false)) {
      console.log(
        `失敗！\n今回のルールは${Object.values(currentRule)}手を選ぶことです。`,
      );
      for (let i = 0; i < currentLevel; i++) {
        if (results[i]) {
          console.log(`${i + 1}回目：正解！`);
        } else {
          console.log(
            `${i + 1}回目：不正解！CPUの選んだ手は${cpuSelections[i]}`,
          );
        }
      }
    } else {
      console.log("成功！");
    }
  }

  #judgeResults(currentLevel, currentRule, cpuSelections, userSelections) {
    const results = [];

    for (let i = 0; i < currentLevel; i++) {
      switch (Object.keys(currentRule)[0]) {
        case "win":
          results.push(this.#winRule(userSelections[i], cpuSelections[i]));
          break;
        case "lose":
          results.push(this.#loseRule(userSelections[i], cpuSelections[i]));
          break;
        case "draw":
          results.push(this.#drawRule(userSelections[i], cpuSelections[i]));
          break;
      }
    }
    return results;
  }

  #winRule(userSelection, cpuSelection) {
    return (
      (userSelection === "グー" && cpuSelection === "チョキ") ||
      (userSelection === "パー" && cpuSelection === "グー") ||
      (userSelection === "チョキ" && cpuSelection === "パー")
    );
  }

  #loseRule(userSelection, cpuSelection) {
    return (
      (userSelection === "グー" && cpuSelection === "パー") ||
      (userSelection === "パー" && cpuSelection === "チョキ") ||
      (userSelection === "チョキ" && cpuSelection === "グー")
    );
  }

  #drawRule(userSelection, cpuSelection) {
    return userSelection === cpuSelection;
  }
}

export default RpsCommandLine;
