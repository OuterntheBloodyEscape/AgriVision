import React from "react";
import './registration.css'
import AgriVisionLogo from './assets/Agri_Vision_logo-main.png'

function Registration({ cp }) {
  return (
    <>
      <div className="regbody">
        <div className="registration-page-container">

          <div className="container1">
            <img src={AgriVisionLogo} />
            <span className="agri">AgriVision</span>
          </div>

          <div className="container2">
            <h1 className="create">
              Create your account
            </h1>

            <form className="box" onSubmit={() => { cp(1) }}>
              <label className="field-group extra-space">
                <span className="field-label">Name</span>
                <input className="field-input" type="text" placeholder="Enter your full name" required />
              </label>

              <label className="field-group">
                <span className="field-label">Company name</span>
                <input className="field-input" type="text" placeholder="Enter your company name" />
              </label>

              <label className="field-group">
                <span className="field-label">Email</span>
                <input className="field-input" type="email" placeholder="Enter your email" required />
              </label>

              <label className="field-group">
                <span className="field-label">Password</span>
                <input className="field-input" type="password" placeholder="Enter your password" required />
              </label>

              <label className="checkbox-group">
                <input className="check" type="checkbox" required />
                <span className="terms">I accept <a href="#">Terms & conditions</a></span>
              </label>

              <button type="submit" className="continue">
                Continue
              </button>


            </form>

            <div>
              <span className="already">
                Already have an account?<a href="#" onClick={(e) => { e.preventDefault(); cp(1); }}> Log in</a>
              </span>
            </div>
          </div>

        </div>
      </div>

    </>
  );
}

export default Registration