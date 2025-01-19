import enquirer from "enquirer";

class RpsCommandLine {
  static WIN = 0;
  static LOSE = 1;
  static DRAW = 2;
  static DISPLAY_RULES = ["勝つ", "負ける", "同じ"];
  static ROCK = "グー";
  static PAPER = "パー";
  static SCISSORS = "チョキ";

  async startRps() {
    const { questionCount, displayTime } = await this.#selectLevel();
    const currentRule = await this.#selectRule();
    const cpuSelections = await this.#selectCpuRps(questionCount, displayTime);
    const userSelections = await this.#selectUserRps(questionCount);

    this.#showResult(questionCount, currentRule, cpuSelections, userSelections);
  }

  async #selectLevel() {
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

  async #selectRule() {
    console.clear();
    const ruleIndex = Math.floor(Math.random() * 3);
    process.stdout.write(
      `CPUに対して${RpsCommandLine.DISPLAY_RULES[ruleIndex]}手を選んでください`,
    );

    await this.#wait(2000);
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    return ruleIndex;
  }

  async #selectCpuRps(questionCount, displayTime) {
    const RPS = [
      RpsCommandLine.ROCK,
      RpsCommandLine.PAPER,
      RpsCommandLine.SCISSORS,
    ];
    const cpuRpsSelections = [];
    for (let i = 0; i < questionCount; i++) {
      const rpsIndex = Math.floor(Math.random() * 3);
      cpuRpsSelections[i] = RPS[rpsIndex];

      console.clear();
      process.stdout.write(`${i + 1}回目 CPU: ${cpuRpsSelections[i]}`);
      await this.#wait(displayTime);
    }
    console.clear();
    return cpuRpsSelections;
  }

  async #wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async #selectUserRps(questionCount) {
    const userSelections = [];
    for (let i = 0; i < questionCount; i++) {
      const response = await enquirer.prompt({
        type: "select",
        name: "rps",
        message: `${i + 1}回目の手を選んでください。`,
        choices: [
          { title: RpsCommandLine.ROCK },
          { title: RpsCommandLine.PAPER },
          { title: RpsCommandLine.SCISSORS },
        ],
      });
      userSelections[i] = response.rps;
    }
    return userSelections;
  }

  #showResult(questionCount, currentRule, cpuSelections, userSelections) {
    const results = this.#judgeResults(
      questionCount,
      currentRule,
      cpuSelections,
      userSelections,
    );
    if (results.includes(false)) {
      console.log(
        `失敗！\n今回のルールは${RpsCommandLine.DISPLAY_RULES[currentRule]}手を選ぶことです。`,
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
    let rule;
    switch (currentRule) {
      case RpsCommandLine.WIN:
        rule = this.#winRule;
        break;
      case RpsCommandLine.LOSE:
        rule = this.#loseRule;
        break;
      default:
        rule = this.#drawRule;
    }
    for (let i = 0; i < questionCount; i++) {
      results.push(rule(userSelections[i], cpuSelections[i]));
    }
    return results;
  }

  #winRule(userSelection, cpuSelection) {
    return (
      (userSelection === RpsCommandLine.ROCK &&
        cpuSelection === RpsCommandLine.SCISSORS) ||
      (userSelection === RpsCommandLine.PAPER &&
        cpuSelection === RpsCommandLine.ROCK) ||
      (userSelection === RpsCommandLine.SCISSORS &&
        cpuSelection === RpsCommandLine.PAPER)
    );
  }

  #loseRule(userSelection, cpuSelection) {
    return (
      (userSelection === RpsCommandLine.ROCK &&
        cpuSelection === RpsCommandLine.PAPER) ||
      (userSelection === RpsCommandLine.PAPER &&
        cpuSelection === RpsCommandLine.SCISSORS) ||
      (userSelection === RpsCommandLine.SCISSORS &&
        cpuSelection === RpsCommandLine.ROCK)
    );
  }

  #drawRule(userSelection, cpuSelection) {
    return userSelection === cpuSelection;
  }
}

export default RpsCommandLine;
