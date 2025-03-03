import React, { useState, useEffect } from 'react';
import './LoginModal.css';
import { auth, db } from '/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

function LoginModal({ onClose, mode }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  useEffect(() => {
    if (mode === 'signup') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }

    const savedUser = JSON.parse(localStorage.getItem("rememberedUser"));
    if (savedUser) {
      setEmail(savedUser.email);
      setPassword(savedUser.password);
      setRememberMe(true);
    }
  }, [mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isForgotPassword) {
        await sendPasswordResetEmail(auth, email);
        alert('Password reset link sent to your email!');
      } else if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        alert('Logged in successfully!');

        if (rememberMe) {
          localStorage.setItem("rememberedUser", JSON.stringify({ email, password }));
        } else {
          localStorage.removeItem("rememberedUser");
        }

        onClose();
      } else {
        if (password !== confirmPassword) {
          alert('Passwords do not match!');
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, 'users', user.uid), {
          firstName,
          lastName,
          email: user.email,
          dob,
          gender,
          plan: selectedPlan,
          createdAt: new Date(),
          savings: 0,
          expenses: 0,
          profilePicture: "",
        });

        if (selectedPlan === 'premium') {
          alert('Payment processed successfully!');
        }

        alert('Signed up successfully!');
        onClose();
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const fullName = user.displayName || "";
      const nameParts = fullName.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        const dob = prompt("Enter your Date of Birth (YYYY-MM-DD):", "");
        const gender = prompt("Enter your Gender (Male/Female/Other):", "");

        await setDoc(userRef, {
          firstName,
          lastName,
          email: user.email,
          dob: dob || "Not provided",
          gender: gender || "Not specified",
          createdAt: new Date(),
          profilePicture: user.photoURL || "",
          savings: 0,
          expenses: 0,
          plan: 'free',
        });
      }

      alert("Signed in with Google successfully!");
      onClose();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="text-xl mb-4">
          {isForgotPassword ? 'Reset Password' : isLogin ? 'Login' : 'Sign Up'}
        </h2>
        <form onSubmit={handleSubmit}>
          {!isForgotPassword && (
            <>
              {!isLogin && (
                <>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="First Name"
                      className="form-input"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="form-input"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="date"
                      className="form-input"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <select
                      className="form-input"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group1">
                    <label>Choose Plan:</label>
                    <div className="plan-options">
                      <div
                        className={`plan-card ${selectedPlan === 'free' ? 'selected' : ''}`}
                        onClick={() => setSelectedPlan('free')}
                      >
                        <h3>Free Plan</h3>
                        <p>Basic features for free</p>
                        <div className="price">£0 <small>/month</small></div>
                      </div>
                      <div
                        className={`plan-card ${selectedPlan === 'premium' ? 'selected' : ''}`}
                        onClick={() => setSelectedPlan('premium')}
                      >
                        <h3>Premium Plan</h3>
                        <p>Access to all features</p>
                        <div className="price">£9 <small>/month</small></div>
                      </div>
                    </div>
                  </div>
                  {selectedPlan === 'premium' && (
                    <div className="payment-details">
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Card Number"
                          className="form-input"
                          value={cardDetails.cardNumber}
                          onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Expiry Date (MM/YY)"
                          className="form-input"
                          value={cardDetails.expiryDate}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="CVV"
                          className="form-input"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {!isLogin && (
                <div className="form-group">
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="form-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              )}
              {isLogin && (
                <div className="remember-me-container">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label htmlFor="rememberMe">Remember Me</label>
                </div>
              )}
            </>
          )}
          <button type="submit" className="submit-button">
            {isForgotPassword ? 'Reset Password' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        {isLogin && !isForgotPassword && (
          <button onClick={handleGoogleSignIn} className="google-sign-in-button">
            Sign in with Google
          </button>
        )}

        <div className="toggle-options">
          {!isForgotPassword && (
            <p>
              <span className="no-account-text">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <span className="toggle-link" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Sign Up' : 'Login'}
              </span>
            </p>
          )}
        </div>
        <button onClick={onClose} className="close-button">
          Close
        </button>
      </div>
    </div>
  );
}

export default LoginModal;