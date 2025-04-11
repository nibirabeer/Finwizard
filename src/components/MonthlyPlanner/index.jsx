import React, { useState, useEffect } from 'react';
import { db } from '/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Bar } from 'react-chartjs-2';
import './MonthlyPlanner.css';

const MonthlyBudgetPlanner = ({ user }) => {
  const [currentDate] = useState(new Date());
  const [pots, setPots] = useState([]);
  const [newPotName, setNewPotName] = useState('');
  const [newPotBudget, setNewPotBudget] = useState(0);
  const [newPotExpenses, setNewPotExpenses] = useState(0);
  const [currency, setCurrency] = useState('$');

  // Debt Payoff Planner State
  const [debts, setDebts] = useState([]);
  const [newDebtName, setNewDebtName] = useState('');
  const [newDebtAmount, setNewDebtAmount] = useState(0);
  const [newDebtInterest, setNewDebtInterest] = useState(0);
  const [newDebtMonthlyPayment, setNewDebtMonthlyPayment] = useState(0);

  // Loan & EMI Calculator State
  const [loanAmount, setLoanAmount] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [loanTenure, setLoanTenure] = useState(0);
  const [emi, setEmi] = useState(0);

  // Fetch pots and debts data from Firestore when the component loads or the user changes
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        // Fetch pots
        const monthlyBudgetDoc = await getDoc(doc(db, 'users', user.uid, 'monthlybudget', 'pots'));
        if (monthlyBudgetDoc.exists()) {
          setPots(monthlyBudgetDoc.data().pots || []);
        } else {
          await updateDoc(doc(db, 'users', user.uid, 'monthlybudget', 'pots'), { pots: [] });
          setPots([]);
        }

        // Fetch debts
        const debtsDoc = await getDoc(doc(db, 'users', user.uid, 'monthlybudget', 'debts'));
        if (debtsDoc.exists()) {
          setDebts(debtsDoc.data().debts || []);
        } else {
          await updateDoc(doc(db, 'users', user.uid, 'monthlybudget', 'debts'), { debts: [] });
          setDebts([]);
        }
      }
    };
    fetchData();
  }, [user]);

  // Save pots or debts data to Firestore
  const saveDataToFirebase = async (collection, data) => {
    if (user) {
      const docRef = doc(db, 'users', user.uid, 'monthlybudget', collection);
      await updateDoc(docRef, { [collection]: data });
    }
  };

  // Add a new pot
  const handleAddPot = async () => {
    if (newPotName.trim() && newPotBudget > 0) {
      const newPot = {
        id: Date.now(),
        name: newPotName,
        budget: parseFloat(newPotBudget),
        expenses: parseFloat(newPotExpenses),
      };
      const updatedPots = [...pots, newPot];
      setPots(updatedPots);
      await saveDataToFirebase('pots', updatedPots);
      setNewPotName('');
      setNewPotBudget(0);
      setNewPotExpenses(0);
    }
  };

  // Delete a pot
  const handleDeletePot = async (id) => {
    const updatedPots = pots.filter((pot) => pot.id !== id);
    setPots(updatedPots);
    await saveDataToFirebase('pots', updatedPots);
  };

  // Add a new debt
  const handleAddDebt = async () => {
    if (newDebtName.trim() && newDebtAmount > 0 && newDebtMonthlyPayment > 0) {
      const newDebt = {
        id: Date.now(),
        name: newDebtName,
        amount: parseFloat(newDebtAmount),
        interest: parseFloat(newDebtInterest),
        monthlyPayment: parseFloat(newDebtMonthlyPayment),
        remainingBalance: parseFloat(newDebtAmount),
      };
      const updatedDebts = [...debts, newDebt];
      setDebts(updatedDebts);
      await saveDataToFirebase('debts', updatedDebts);
      setNewDebtName('');
      setNewDebtAmount(0);
      setNewDebtInterest(0);
      setNewDebtMonthlyPayment(0);
    }
  };

  // Delete a debt
  const handleDeleteDebt = async (id) => {
    const updatedDebts = debts.filter((debt) => debt.id !== id);
    setDebts(updatedDebts);
    await saveDataToFirebase('debts', updatedDebts);
  };

  // Calculate remaining balance for a debt
  const calculateRemainingBalance = (debt) => {
    const interestPerMonth = (debt.interest / 100) / 12;
    const remainingBalance = debt.amount - debt.monthlyPayment;
    return remainingBalance > 0 ? remainingBalance * (1 + interestPerMonth) : 0;
  };

  // Calculate EMI
  const calculateEMI = () => {
    const monthlyInterestRate = (interestRate / 100) / 12;
    const emiValue =
      (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTenure)) /
      (Math.pow(1 + monthlyInterestRate, loanTenure) - 1);
    setEmi(emiValue.toFixed(2));
  };

  // Chart data for pots
  const chartData = {
    labels: pots.map((pot) => pot.name),
    datasets: [
      {
        label: 'Budget',
        data: pots.map((pot) => pot.budget),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Expenses',
        data: pots.map((pot) => pot.expenses),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="monthly-budget-container">
      <h1 className="monthly-title">
        {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
      </h1>

      <div className="currency-selector">
        <label>Currency:</label>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="£">GBP (£)</option>
          <option value="€">EUR (€)</option>
          <option value="$">USD ($)</option>
        </select>
      </div>

      {/* Add Budget Pot Section */}
      <div className="add-pot-section">
        <h2 className="add-pot-title">Add Budget Pot</h2>
        <input
          type="text"
          value={newPotName}
          onChange={(e) => setNewPotName(e.target.value)}
          placeholder="Pot Name"
        />
        <input
          type="number"
          value={newPotBudget}
          onChange={(e) => setNewPotBudget(e.target.value)}
          placeholder="Budget"
        />
        <input
          type="number"
          value={newPotExpenses}
          onChange={(e) => setNewPotExpenses(e.target.value)}
          placeholder="Expenses"
        />
        <button onClick={handleAddPot}>Add Pot</button>
      </div>

      {/* Display Budget Pots */}
      <div className="pots-container">
        {pots.map((pot) => (
          <div key={pot.id} className="pot-card">
            <h3>{pot.name}</h3>
            <p>Budget: {currency}{pot.budget.toFixed(2)}</p>
            <p>Expenses: {currency}{pot.expenses.toFixed(2)}</p>
            <p>Remaining: {currency}{(pot.budget - pot.expenses).toFixed(2)}</p>
            <button onClick={() => handleDeletePot(pot.id)}>Delete</button>
          </div>
        ))}
      </div>

      {/* Debt Payoff Planner Section */}
      <div className="debt-payoff-section">
        <h2>Debt Payoff Planner</h2>
        <input
          type="text"
          value={newDebtName}
          onChange={(e) => setNewDebtName(e.target.value)}
          placeholder="Debt Name"
        />
        <input
          type="number"
          value={newDebtAmount}
          onChange={(e) => setNewDebtAmount(e.target.value)}
          placeholder="Debt Amount"
        />
        <input
          type="number"
          value={newDebtInterest}
          onChange={(e) => setNewDebtInterest(e.target.value)}
          placeholder="Interest Rate (%)"
        />
        <input
          type="number"
          value={newDebtMonthlyPayment}
          onChange={(e) => setNewDebtMonthlyPayment(e.target.value)}
          placeholder="Monthly Payment"
        />
        <button onClick={handleAddDebt}>Add Debt</button>

        {/* Display Debts */}
        {debts.map((debt) => (
          <div key={debt.id} className="debt-card">
            <h3>{debt.name}</h3>
            <p>Amount: {currency}{debt.amount.toFixed(2)}</p>
            <p>Interest: {debt.interest}%</p>
            <p>Monthly Payment: {currency}{debt.monthlyPayment.toFixed(2)}</p>
            <p>Remaining Balance: {currency}{calculateRemainingBalance(debt).toFixed(2)}</p>
            <button onClick={() => handleDeleteDebt(debt.id)}>Delete</button>
          </div>
        ))}
      </div>

      {/* Loan & EMI Calculator Section */}
      <div className="emi-calculator-section">
        <h2>Loan & EMI Calculator</h2>
        <input
          type="number"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
          placeholder="Loan Amount"
        />
        <input
          type="number"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
          placeholder="Interest Rate (%)"
        />
        <input
          type="number"
          value={loanTenure}
          onChange={(e) => setLoanTenure(e.target.value)}
          placeholder="Tenure (Months)"
        />
        <button onClick={calculateEMI}>Calculate EMI</button>
        <p>EMI: {currency}{emi}</p>
      </div>

      {/* Chart Section */}
      <div className="chart-container">
        <h2>Budget vs Expenses</h2>
        <Bar data={chartData} />
      </div>
    </div>
  );
};

export default MonthlyBudgetPlanner;