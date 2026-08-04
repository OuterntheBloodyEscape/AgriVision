import './AI_Disease_Detection.css'
import iu from './assets/nav_icons/img_up.png'
import iuh from './assets/nav_icons/img_up_hover.png'
let GreenAi = () => {
    return (
        <>
            <div id='aidd_root'>
                <div id='aidd_top'>
                    <p>AI Disease Detection</p>
                    <label htmlFor='image_up' id='label_image_up'>
                        <img src={iuh} alt="uplode" id='uplode_icon' draggable={false} />
                        <p>Uplode Image</p>
                        <input type='file' id='image_up' />
                    </label>
                </div>
                <div id='aidd_bottom'></div>
            </div>
        </>
    )
}
export default GreenAi