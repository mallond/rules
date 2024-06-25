import { engine, Fact } from './engine';
import { rules } from './ruleset-demo-002-rules';
import fs from 'fs/promises';
import path from 'path';

async function processLoanApplications() {
  // Load the rules into the engine
  engine.loadRules({ rules });

  try {
    // Read the JSON file
    const dataPath = path.join(__dirname, 'ruleset-demo-002-data.json');
    const jsonData = await fs.readFile(dataPath, 'utf-8');
    const applications: Fact[] = JSON.parse(jsonData);

    console.log('Processing loan applications...\n');

    for (const [index, application] of applications.entries()) {
      console.log(`Processing application ${index + 1}:`);
      
      // Ensure the application has the required fields
      application.output = { status: '' };
      application.creditScoreApproved = false;
      application.incomeApproved = false;
      application.debtToIncomeApproved = false;
      application.loanApproved = false;

      // Process the application
      await engine.queue.push({ facts: application, ruleId: 'check-credit-score' });
      await engine.queue.push({ facts: application, ruleId: 'check-income' });
      await engine.queue.push({ facts: application, ruleId: 'check-debt-to-income-ratio' });
      await engine.queue.push({ facts: application, ruleId: 'final-approval' });

      console.log(`Application ${index + 1} Result:`);
      console.log(`Loan Approved: ${application.loanApproved ? 'Yes' : 'No'}`);
      console.log('---');
    }

  } catch (error) {
    console.error('Error processing loan applications:', error);
  }
}

processLoanApplications();