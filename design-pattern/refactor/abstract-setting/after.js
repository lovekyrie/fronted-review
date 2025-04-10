/**
 * 重构后，圈复杂度为1
 通过抽象配置将复杂的逻辑判断进行简化。例如下面的代码，根据用户的选择项执行相应的操作，重构后降低了代码复杂度，
 并且如果之后有新的选项，直接加入配置即可，而不需要再去深入代码逻辑中进行改动：
 */
const ACTIONS = {
  代码扫描: scan,
  代码复杂度分析: codeComplexity,
  代码行数检测: codeLine,
};

async function codeAnalyze(args) {
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "type",
      message: "请选择要执行代码分析的指标？",
      choices: Object.keys(ACTIONS),
    },
  ]);
  ACTIONS[answer.type](args);
}
