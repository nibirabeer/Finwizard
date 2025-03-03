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

  useEffect(() => {
    const fetchBudgetPots = async () => {
      if (user) {
        const monthlyBudgetDoc = await getDoc(doc(db, 'users', user.uid, 'monthlybudget', 'pots'));
        if (monthlyBudgetDoc.exists()) {
          setPots(monthlyBudgetDoc.data().pots || []);
        }
      }
    };
    fetchBudgetPots();
  }, [user]);

  const savePotsToFirebase = async (updatedPots) => {
    if (user) {
      const monthlyBudgetRef = doc(db, 'users', user.uid, 'monthlybudget', 'pots');
      await updateDoc(monthlyBudgetRef, { pots: updatedPots });
    }
  };

  const handleAddPot = () => {
    if (newPotName.trim() && newPotBudget > 0) {
      const newPot = {
        id: Date.now(),
        name: newPotName,
        budget: parseFloat(newPotBudget),
        expenses: parseFloat(newPotExpenses),
      };
      const updatedPots = [...pots, newPot];
      setPots(updatedPots);
      savePotsToFirebase(updatedPots);
      setNewPotName('');
      setNewPotBudget(0);
      setNewPotExpenses(0);
    }
  };

  const handleDeletePot = (id) => {
    const updatedPots = pots.filter((pot) => pot.id !== id);
    setPots(updatedPots);
    savePotsToFirebase(updatedPots);
  };

  const calculateRemainingBudget = (pot) => {
    return pot.budget - pot.expenses;
  };

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
          <option value="$">USD ($)</option>
          <option value="€">EUR (€)</option>
        </select>
      </div>

      <div className="add-pot-section">
      <h2 className="add-pot-title">Add Budget Pot</h2>
        <input type="text" value={newPotName} onChange={(e) => setNewPotName(e.target.value)} placeholder="Pot Name" />
        <input type="number" value={newPotBudget} onChange={(e) => setNewPotBudget(e.target.value)} placeholder="Budget" />
        <input type="number" value={newPotExpenses} onChange={(e) => setNewPotExpenses(e.target.value)} placeholder="Expenses" />
        <button onClick={handleAddPot}>Add Pot</button>
      </div>

      <div className="pots-container">
        {pots.map((pot) => (
          <div key={pot.id} className="pot-card">
            <h3>{pot.name}</h3>
            <p>Budget: {currency}{pot.budget.toFixed(2)}</p>
            <p>Expenses: {currency}{pot.expenses.toFixed(2)}</p>
            <p>Remaining: {currency}{calculateRemainingBudget(pot).toFixed(2)}</p>
            <button onClick={() => handleDeletePot(pot.id)}>Delete</button>
          </div>
        ))}
      </div>

      <div className="chart-container">
        <h2>Budget vs Expenses</h2>
        <Bar data={chartData} />
      </div>
    </div>
  );
};

export default MonthlyBudgetPlanner;
