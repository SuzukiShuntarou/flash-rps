import enquirer from "enquirer";

class RpsCommandLine {
  static WIN = 0;
  static LOSE = 1;
  static DRAW = 2;

  async selectLevel() {
    const response = await enquirer.prompt({
      type: "select",
      name: "level",
      message: "CPUとのフラッシュじゃんけんです。\n 難易度を選択してください。",
      choices: [
        {
          title: "Easy",
          content: "全3問。\n1問当たり4秒表示されます。",
          questionCount: 3,
          displayTime: 4000,
        },
        {
          title: "Normal",
          content: "全5問。\n1問当たり3秒表示されます。",
          questionCount: 5,
          displayTime: 3000,
        },
        {
          title: "Hard",
          content: "全7問。\n1問当たり2秒表示されます。",
          questionCount: 7,
          displayTime: 2000,
        },
      ],
      footer() {
        return `\n${this.focused.content}`;
      },
      result() {
        return {
          questionCount: this.focused.questionCount,
          displayTime: this.focused.displayTime,
        };
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
    switch (ruleIndex) {
      case RpsCommandLine.WIN:
        return { [RpsCommandLine.WIN]: displayRules[ruleIndex] };
      case RpsCommandLine.LOSE:
        return { [RpsCommandLine.LOSE]: displayRules[ruleIndex] };
      case RpsCommandLine.DRAW:
        return { [RpsCommandLine.DRAW]: displayRules[ruleIndex] };
    }
  }

  async selectCpuRps(questionCount, displayTime) {
    const RPS = ["グー", "パー", "チョキ"];
    const cpuRpsSelections = [];
    for (let i = 0; i < questionCount; i++) {
      const rpsIndex = Math.floor(Math.random() * 3);
      cpuRpsSelections[i] = RPS[rpsIndex];
    }
    for (let i = 0; i < questionCount; i++) {
      process.stdout.write(`${i + 1}回目 CPU: ${cpuRpsSelections[i]}`);
      await this.#wait(displayTime);
      console.clear();
    }
    return cpuRpsSelections;
  }

  async #wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async selectUserRps(questionCount) {
    const userSelections = [];
    for (let i = 0; i < questionCount; i++) {
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

  showResult(questionCount, currentRule, cpuSelections, userSelections) {
    const results = this.#judgeResults(
      questionCount,
      currentRule,
      cpuSelections,
      userSelections,
    );
    if (results.includes(false)) {
      console.log(
        `失敗！\n今回のルールは${Object.values(currentRule)}手を選ぶことです。`,
      );
      for (let i = 0; i < questionCount; i++) {
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

  #judgeResults(questionCount, currentRule, cpuSelections, userSelections) {
    const results = [];

    for (let i = 0; i < questionCount; i++) {
      switch (Object.keys(currentRule)[0]) {
        case RpsCommandLine.WIN.toString():
          results.push(this.#winRule(userSelections[i], cpuSelections[i]));
          break;
        case RpsCommandLine.LOSE.toString():
          results.push(this.#loseRule(userSelections[i], cpuSelections[i]));
          break;
        case RpsCommandLine.DRAW.toString():
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
