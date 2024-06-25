export type Fact = {
  output: {
    status: string;
  };
  [key: string]: any;
};

export type Rule = {
  id: string;
  condition: (facts: Fact) => boolean;
  action: (facts: Fact) => Promise<void>;
};

export type RulesToLoad = {
  rules: Rule[];
};

type QueueTask = {
  facts: Fact;
  ruleId: string;
  callback?: () => Promise<void>;
};

export const engine = (() => {
  "use strict";

  const STATUS_CONDITION_MET = "Condition-Met";
  const STATUS_CONDITION_NOT_MET = "Condition-Not-Met";
  const CONCURRENCY = 2;

  let rules: Rule[] = [];
  let rulesIndex: Map<string, Rule> = new Map();

  const loadRules = (rulesToLoad: RulesToLoad): void => {
    rules = rulesToLoad.rules;
    rules.forEach((rule) => rulesIndex.set(rule.id, rule));
  };

  const execute = async (facts: Fact, ruleId: string): Promise<void> => {
    try {
      const rule = rulesIndex.get(ruleId);
      if (!rule) {
        throw new Error(`Rule with id ${ruleId} not found`);
      }

      if (rule.condition(facts)) {
        await rule.action(facts);
        facts.output.status = STATUS_CONDITION_MET;
      } else {
        facts.output.status = STATUS_CONDITION_NOT_MET;
      }
    } catch (error) {
      throw new Error("Error in engine.execute");
    }
  };

  const runRules = async (task: QueueTask): Promise<void> => {
    try {
      await execute(task.facts, task.ruleId);
      if (typeof task.callback === "function") {
        await task.callback();
      }
    } catch (error) {
      console.error("Error running rules:", error);
    }
  };

  const queue = (() => {
    const queue: QueueTask[] = [];
    let running = 0;

    const processQueue = async (): Promise<void> => {
      if (running >= CONCURRENCY || queue.length === 0) return;

      running++;
      const task = queue.shift();
      if (task) {
        try {
          await runRules(task);
        } finally {
          running--;
          processQueue();
        }
      }
    };

    return {
      push: (task: QueueTask): void => {
        queue.push(task);
        processQueue();
      },
    };
  })();

  return { loadRules, execute, queue };
})();