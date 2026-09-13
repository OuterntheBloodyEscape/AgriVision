import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import './send_OTP.css';
import AgriVisionLogo from './assets/Agri_Vision_logo-main.png';

function SendOTP() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const navigate = useNavigate();
  
  async function handleNextStep(event) {
    event.preventDefault();
    if (email.trim() === "") return;
    
    setLoading(true);
    setStatusMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('userEmail', email);
        setStatusMessage(`Code sent to ${email} ✓`);
        
        setTimeout(() => {
          navigate("/reset_password");
        }, 1500);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to connect to the server. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="reset-password-page">
      <div className="reset-password-page-container-otp">
        <div className="container1">
          <img className="edit-logo-reset-pass-otp" src={AgriVisionLogo} alt="AgriVision Logo" />
          <span className="agri-forsendotp">AgriVision</span>
        </div>

        <div className="container2">
          <form className="box" onSubmit={handleNextStep}>
            <h1 className="reset-pass-text">Reset your password</h1>

            <div className="step-1">
              <p className="instruction">
                Enter your email address to receive a <br />6-digit verification code.
              </p>

              <label className="field-group">
                <span className="field-label">Email</span>
                <input 
                  className="field-input" 
                  type="email" 
                  placeholder="user@gmail.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </label>

              {statusMessage && (
                <div className="js-email-input" style={{ color: "#2e7d32", marginTop: "10px", fontWeight: "bold" }}>
                  {statusMessage}
                </div>
              )}

              <button type="submit" className="sendOTP" disabled={loading}>
                {loading ? "Sending OTP..." : "Send OTP Code"}
              </button>
            </div>
          </form>

          <div>
            <span className="back">Back to <Link to="/login_page">Log in</Link></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SendOTP;