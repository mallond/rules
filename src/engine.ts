// engine.ts
import { Fact, Rule, RulesToLoad, QueueTask } from './interfaces';


class Queue {
  private queue: QueueTask[] = [];
  private running = 0;
  private readonly concurrency: number;
  private readonly processTask: (task: QueueTask) => Promise<void>;

  constructor(concurrency: number, processTask: (task: QueueTask) => Promise<void>) {
    this.concurrency = concurrency;
    this.processTask = processTask;
  }

  public push(task: QueueTask): void {
    this.queue.push(task);
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.running >= this.concurrency || this.queue.length === 0) return;

    this.running++;
    const task = this.queue.shift();
    if (task) {
      try {
        await this.processTask(task);
      } finally {
        this.running--;
        this.processQueue();
      }
    }
  }
}

export class RuleEngine {
  private static readonly STATUS_CONDITION_MET = "Condition-Met";
  private static readonly STATUS_CONDITION_NOT_MET = "Condition-Not-Met";
  private static readonly CONCURRENCY = 2;

  private rules: Rule[] = [];
  private rulesIndex: Map<string, Rule> = new Map();
  private queue: Queue;

  constructor() {
    this.queue = new Queue(RuleEngine.CONCURRENCY, this.runRules.bind(this));
  }

  public loadRules(rulesToLoad: RulesToLoad): void {
    this.rules = rulesToLoad.rules;
    this.rules.forEach((rule) => this.rulesIndex.set(rule.id, rule));
  }

  public async execute(facts: Fact, ruleId: string): Promise<void> {
    try {
      const rule = this.rulesIndex.get(ruleId);
      if (!rule) {
        throw new Error(`Rule with id ${ruleId} not found`);
      }

      if (rule.condition(facts)) {
        await rule.action(facts);
        facts.output.status = RuleEngine.STATUS_CONDITION_MET;
      } else {
        facts.output.status = RuleEngine.STATUS_CONDITION_NOT_MET;
      }
    } catch (error) {
      throw new Error("Error in engine.execute");
    }
  }

  private async runRules(task: QueueTask): Promise<void> {
    try {
      await this.execute(task.facts, task.ruleId);
      if (typeof task.callback === "function") {
        await task.callback();
      }
    } catch (error) {
      console.error("Error running rules:", error);
    }
  }

  public pushToQueue(task: QueueTask): void {
    this.queue.push(task);
  }
}

// Create and export a single instance of RuleEngine
export const engine = new RuleEngine();