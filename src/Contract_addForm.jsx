import { useState } from 'react'
import './Contract_addForm.css'
import remove_page from './assets/nav_icons/delete.png'

const Contract_addForm = ({ cdp, tm, onAdded }) => {
    const [selectValue, setSelectValue] = useState('kg');
    const [title, setTitle] = useState('');
    const [need, setNeed] = useState('');
    const [price, setPrice] = useState('');
    const [delivery, setDelivery] = useState('');
    const [more_info, setMoreInfo] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [isSaving, setIsSaving] = useState(false)

    const addContract = async (event) => {
        event.preventDefault()
        if (isSaving) return

        setIsSaving(true)
        try {
            const response = await fetch('http://localhost:5000/api/contracts', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    need,
                    unit: selectValue,
                    price,
                    delivery,
                    moreInfo: more_info,
                    phone,
                    email
                })
            })
            const data = await response.json()
            if (!response.ok) {
                throw new Error(data.message || 'Unable to add contract')
            }
            await onAdded()
            tm(data.message)
            cdp(0)
        } catch (error) {
            console.error('Add contract error:', error)
            tm(error.message || 'Unable to add contract')
        } finally {
            setIsSaving(false)
        }
    }

    return (<>
        <div id='caf_heading'>
            <h2>Add your Contract</h2>
            <div id='caf_rp' onClick={() => { cdp(0) }}>
                <img src={remove_page} alt="delete" id='caf_rpi' />
            </div>

        </div>
        <div id='caf_body'>
            <form autoComplete='on' onSubmit={addContract} id='caf_form'>
                <div className='caf_entry_box'>
                    <label htmlFor='caf_title'>Title*</label>
                    <input type="text" id='caf_title' required maxLength={14} onInput={(e) => { setTitle(e.target.value) }} />
                    <div><p>{`${title.length}/14`}</p></div>
                </div>
                <div className='caf_mul_entry_box'>
                    <div className='caf_entry_box'>
                        <label htmlFor='caf_need'>Need*</label>
                        <div id='caf_input_select'>
                            <input type="number" id='caf_need' min={50} required placeholder='min: 50' onInput={(e) => { setNeed(e.target.value) }} />
                            <select id='caf_select' onChange={(e) => { setSelectValue(e.target.value) }}>
                                <option>kg</option>
                                <option>ton</option>
                                <option>L</option>
                                <option>kl</option>
                            </select>
                        </div>
                    </div>
                    <div className='caf_entry_box'>
                        <label htmlFor='caf_price'>Price*</label>
                        <input type="number" id='caf_price' min={5} required placeholder={`tk/${selectValue}`} onInput={(e) => { setPrice(e.target.value) }} />
                    </div>
                </div>
                <div className='caf_entry_box'>
                    <label htmlFor='caf_Delivery'>Delivery*</label>
                    <input type="month" id='caf_Delivery' required onInput={(e) => { setDelivery(e.target.value) }} />
                </div>
                <div className='caf_entry_box'>
                    <label htmlFor='caf_phone'>Phone*</label>
                    <input
                        type="tel"
                        id='caf_phone'
                        required
                        maxLength={15}
                        placeholder='Enter phone number'
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>

                <div className='caf_entry_box'>
                    <label htmlFor='caf_email'>Email*</label>
                    <input
                        type="email"
                        id='caf_email'
                        required
                        placeholder='Enter email address'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className='caf_entry_box'>
                    <label htmlFor='caf_more_info'>MoreInfo*</label>
                    <textarea id="caf_more_info" required minLength={20} maxLength={500} onInput={(e) => { setMoreInfo(e.target.value) }}></textarea>
                    <div><p>{`${more_info.length}/500`}</p></div>
                </div>

                <div className='caf_entry_box_button'>
                    <input type="submit" id='caf_add' value={isSaving ? 'ADDING...' : 'ADD'} disabled={isSaving} />
                </div>

            </form>
        </div>
    </>)
}
export default Contract_addForm