import { engine } from './engine';
import { Fact } from './interfaces';
import { rules } from './mortgage-loan-rules';
import fs from 'fs/promises';
import path from 'path';

async function processMortgageApplications() {
  // Load the rules into the engine
  engine.loadRules({ rules });

  try {
    // Read the JSON file
    const dataPath = path.join(__dirname, 'mortgage-loan-data.json');
    const jsonData = await fs.readFile(dataPath, 'utf-8');
    const applications: Fact[] = JSON.parse(jsonData);

    console.log('Processing mortgage loan applications...\n');

    for (const [index, application] of applications.entries()) {
      console.log(`Processing application ${index + 1}:`);
      
      // Initialize application fields
      application.output = { status: '' };
      application.creditScoreApproved = false;
      application.incomeApproved = false;
      application.debtToIncomeApproved = false;
      application.loanToValueApproved = false;
      application.employmentApproved = false;
      application.savingsApproved = false;
      application.mortgageApproved = false;
      application.mortgageType = '';
      application.interestRate = 0;

      // Process the application
      await processApplication(application);

      console.log(`Application ${index + 1} Result:`);
      console.log(`Mortgage Approved: ${application.mortgageApproved ? 'Yes' : 'No'}`);
      if (application.mortgageApproved) {
        console.log(`Mortgage Type: ${application.mortgageType}`);
        console.log(`Interest Rate: ${application.interestRate}%`);
      }
      console.log('---');
    }

  } catch (error) {
    console.error('Error processing mortgage applications:', error);
  }
}

async function processApplication(application: Fact) {
  const ruleIds = [
    'check-credit-score',
    'check-income',
    'check-debt-to-income-ratio',
    'check-loan-to-value-ratio',
    'check-employment-history',
    'check-savings',
    'determine-mortgage-type'
  ];

  for (const ruleId of ruleIds) {
    await new Promise<void>((resolve) => {
      engine.pushToQueue({
        facts: application,
        ruleId,
        callback: async () => {
          resolve();
        }
      });
    });
  }
}

processMortgageApplications();
