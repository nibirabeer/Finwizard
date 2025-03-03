import React, { useEffect, useState } from "react";
import { auth, db } from "/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./Dashboard.css";

// Register Chart.js components
Chart.register(...registerables);

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [expenseEmotions, setExpenseEmotions] = useState([
    { expense: 50, emotion: "happy", date: "2025-02-20" },
    { expense: 30, emotion: "stressed", date: "2025-02-21" },
    { expense: 70, emotion: "happy", date: "2025-02-22" },
  ]);

  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY; // OpenAI API key
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserData(currentUser.uid);
      } else {
        setUser(null);
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
        setFirstName(data.firstName || "");
        generateAISuggestion(data); // Generate AI suggestion based on user data
      } else {
        console.warn("No user document found!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const generateAISuggestion = async (data) => {
    const prompt = `User's Financial Data:
    - Income: £${data.income || 0}
    - Expenses: £${data.expenses || 0}
    - Savings: £${data.savings || 0}
    - Net Worth: £${(data.savings || 0) - (data.expenses || 0)}

    Based on this data, provide a brief suggestion to improve the user's financial health.`;

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo", // Use GPT-3.5
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      const suggestion = result.choices[0].message.content;
      setAiSuggestion(suggestion);
    } catch (error) {
      console.error("Error fetching AI suggestion:", error);
      setAiSuggestion("Failed to fetch suggestion. Please try again.");
    }
  };

  const handleChat = async () => {
    if (!userQuery.trim()) return; // Don't send empty messages

    // Add the user's message to the chat history
    setChatHistory((prev) => [...prev, { role: "user", content: userQuery }]);
    setUserQuery(""); // Clear the input field

    try {
      // Send the user's message to OpenAI's GPT
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo", // Use GPT-3.5
          messages: [
            ...chatHistory.map((msg) => ({ role: msg.role, content: msg.content })), // Include chat history for context
            { role: "user", content: userQuery }, // Add the latest user message
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      const aiResponse = result.choices[0].message.content;

      // Add the AI's response to the chat history
      setChatHistory((prev) => [...prev, { role: "ai", content: aiResponse }]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setChatHistory((prev) => [
        ...prev,
        { role: "ai", content: "Failed to fetch response. Please try again." },
      ]);
    }
  };

  if (!userData) {
    return <div className="loading">Loading your dashboard...</div>;
  }

  const netWorth = (userData.savings || 0) - (userData.expenses || 0);
  const totalBudget = (userData.income || 0) + (userData.savings || 0) + (userData.investments || 0);
  const incomePercentage = ((userData.income || 0) / totalBudget) * 100;
  const expensesPercentage = ((userData.expenses || 0) / totalBudget) * 100;
  const savingsPercentage = ((userData.savings || 0) / totalBudget) * 100;
  const investmentsPercentage = ((userData.investments || 0) / totalBudget) * 100;

  const pieData = {
    labels: ["Income", "Expenses", "Savings", "Investments"],
    datasets: [
      {
        data: [userData.income, userData.expenses, userData.savings, userData.investments],
        backgroundColor: ["rgb(255, 95, 31)", "rgb(15, 255, 80)", "rgb(0, 255, 255)", "#CCCCFF"],
      },
    ],
  };

  const emotionSummary = expenseEmotions.reduce((acc, curr) => {
    acc[curr.emotion] = (acc[curr.emotion] || 0) + curr.expense;
    return acc;
  }, {});

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        {/* Back Button */}
        <button
          className="back-button"
          onClick={() => navigate(-1)} // Navigate back to the previous page
          style={{
            position: "absolute",
            left: "80px",
            top: "140px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "24px",
            color: "#ffffff",
          }}
        >
          <img src="public/b.png" alt="Back" className="w-8 h-8" />
          <span>Back</span>
        </button>
        <h1>{firstName}, Here is Your Budget Summary</h1>
      </header>

      <div className="finance-overview">
        <div className="card">
          <h2><img src="public/inc.png" alt="Logo1" /> Income</h2>
          <p>£{userData.income || 0}</p>
        </div>
        <div className="card">
          <h2><img src="public/exp.png" alt="Logo2" /> Expenses</h2>
          <p>£{userData.expenses || 0}</p>
        </div>
        <div className="card">
          <h2><img src="public/sav.png" alt="Logo3" /> Savings</h2>
          <p>£{userData.savings || 0}</p>
        </div>
        <div className="card">
          <h2><img src="public/net.png" alt="Logo4" /> Net Worth</h2>
          <p>£{netWorth}</p>
        </div>
        <div className="card">
          <h2><img src="public/inv.png" alt="Logo5" /> Investments</h2>
          <p>£{userData.investments || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div className="chart-container rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Budget Distribution</h3>
          <Pie data={pieData} />
        </div>
        <div className="chart-container color: bg-black rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Net Worth Status</h3>
          <div className="net-worth-status">
            {netWorth >= 1000 ? (
              <img src="public/Black Girl Love GIF by BDHCollective.gif" alt="High Net Worth" />
            ) : netWorth >= 100 ? (
              <img src="public/Black Girl Queen GIF by BDHCollective.gif" alt="Medium Net Worth" />
            ) : netWorth >= 0 ? (
              <img src="public/Black Girl Slow Clap GIF by BDHCollective.gif" alt="Low Net Worth" />
            ) : netWorth >= -100 ? (
              <img src="public/No Way Queen GIF by BDHCollective.gif" alt="Negative Net Worth" />
            ) : (
              <img src="public/No Way What GIF by BDHCollective.gif" alt="Very Negative Net Worth" />
            )}
          </div>
        </div>
      </div>

      <div className="ai-suggestion rounded-lg shadow-lg p-6 m-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <img src="public/ai.png" alt="Negative Net Worth" className="w-8 h-8 object-contain" />
          <span className="flex items-center">AI Suggestion</span>
        </h3>
        <p className="text-gray-300">{aiSuggestion || "Fetching AI suggestion..."}</p>
      </div>

      <button
        className="chat-toggle"
        onClick={() => setIsChatOpen(!isChatOpen)}
        style={{ display: "flex", alignItems: "center", gap: "8px" }}
      >
        <img src="public/c.png" alt="chat" className="w-7 h-7" />
        <span>Chat</span>
      </button>

      {isChatOpen && (
        <div className="chat-popup">
          <div className="chat-header">
            <h3>Chat</h3>
            <button onClick={() => setIsChatOpen(false)}>✖</button>
          </div>
          <div className="chat-body">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.role === "user" ? "user" : "ai"}`}>
                <p>
                  <strong>{msg.role === "user" ? "You" : "AI"}:</strong> {msg.content}
                </p>
              </div>
            ))}
          </div>
          <div className="chat-footer">
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === "Enter" && handleChat()}
            />
            <button onClick={handleChat}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;