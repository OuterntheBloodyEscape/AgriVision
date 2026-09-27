import Markdown from 'react-markdown'
import './AI_Disease_Detection.css'
import iu from './assets/nav_icons/image-add.png'
import iuh from './assets/nav_icons/image-add-hover.png'
import send from './assets/nav_icons/send.png'
import rm from './assets/nav_icons/remove.png'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'


let AI_Disease_Detection = ({ ibp, bpl, tm }) => {
    const nav = useNavigate()
    useEffect(() => {
        const checkLogin = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/auth/check-login', {
                    method: 'GET',
                    credentials: 'include',
                })
                await res.json()

                if (res.status === 401) {
                    nav('/login_page', { replace: true })
                } else if (!res.ok) {
                    tm('Unable to verify your login session')
                }
            } catch (error) {
                console.error('Login check error:', error)
                tm('Unable to connect to the server')
            }
        }

        checkLogin()
    }, [nav, tm])
    const [photos, addPhotos] = useState([])
    const [analyzedPhotos, setAnalyzedPhotos] = useState([])
    const [isMouseImgAddOver, setMouseImgAddOver] = useState(false)
    const [addImgWarning, setAddImgWarning] = useState(true)
    const [aiResponse, setAiResponse] = useState('')
    const [additionalInfo, setAdditionalInfo] = useState('')
    const [waitForAIRespnsce, setWFAR] = useState(false)

    const checkAi = async () => {

        if (photos.length === 0) {
            setAddImgWarning(true);
            tm('Please attach at least one image first')
            return;
        }

        const inputFiles = Array.from(document.getElementById('image_up')?.files || [])
        const submittedPhotos = photos
            .map((photo, index) => ({
                ...photo,
                file: photo.file || inputFiles[index]
            }))
            .filter((photo) => photo.file)
        if (submittedPhotos.length === 0) {
            setAddImgWarning(true)
            tm('The selected image is no longer available. Please choose it again.')
            return
        }

        setWFAR(true)
        setAddImgWarning(false);
        const submittedInfo = additionalInfo
        setAiResponse('AI thinking');
        setAnalyzedPhotos(submittedPhotos);

        try {
            const formData = new FormData();

            formData.append('additionalInfo', submittedInfo);
            setAdditionalInfo('');

            for (const photo of submittedPhotos) {
                formData.append('images', photo.file, photo.file.name || 'uploaded-image');
            }

            const res = await fetch(
                'http://localhost:5000/api/ai_disease_detection/disease',
                {
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'AI analysis failed')
            }

            setAiResponse(data.result);

            addPhotos([]);

        } catch (error) {
            console.error('AI Error:', error);
            setAiResponse(error.message || 'AI analysis failed. Please try again.')
            tm(error.message || 'AI analysis failed. Please try again.')
        } finally {
            setWFAR(false)
        }
    }

    return (
        <>
            <div id='aidd_root'>
                <div id='aidd_top' className={waitForAIRespnsce ? 'aidd_root_waiting' : ''}>
                    <div id='aidd_heading'><h4>AI Disease Detection</h4></div>
                    <div className={`aidd_result ${(addImgWarning) ? 'aidd_result_w' : ''} ${(waitForAIRespnsce) ? ('wfar') : ('')}`}>

                        {(waitForAIRespnsce) ? (<></>) : (analyzedPhotos.length > 0 && (
                            <div id='aidd_analyzed_images'>

                                {analyzedPhotos.map((p, idx) => (
                                    <div
                                        className='aidd_analyzed_image_div'
                                        key={idx}
                                        onClick={() => {
                                            ibp(true);
                                            bpl(p.link);
                                        }}
                                    >
                                        <img
                                            src={p.link}
                                            alt={`Analyzed image ${idx + 1}`}
                                            className='aidd_analyzed_image'
                                        />
                                    </div>
                                ))}

                            </div>
                        ))}

                        <Markdown>
                            {
                                (addImgWarning)
                                    ? ('Attach image first')
                                    : (aiResponse)
                            }
                        </Markdown>

                    </div>
                </div>
                <div id='aidd_bottom'>
                    <div id='up_container'>
                        <label htmlFor='image_up' id='label_image_up' onMouseEnter={() => { setMouseImgAddOver(true) }} onMouseLeave={() => { setMouseImgAddOver(false) }}>
                            <img src={(isMouseImgAddOver) ? iuh : iu} alt="uplode" id='uplode_icon' draggable={false} />
                            <p>Uplode Image</p>
                            <input type='file' id='image_up' onChange={(f) => {
                                if (waitForAIRespnsce) {
                                    tm('wait for AI response. No photo can be uploaded now')
                                } else if (f.target.files.length > 0) {
                                    for (let i = 0; i < f.target.files.length; i++) {
                                        let pl = URL.createObjectURL(f.target.files[i]);
                                        addPhotos((p) => ([...p, { file: f.target.files[i], link: pl }]));
                                    }
                                }
                            }} accept='image/*' multiple />
                        </label>
                        <div id='photo_container'>
                            {photos.map((p, idx) => (
                                <div className='photo_container2' key={idx}>
                                    <div className='photo_div' onClick={() => { ibp(true); bpl(p.link); }}>
                                        <img className='photo' src={p.link} alt='uploded...'></img>
                                    </div>
                                    <div className='rm_div' onClick={() => {
                                        if (!waitForAIRespnsce) {
                                            URL.revokeObjectURL(p.link)
                                            addPhotos((pr) => pr.filter((e) => e.link !== p.link))
                                        } else {
                                            tm('wait for AI response. No photo can be removed now')
                                        }
                                    }}>
                                        <img src={rm} alt="remove" className='img_remove' />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <form id='txt_container' onSubmit={(e) => {
                        e.preventDefault()
                        checkAi()
                        e.target.reset()
                    }}>
                        <textarea id='txt' placeholder='Additional Info...' onChange={(e) => { setAdditionalInfo(e.target.value) }}></textarea>
                        <button id='send_button' type='submit' disabled={waitForAIRespnsce || photos.length === 0}>
                            <img src={send} height={20} width={20}></img>
                        </button>
                    </form>
                </div>
            </div>
        </>

    )
}
export default AI_Disease_Detection