import './Contract_EditForm.css'
import remove_page from './assets/nav_icons/delete.png'
import { useState } from 'react'

const Contract_EditForm = ({
    contract,
    onClose,
    onUpdate
}) => {
    const [title, setTitle] = useState(contract.title)
    const [need, setNeed] = useState(contract.need)
    const [unit, setUnit] = useState(contract.unit)
    const [price, setPrice] = useState(contract.price)
    const [delivery, setDelivery] = useState(contract.delivery)
    const [moreInfo, setMoreInfo] = useState(contract.moreInfo)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()

        setIsSubmitting(true)

        try {
            await onUpdate(contract._id, {
                title,
                need,
                unit,
                price,
                delivery,
                moreInfo
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div
            className='contract_edit_overlay'
            onClick={onClose}
        >
            <div
                className='contract_edit_popup'
                onClick={(event) => event.stopPropagation()}
            >

                <button
                    className='contract_edit_close'
                    onClick={onClose}
                    aria-label='Close'
                    type='button'
                >
                    <img src={remove_page} alt='' />
                </button>

                <form
                    className='contract_edit_form'
                    onSubmit={handleSubmit}
                >
                    <h2>Edit Contract</h2>

                    <label htmlFor='edit_title'>
                        Contract Title
                    </label>

                    <input
                        id='edit_title'
                        type='text'
                        value={title}
                        maxLength={80}
                        required
                        onChange={(event) =>
                            setTitle(event.target.value)
                        }
                    />

                    <label htmlFor='edit_need'>
                        Required Amount
                    </label>

                    <div className='contract_edit_row'>
                        <input
                            id='edit_need'
                            type='number'
                            min='0'
                            step='0.01'
                            value={need}
                            required
                            onChange={(event) =>
                                setNeed(event.target.value)
                            }
                        />

                        <select
                            value={unit}
                            onChange={(event) =>
                                setUnit(event.target.value)
                            }
                        >
                            <option value='kg'>kg</option>
                            <option value='ton'>ton</option>
                            <option value='L'>L</option>
                            <option value='kl'>kl</option>
                        </select>
                    </div>

                    <label htmlFor='edit_price'>
                        Price
                    </label>

                    <div className='contract_edit_price'>
                        <input
                            id='edit_price'
                            type='number'
                            min='0'
                            step='0.01'
                            value={price}
                            required
                            onChange={(event) =>
                                setPrice(event.target.value)
                            }
                        />

                        <span>
                            tk/{unit}
                        </span>
                    </div>

                    <label htmlFor='edit_delivery'>
                        Delivery
                    </label>

                    <input
                        id='edit_delivery'
                        type='text'
                        value={delivery}
                        required
                        onChange={(event) =>
                            setDelivery(event.target.value)
                        }
                    />

                    <label htmlFor='edit_moreInfo'>
                        More Information
                    </label>

                    <textarea
                        id='edit_moreInfo'
                        maxLength={500}
                        value={moreInfo}
                        required
                        onChange={(event) =>
                            setMoreInfo(event.target.value)
                        }
                    />

                    <button
                        className='contract_edit_submit'
                        type='submit'
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? 'Saving...'
                            : 'Save Changes'}
                    </button>

                </form>
            </div>
        </div>
    )
}

export default Contract_EditForm