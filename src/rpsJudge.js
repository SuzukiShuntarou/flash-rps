class RpsJudge {
  constructor(currentLevel, currentRule, cpuRps, userRps) {
    this.currentLevel = currentLevel;
    this.currentRule = currentRule;
    this.cpuRps = cpuRps;
    this.userRps = userRps;
  }

  showResult() {
    const results = this.#judgeResults();
    if (results.includes(false)) {
      console.log(
        `失敗！\n今回のルールは${Object.values(this.currentRule)}手を選ぶこと\nCPUの選んだ手は ${Object.values(this.cpuRps)}です。`,
      );
    } else {
      console.log("成功！");
    }
  }

  #judgeResults() {
    switch (Object.keys(this.currentRule)[0]) {
      case "win":
        return this.#judgeRps(this.#winRule);
      case "lose":
        return this.#judgeRps(this.#loseRule);
      case "draw":
        return this.#judgeRps(this.#drawRule);
    }
  }

  #judgeRps(selectedRule) {
    const results = [];

    for (let i = 0; i < this.currentLevel; i++) {
      const result = selectedRule(this.userRps[i], this.cpuRps[i]);
      results.push(result);
    }
    return results;
  }

  #winRule(userRps, cpuRps) {
    return (
      (userRps === "グー" && cpuRps === "チョキ") ||
      (userRps === "パー" && cpuRps === "グー") ||
      (userRps === "チョキ" && cpuRps === "パー")
    );
  }

  #loseRule(userRps, cpuRps) {
    return (
      (userRps === "グー" && cpuRps === "パー") ||
      (userRps === "パー" && cpuRps === "チョキ") ||
      (userRps === "チョキ" && cpuRps === "グー")
    );
  }

  #drawRule(userRps, cpuRps) {
    return userRps === cpuRps;
  }
}

export default RpsJudge;
