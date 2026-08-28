import './login.css'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import shovel from './assets/photo_lib/shovel.png'
import fruit from './assets/photo_lib/fruit.png'
import robotic from './assets/photo_lib/robotic-arm.png'
import farm from './assets/photo_lib/farm.png'
import chick from './assets/photo_lib/chick.png'
import eco from './assets/photo_lib/eco-world.png'

let Login = () => {
    const slidephotos = [shovel, fruit, robotic, farm, chick, eco];
    const [photoIndex, setIndex] = useState(0);
    const nev = useNavigate();
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((currentIndex) => {
                return (currentIndex + 1) % slidephotos.length;
            });
        }, 3000);

        return () => (clearInterval(interval));
    }, []);

    return (
        <>
            <div id="login_bg_image"></div>
            <div id='container'>
                <dev id='login_container'>
                    <div id='lcp1'>
                        <div id='login_photo_display'>
                            <img src={slidephotos[photoIndex]} alt="photo_display" id='login_photo_display_img' />
                        </div>
                        <div id='login_photo_change_bar'>
                            <input type='radio' checked={(photoIndex == 0)} className='login_change_bar' />
                            <input type='radio' checked={(photoIndex == 1)} className='login_change_bar' />
                            <input type='radio' checked={(photoIndex == 2)} className='login_change_bar' />
                            <input type='radio' checked={(photoIndex == 3)} className='login_change_bar' />
                            <input type='radio' checked={(photoIndex == 4)} className='login_change_bar' />
                            <input type='radio' checked={(photoIndex == 5)} className='login_change_bar' />
                        </div>
                    </div>
                    <div id='lcp2'>
                        <div id='Login_heading_container'>
                            <h1 id='Login_heading'>Login you account</h1>
                        </div>
                        <div id='form_container'>
                            <form autoComplete='on' id='login_form' onSubmit={(e) => {
                                e.preventDefault(); nev('/MainPage')
                            }} autoSave='off'>
                                < label htmlFor='user_email' className='form_label' > Email: </label>
                                <input name='user_email' id='user_email' type='email' placeholder='example@mail.com' required autoFocus />
                                <label htmlFor='user_pass' className='form_label'>Password: </label>
                                <input name='user_pass' id='user_pass' type='password' placeholder='Your Account Password' minLength={8} maxLength={16} required />
                                <div id='form_submit_container'><input type='submit' id='form_submit'></input></div>
                            </form>
                        </div>
                        <div id='lcp2_bottom_txt'><p>Don't have any account? </p><a href='/Registration'>Registration</a></div>
                    </div >
                </dev >
            </div >
        </>
    );
}

export default Login