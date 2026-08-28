import { useState } from 'react'
import { GoogleGenAI } from '@google/genai'
import Markdown from 'react-markdown'
import './AI_Disease_Detection.css'
import iu from './assets/nav_icons/image-add.png'
import iuh from './assets/nav_icons/image-add-hover.png'
import send from './assets/nav_icons/send.png'
import rm from './assets/nav_icons/remove.png'


let AI_Disease_Detection = ({ ibp, bpl }) => {
    const [photos, addPhotos] = useState([]);
    const [isMouseImgAddOver, setMouseImgAddOver] = useState(false);
    const [addImgWarning, setAddImgWarning] = useState(true);
    const [aiResponse, setAiResponse] = useState('');
    const gAi = new GoogleGenAI({
        apiKey: import.meta.env.VITE_GEMINI_API_KEY
    });
    const checkAi = async () => {
        if (photos.length > 0) {
            setAddImgWarning(false);
            const tla = [...photos];
            addPhotos([]);
            try {
                const images = [];

                for (const photo of tla) {
                    const file = photo.file;
                    const uploadedFile = await gAi.files.upload({
                        file: file,
                        config: {
                            mimeType: file.type
                        }
                    });

                    images.push({
                        fileData: {
                            fileUri: uploadedFile.uri,
                            mimeType: uploadedFile.mimeType
                        }

                    });
                }

                const response = await gAi.models.generateContent({
                    model: "gemini-3.6-flash",
                    contents: [
                        ...images,
                        {
                            text: `You are AgriVision AI, an agricultural disease detection assistant.
                            Analyze the provided image(s) carefully and identify visible signs of disease, pest infestation, nutrient deficiency, physical damage, or other abnormalities affecting the plant/crop.
                            Your analysis must be based ONLY on evidence visible in the provided image(s). Do not confidently diagnose a disease if the image quality, symptoms, or available evidence are insufficient.
                            Return the result in the following structure:
                            1. Crop/Plant:
                                - Identify the plant or crop if possible.
                                - If uncertain, list the most likely possibilities.
                            2. Health Status:
                                - Healthy
                                - Possibly Diseased
                                - Diseased
                                - Pest Infestation
                                - Nutrient Deficiency
                                - Physical/Environmental Damage
                                - Cannot Determine
                            3. Diagnosis:
                                - Give the most likely disease, pest, deficiency, or condition.
                                - If uncertain, provide up to 3 possible diagnoses ranked by likelihood.
                            4. Confidence:
                                - Give a confidence percentage from 0–100%.
                                - Explain briefly what visible evidence supports the confidence level.
                            5. Visible Symptoms:
                                - Describe the important symptoms visible in the image, such as leaf spots, discoloration, wilting, lesions, mold, holes, curling, necrosis, abnormal growth, or pest damage.
                            6. Severity:
                                - Mild
                                - Moderate
                                - Severe
                                - Cannot Determine
                                - Briefly explain why.
                            7. Treatment:
                                - Give practical treatment recommendations.
                                - Prefer integrated pest management and non-chemical methods where appropriate.
                                - If pesticides, fungicides, herbicides, antibiotics, or other agricultural chemicals may be appropriate, mention the type/category and advise following the locally approved product label rather than giving unsafe or unsupported application rates.
                            8. Prevention:
                                - Give practical steps to reduce the chance of recurrence.
                            9. Additional Information Needed:
                                - If the image alone is insufficient, state exactly what information would improve the diagnosis, such as crop variety, plant age, location, weather conditions, soil condition, recent fertilizer use, pesticide use, or additional photos of leaves/stems/fruits/roots.
                            IMPORTANT RULES:
                                - Do not invent symptoms that are not visible.
                                - Do not claim certainty when the evidence is weak.
                                - Distinguish between disease, pest damage, nutrient deficiency, and environmental/physical damage when possible.
                                - If the image is blurry, too dark, poorly framed, or does not show enough of the affected area, say so.
                                - If the plant cannot be identified reliably, say "Plant identification uncertain."
                                - If no abnormality is visible, say that no obvious disease symptoms are detected rather than inventing a diagnosis.
                                - If multiple images are provided, analyze them together and use evidence from all images.
                                - Keep the final answer clear and understandable for farmers.
                                - This is an AI-based preliminary assessment, not a definitive laboratory or expert diagnosis.
                            At the end, provide a short section:
                            Overall Assessment:
                            [One or two sentences summarizing the most likely condition and the recommended next step.]`
                        }
                    ]
                });

                setAiResponse(response.text);
                console.log(response.text);

            } catch (error) {
                console.error("Gemini Error:", error);
            }

        } else {
            setAddImgWarning(true);
        }
    }

    return (
        <>
            <div id='aidd_root'>
                <div id='aidd_top'>
                    <div id='aidd_heading'><h4>AI Disease Detection</h4></div>
                    <div className={`aidd_result ${(addImgWarning) ? 'aidd_result_w' : ''}`}>
                        <Markdown >
                            {
                                (addImgWarning) ? ('Attach image first') : (aiResponse)
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
                                let l = f.target.files.length
                                for (let i = 0; i < l; i++) {
                                    let pl = URL.createObjectURL(f.target.files[i]);
                                    addPhotos((p) => ([...p, { file: f.target.files[i], link: pl }]));
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
                                        addPhotos((pr) => pr.filter((e) => e.link !== p.link));
                                    }}>
                                        <img src={rm} alt="remove" className='img_remove' />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div id='txt_container'>
                        <textarea id='txt' placeholder='Additional Info...'></textarea>
                        <div id='send_button' onClick={() => { checkAi(); }}>
                            <img src={send} height={20} width={20}></img>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}
export default AI_Disease_Detection