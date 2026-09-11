import React from "react";
import { useNavigate } from "react-router-dom";
import './send_OTP.css';
import AgriVisionLogo from './assets/Agri_Vision_logo-main.png';

function SendOTP() {

  const nav = useNavigate()

  function handleNextStep(event) {
    event.preventDefault();

    const emailInput = document.querySelector('.field-input');
    const userEmail = emailInput.value;

    if (userEmail.trim() === "") return;
    localStorage.setItem('userEmail', userEmail);

    const messageBox = document.querySelector('.js-email-input');
    messageBox.innerHTML = `Code sent to ${userEmail} <span class="check-mark">✓</span>`;

    setTimeout(() => {
      messageBox.innerHTML = "";
      nav('/ResetPassword')
    }, 3000);
  }


  return (
    <>
      <div className="reset-password-page">
        <div className="reset-password-page-container-otp">

          <div className="container1">
            <img className="edit-logo-send-otp" src={AgriVisionLogo} alt="AgriVision Logo" />
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
                  <input className="field-input" type="email" placeholder="user@gmail.com" required />
                </label>

                <div className="js-email-input"></div>

                <button type="submit" className="sendOTP">
                  Send OTP Code
                </button>
              </div>

            </form>

            <div>
              <span className="back">Back to<a href="/LoginPage"> Log in</a></span>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}

export default SendOTP;