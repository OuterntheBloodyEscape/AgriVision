import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './reset_password.css';
import AgriVisionLogo from './assets/Agri_Vision_logo-main.png';
import Backbutton from './assets/left-arrow-recolored.png';
import { Link } from 'react-router-dom';

function ResetPassword() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setUserEmail(storedEmail);
    } else {
      navigate('/send_otp');
    }
  }, [navigate]);

  async function handleFinalSubmit(event) {
    event.preventDefault();

    if (newPass !== confirmPass) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          otp: otp.trim(),
          newPassword: newPass
        })
      });

      const data = await response.json();

      if (data.success) {
        alert("Password reset successfully! You can now log in.");
        localStorage.removeItem('userEmail');
        navigate("/login_page");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend(e) {
    e.preventDefault();
    if (resending) return;

    setResending(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail })
      });

      const data = await response.json();
      if (data.success) {
        alert(`A new OTP has been sent to ${userEmail}`);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to resend OTP. Server connection error.");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="reset-password-page">
      <button className="back-button" onClick={() => navigate('/send_otp')}>
        <img className="edit-back-button-icon" src={Backbutton} alt="backbutton" />
        Back
      </button>

      <div className="reset-password-page-container">
        <div className="container1">
          <img className="edit-logo-reset-pass" src={AgriVisionLogo} alt="AgriVision Logo" />
          <span className="agri-forresetpass">AgriVision</span>
        </div>

        <div className="container2">
          <form className="box" onSubmit={handleFinalSubmit}>
            <h1 className="reset-pass-text">Reset your password</h1>

            <div className="otp">
              OTP sent to {userEmail} <span className="check-mark">✓</span>
            </div>

            <div className="step-2">
              <label className="field-group">
                <span className="field-label">Enter OTP</span>
                <input
                  className="field-input otp-input"
                  type="text"
                  minLength={6}
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </label>

              <label className="field-group">
                <span className="field-label">New Password</span>
                <input
                  className="field-input new-pass-input"
                  type="password"
                  placeholder="Enter new password"
                  minLength={8}
                  maxLength={16}
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  required
                />
              </label>

              <label className="field-group">
                <span className="field-label">Confirm Password</span>
                <input
                  className="field-input confirm-pass-input"
                  type="password"
                  placeholder="Confirm new password"
                  minLength={8}
                  maxLength={16}
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  required
                />
              </label>

              <button type="submit" className="reset-password-button" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </form>

          <div>
            <span className="back">Back to <Link to="/login_page">Log in</Link></span>
          </div>
          <div className="resend-container">
            <span className="back">
              Didn't receive OTP?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#119D46',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  font: 'inherit',
                  fontWeight: "bold"
                }}
              >
                {resending ? "Sending..." : "Resend"}
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;