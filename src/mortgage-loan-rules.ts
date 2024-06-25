import { Fact, Rule } from './interfaces';

export const rules: Rule[] = [
  {
    id: 'check-credit-score',
    condition: (facts: Fact) => facts.creditScore >= 620,
    action: async (facts: Fact) => {
      facts.creditScoreApproved = true;
      console.log('Credit score check passed');
    }
  },
  {
    id: 'check-income',
    condition: (facts: Fact) => facts.annualIncome >= 30000,
    action: async (facts: Fact) => {
      facts.incomeApproved = true;
      console.log('Income check passed');
    }
  },
  {
    id: 'check-debt-to-income-ratio',
    condition: (facts: Fact) => facts.debtToIncomeRatio <= 0.43,
    action: async (facts: Fact) => {
      facts.debtToIncomeApproved = true;
      console.log('Debt-to-income ratio check passed');
    }
  },
  {
    id: 'check-loan-to-value-ratio',
    condition: (facts: Fact) => facts.loanToValueRatio <= 0.95,
    action: async (facts: Fact) => {
      facts.loanToValueApproved = true;
      console.log('Loan-to-value ratio check passed');
    }
  },
  {
    id: 'check-employment-history',
    condition: (facts: Fact) => facts.employmentYears >= 2,
    action: async (facts: Fact) => {
      facts.employmentApproved = true;
      console.log('Employment history check passed');
    }
  },
  {
    id: 'check-savings',
    condition: (facts: Fact) => facts.savings >= facts.loanAmount * 0.035,
    action: async (facts: Fact) => {
      facts.savingsApproved = true;
      console.log('Savings check passed');
    }
  },
  {
    id: 'determine-mortgage-type',
    condition: (facts: Fact) => 
      facts.creditScoreApproved && 
      facts.incomeApproved && 
      facts.debtToIncomeApproved && 
      facts.loanToValueApproved && 
      facts.employmentApproved && 
      facts.savingsApproved,
    action: async (facts: Fact) => {
      if (facts.creditScore >= 740 && facts.loanToValueRatio <= 0.80) {
        facts.mortgageType = 'Conventional';
        facts.interestRate = 3.0;
      } else if (facts.loanAmount <= 356362) { // 2021 FHA loan limit for low-cost areas
        facts.mortgageType = 'FHA';
        facts.interestRate = 3.25;
      } else if (facts.isVeteran) {
        facts.mortgageType = 'VA';
        facts.interestRate = 2.75;
      } else {
        facts.mortgageType = 'Jumbo';
        facts.interestRate = 3.5;
      }
      facts.mortgageApproved = true;
      console.log(`Approved for ${facts.mortgageType} mortgage at ${facts.interestRate}% interest rate`);
    }
  }
];