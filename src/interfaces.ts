// interfaces.ts

export interface Fact {
  output: {
    status: string;
  };
  [key: string]: any;
}

export interface Rule {
  id: string;
  condition: (facts: Fact) => boolean;
  action: (facts: Fact) => Promise<void>;
}

export interface RulesToLoad {
  rules: Rule[];
}

export interface QueueTask {
  facts: Fact;
  ruleId: string;
  callback?: () => Promise<void>;
}

export interface IQueue {
  push(task: QueueTask): void;
}

export interface IRuleEngine {
  loadRules(rulesToLoad: RulesToLoad): void;
  execute(facts: Fact, ruleId: string): Promise<void>;
  pushToQueue(task: QueueTask): void;
}