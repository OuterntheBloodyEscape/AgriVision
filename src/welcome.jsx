import { useNavigate } from 'react-router-dom'
import info from './assets/info-recolored.png'
import up_right from './assets/up-right-arrow.png'
import './welcome.css'
let Welcome = ({ tm }) => {
    const navigate = useNavigate();
    const cl = async () => {
        const res = await fetch('http://localhost:5000/api/auth/check-login', {
            method: 'GET',
            credentials: 'include',
        })
        const data = await res.json()

        if (res.status === 401) {
            navigate('/login_page')
        } else {
            navigate('/main_page')
        }
        tm(data.message)
    }

    return (
        <>
            <div id="bg_image"></div>
            <div id='container'>
                <p id='heading'>Welcome to AgriVision</p>
                <div id='button_section'>
                    <div id='about'>
                        <p>About us</p>
                        <img src={info} height={20} width={20} draggable={false} />
                    </div>
                    <div id='join' onClick={cl}>
                        <p>Join us</p>
                        <img src={up_right} height={20} width={20} draggable={false} />
                    </div>
                </div>
                <div id='goal_section'>
                    <div>
                        <h3>Our Goal:</h3>
                    </div>
                    <div>
                        <p>To create a smart and connected agricultural platform that empowers farmers with AI technology,
                            direct market access, real-time information, modern farming services, and transparent product traceability.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Welcome
