import { useState } from 'react'
import './AI_Disease_Detection.css'
import iu from './assets/nav_icons/image-add.png'
import iuh from './assets/nav_icons/image-add-hover.png'
import send from './assets/nav_icons/send.png'
import rm from './assets/nav_icons/remove.png'
let AI_Disease_Detection = ({ ibp, bpl }) => {
    const [photolink, addLink] = useState([]);
    const [isMouseImgAddOver, setMouseImgAddOver] = useState(false);
    return (
        <>
            <div id='aidd_root'>
                <div id='aidd_top'>
                    <div id='aidd_heading'><h4>AI Disease Detection</h4></div>
                </div>
                <div id='aidd_bottom'>
                    <div id='up_container'>
                        <label htmlFor='image_up' id='label_image_up' onMouseEnter={() => { setMouseImgAddOver(true) }} onMouseLeave={() => { setMouseImgAddOver(false) }}>
                            <img src={(isMouseImgAddOver) ? iuh : iu} alt="uplode" id='uplode_icon' draggable={false} />
                            <p>Uplode Image</p>
                            <input type='file' id='image_up' onChange={(f) => {
                                let l = f.target.files.length
                                for (let i = 0; i < l; i++) {
                                    let link = URL.createObjectURL(f.target.files[i]);
                                    addLink((pl) => ([...pl, link]));
                                }
                            }} accept='image/*' multiple />
                        </label>
                        <div id='photo_container'>
                            {photolink.map((link, idx) => (
                                <div className='photo_container2' key={idx}>
                                    <div className='photo_div' onClick={() => { ibp(true); bpl(link); }}>
                                        <img className='photo' src={link} alt='uploded...'></img>
                                    </div>
                                    <div className='rm_div' onClick={() => {
                                        addLink(pl => pl.filter((_) => _ !== link));
                                    }}>
                                        <img src={rm} alt="remove" className='img_remove' />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div id='txt_container'>
                        <textarea id='txt' placeholder='Additional Info...'></textarea>
                        <div id='send_button' >
                            <img src={send} height={20} width={20}></img>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}
export default AI_Disease_Detection