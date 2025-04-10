/**
 * 重构前圈复杂度为4
 * @param {*} args
 */
async function codeAnalyze(args) {
  const answer = await inquire.prompt([
    {
      type: "list",
      name: "type",
      message: "请选择要执行代码分析的指标",
      choices: ["代码扫描", "代码复杂度分析", "代码行数检测"],
    },
  ]);
  if (answer.type === "代码扫码") {
    scan(args);
  } else if (answer.type === "代码复杂度分析") {
    codeComplexity(args);
  } else if (answer.type === "代码行数检测") {
    codeLine(args);
  }
}
