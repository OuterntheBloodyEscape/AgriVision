import info from './assets/info-recolored.png'
import up_right from './assets/up-right-arrow.png'
import './welcome.css'
let Welcome = ({ cp }) => {
    let cl = () => {
        cp(1);
    }
    return (
        <>
            <div id="bg_image"></div>
            <div id='container'>
                <p id='heading'>Welcome to AgriVision</p>
                <div id='button_section'>
                    <div id='about'><p>About us</p><img src={info} height={20} width={20} draggable={false} /></div>
                    <div id='join' onClick={cl}><p>Join us </p><img src={up_right} height={20} width={20} draggable={false} /></div>
                </div>
            </div >
        </>
    );
}

export default Welcome
