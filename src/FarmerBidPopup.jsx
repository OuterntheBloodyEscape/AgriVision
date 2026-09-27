import { useState } from "react";
import "./FarmerBidPopup.css";
import remove_page from "./assets/nav_icons/delete.png";

const FarmerBidPopup = ({
    contract,
    application,
    onClose,
    onAccept,
    onUpdateBid
}) => {
    const [showCounter, setShowCounter] = useState(false);
    const [price, setPrice] = useState(application?.proposedPrice ?? "");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!contract || !application) return null;

    const formatStatus = (status) => {
        if (!status) return "Pending";

        return status
            .replaceAll("_", " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const handleSubmit = async () => {
        const numericPrice = Number(price);

        if (!Number.isFinite(numericPrice) || numericPrice < 0) {
            alert("Enter a valid price");
            return;
        }

        if (message.length > 500) {
            alert("Message must be 500 characters or less");
            return;
        }

        try {
            setIsSubmitting(true);

            await onUpdateBid(
                contract._id,
                application._id,
                numericPrice,
                message
            );

            setShowCounter(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="farmer_bid_overlay"
            onClick={onClose}
        >
            <div
                className="farmer_bid_popup"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="farmer_bid_close"
                    onClick={onClose}
                    type="button"
                >
                    <img src={remove_page} alt="Close" />
                </button>

                <div className="farmer_bid_content">

                    <h2>{contract.title}</h2>

                    <div className="farmer_contract_summary">
                        <p>
                            <strong>Required:</strong>{" "}
                            {contract.need} {contract.unit}
                        </p>

                        <p>
                            <strong>Owner Price:</strong>{" "}
                            {contract.price} tk/{contract.unit}
                        </p>

                        <p>
                            <strong>Delivery:</strong>{" "}
                            {contract.delivery}
                        </p>
                    </div>

                    <div className="farmer_bid_box">

                        <div className="farmer_bid_header">
                            <h3>My Bid</h3>

                            <span
                                className={`farmer_bid_status ${application.status}`}
                            >
                                {formatStatus(application.status)}
                            </span>
                        </div>

                        <div className="farmer_bid_details">

                            <p>
                                <strong>My Offered Price:</strong>{" "}
                                {application.proposedPrice} tk/
                                {contract.unit}
                            </p>

                            {application.message && (
                                <p>
                                    <strong>Message:</strong>{" "}
                                    {application.message}
                                </p>
                            )}

                        </div>

                        {/* OWNER COUNTER */}
                        {application.status === "owner_countered" && (
                            <>
                                <div className="owner_counter_box">
                                    <h3>Owner's Counter Offer</h3>

                                    <p>
                                        <strong>
                                            Owner's Offered Price:
                                        </strong>{" "}
                                        {application.proposedPrice} tk/
                                        {contract.unit}
                                    </p>

                                    {application.message && (
                                        <p>
                                            <strong>
                                                Owner's Message:
                                            </strong>{" "}
                                            {application.message}
                                        </p>
                                    )}
                                </div>

                                {!showCounter && (
                                    <div className="farmer_bid_actions">

                                        <button
                                            type="button"
                                            className="farmer_accept_button"
                                            onClick={() =>
                                                onAccept(
                                                    contract._id,
                                                    application._id
                                                )
                                            }
                                        >
                                            Accept Owner's Offer
                                        </button>

                                        <button
                                            type="button"
                                            className="farmer_counter_button"
                                            onClick={() =>
                                                setShowCounter(true)
                                            }
                                        >
                                            Send New Counter
                                        </button>

                                    </div>
                                )}
                            </>
                        )}

                        {/* COUNTER FORM */}
                        {showCounter && (
                            <div className="farmer_counter_form">

                                <h3>Send New Counter Offer</h3>

                                <label>New Price</label>

                                <div className="farmer_price_wrapper">
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={price}
                                        onChange={(e) =>
                                            setPrice(e.target.value)
                                        }
                                    />

                                    <span>
                                        tk/{contract.unit}
                                    </span>
                                </div>

                                <label>Message</label>

                                <textarea
                                    value={message}
                                    maxLength={500}
                                    onChange={(e) =>
                                        setMessage(e.target.value)
                                    }
                                    placeholder="Write your counter offer..."
                                />

                                <div className="farmer_bid_actions">

                                    <button
                                        type="button"
                                        className="farmer_accept_button"
                                        disabled={isSubmitting}
                                        onClick={handleSubmit}
                                    >
                                        {isSubmitting
                                            ? "Sending..."
                                            : "Send Counter"}
                                    </button>

                                    <button
                                        type="button"
                                        className="farmer_cancel_button"
                                        disabled={isSubmitting}
                                        onClick={() =>
                                            setShowCounter(false)
                                        }
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </div>
                        )}

                        {/* NORMAL PENDING BID */}
                        {application.status === "pending" && (
                            <div className="farmer_bid_actions">

                                <button
                                    type="button"
                                    className="farmer_counter_button"
                                    onClick={() =>
                                        setShowCounter(true)
                                    }
                                >
                                    Update My Bid
                                </button>

                            </div>
                        )}

                        {/* FARMER ACCEPTED */}
                        {application.status === "farmer_accepted" && (
                            <div className="farmer_waiting_message">
                                You accepted the owner's offer.
                                Waiting for the owner to finalize the deal.
                            </div>
                        )}

                        {/* ACCEPTED */}
                        {application.status === "accepted" && (
                            <div className="farmer_success_message">
                                Deal finalized successfully.
                            </div>
                        )}

                        {/* REJECTED */}
                        {application.status === "rejected" && (
                            <div className="farmer_rejected_message">
                                This bid was rejected.
                            </div>
                        )}

                    </div>

                </div>
            </div>
        </div>
    );
};

export default FarmerBidPopup;