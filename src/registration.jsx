import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './registration.css'
import AgriVisionLogo from './assets/Agri_Vision_logo-main.png'

function Registration() {
  const pageNavigat = useNavigate()
  const [name, setName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [resStatus, setResStatus] = useState(0);

  const makeRegistration = async () => {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        Company_name: companyName,
        email,
        password: pass
      })
    })
    const data = await res.json();

    console.log(data);
    return res.status;
  }

  return (
    <>
      <div className="registration-page">
        <div className="registration-page-container">

          <div className="container1">
            <img src={AgriVisionLogo} />
            <span className="agri">AgriVision</span>
          </div>

          <div className="container2">
            <h1 className="create">
              Create your account
            </h1>

            <form className="box" onSubmit={async (e) => {
              e.preventDefault();
              const rs = await makeRegistration()
              if (rs === 201) {
                pageNavigat("/LoginPage")
              } else {
                setResStatus(rs);
              }
            }}>
              <label className="field-group extra-space">
                <span className="field-label">Name</span>
                <input className="field-input" type="text" placeholder="Enter your full name" required
                  onInput={(e) => { setName(e.target.value) }} />
              </label>

              <label className="field-group">
                <span className="field-label">Company name</span>
                <input className="field-input" type="text" placeholder="Enter your company name"
                  onInput={(e) => { setCompanyName(e.target.value) }} />
              </label>

              <label className="field-group">
                <span className="field-label">Email</span>
                <input className="field-input" type="email" placeholder="Enter your email" required
                  onInput={(e) => { setEmail(e.target.value) }} />
              </label>

              <label className="field-group">
                <span className="field-label">Password</span>
                <input className="field-input" type="password" placeholder="Enter your password" required maxLength={16} minLength={8}
                  onInput={(e) => { setPass(e.target.value) }} />
              </label>

              {/* <label className="checkbox-group">
                <input className="check" type="checkbox" required />
                <span className="terms">I accept <a href="#">Terms & conditions</a></span>
              </label> */}

              <button type="submit" className="continue">
                Continue
              </button>


            </form>

            <div>
              <span className="already">
                Already have an account?<a href="#"> Log in</a>
              </span>
            </div>
          </div>

        </div>
      </div>


    </>
  );
}

export default registration