import React from "react";
import './reset_password.css';
import AgriVisionLogo from './assets/Agri_Vision_logo-main.png';
import Backbutton from './assets/left-arrow-recolored.png'
import { useNavigate } from "react-router-dom";

function ResetPassword() {

  const userEmail = localStorage.getItem('userEmail') || 'your email';
  const nav = useNavigate()

  function handleFinalSubmit(event) {
    event.preventDefault();
    const otp = document.querySelector('.otp-input').value;
    const newPass = document.querySelector('.new-pass-input').value;
    const confirmPass = document.querySelector('.confirm-pass-input').value;
    if (newPass !== confirmPass) {
      alert("Passwords do not match!");
      return;
    }
    alert("Password reset successfully!");
    nav("/LoginPage")
  }

  return (
    <>
      <div className="reset-password-page">
        <button className="back-button" onClick={() => {
          nav('/SendOTP')
        }}>
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
                    maxLength="6"
                    placeholder="Enter 6-digit code"
                    required
                  />
                </label>

                <label className="field-group">
                  <span className="field-label">New Password</span>
                  <input className="field-input new-pass-input" type="password" placeholder="Enter new password" required />
                </label>

                <label className="field-group">
                  <span className="field-label">Confirm Password</span>
                  <input className="field-input confirm-pass-input" type="password" placeholder="Confirm new password" required />
                </label>

                <button type="submit" className="reset-password-button">
                  Reset Password
                </button>

              </div>

            </form>

            <div>
              <span className="back">Back to<a href="/LoginPage"> Log in</a></span>
            </div>
            <div className="resend-container">
              <span className="back">Didn't receive OTP?<a href="#"> Resend</a></span>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}

export default ResetPassword
