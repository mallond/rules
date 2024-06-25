import { Fact, Rule, RulesToLoad, QueueTask } from './interfaces';

export const rules: Rule[] = [
  {
    id: 'check-credit-score',
    condition: (facts: Fact) => facts.creditScore >= 700,
    action: async (facts: Fact) => {
      facts.creditScoreApproved = true;
      console.log('Credit score check passed');
    }
  },
  {
    id: 'check-income',
    condition: (facts: Fact) => facts.annualIncome >= 50000,
    action: async (facts: Fact) => {
      facts.incomeApproved = true;
      console.log('Income check passed');
    }
  },
  {
    id: 'check-debt-to-income-ratio',
    condition: (facts: Fact) => facts.debtToIncomeRatio <= 0.4,
    action: async (facts: Fact) => {
      facts.debtToIncomeApproved = true;
      console.log('Debt-to-income ratio check passed');
    }
  },
  {
    id: 'final-approval',
    condition: (facts: Fact) => facts.creditScoreApproved && facts.incomeApproved && facts.debtToIncomeApproved,
    action: async (facts: Fact) => {
      facts.loanApproved = true;
      console.log('Loan approved!');
    }
  }
];