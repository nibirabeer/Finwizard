import React, { useState, useEffect } from 'react';
import { auth, db } from '/firebase';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import './WelcomeHeader.css';

const WelcomeHeader = () => {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState('User');
  const [budget, setBudget] = useState('');
  const [savings, setSavings] = useState('');
  const [expenses, setExpenses] = useState('');
  const [income, setIncome] = useState('');
  const [investments, setInvestments] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setFirstName(data.firstName || 'User');
          setBudget(data.budget || '');
          setSavings(data.savings || '');
          setExpenses(data.expenses || '');
          setIncome(data.income || '');
          setInvestments(data.investments || '');
        }
      } else {
        setUser(null);
        setFirstName('User');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (isNaN(budget) || isNaN(savings) || isNaN(expenses) || isNaN(income) || isNaN(investments)) {
      alert("Please enter valid numbers for financial fields.");
      setLoading(false);
      return;
    }
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userData = {
        budget: parseFloat(budget),
        savings: parseFloat(savings),
        expenses: parseFloat(expenses),
        income: parseFloat(income),
        investments: parseFloat(investments),
        firstName,
      };
      const userDocSnap = await getDoc(userDocRef);
      userDocSnap.exists() ? await updateDoc(userDocRef, userData) : await setDoc(userDocRef, userData);
      alert("Your financial data has been saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="welcome-header">
      <div className="welcome-content">
        <h1 className="welcome-title">Welcome, {firstName}!</h1>
        <p className="welcome-subtitle">Manage your finances efficiently by entering your details below.</p>
        <form className="financial-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="income">Income:</label>
            <input type="number" id="income" placeholder="Enter your income" value={income} onChange={(e) => setIncome(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="budget">Budget:</label>
            <input type="number" id="budget" placeholder="Enter your budget" value={budget} onChange={(e) => setBudget(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="savings">Savings:</label>
            <input type="number" id="savings" placeholder="Enter your savings" value={savings} onChange={(e) => setSavings(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="expenses">Expenses:</label>
            <input type="number" id="expenses" placeholder="Enter your expenses" value={expenses} onChange={(e) => setExpenses(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="investments">Investments:</label>
            <input type="number" id="investments" placeholder="Enter your investments" value={investments} onChange={(e) => setInvestments(e.target.value)} required />
          </div>
          <button type="submit" className="submit-button" disabled={loading}>{loading ? "Saving..." : "Submit"}</button>
        </form>
      </div>
    </header>
  );
};

export default WelcomeHeader;