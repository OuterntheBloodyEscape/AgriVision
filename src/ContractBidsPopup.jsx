import { useState } from "react";
import "./ContractBidsPopup.css";
import remove_page from "./assets/nav_icons/delete.png";

const ContractBidsPopup = ({
    contract,
    onClose,
    onAccept,
    onReject,
    onRebid
}) => {
    const [activeRebidId, setActiveRebidId] =
        useState(null);

    const [rebidPrice, setRebidPrice] =
        useState("");

    const [rebidMessage, setRebidMessage] =
        useState("");

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    /*
     * OPEN COUNTER FORM
     */
    const startRebid = (app) => {
        setActiveRebidId(app._id);
        setRebidPrice(app.proposedPrice ?? "");
        setRebidMessage("");
    };

    /*
     * CLOSE COUNTER FORM
     */
    const cancelRebid = () => {
        setActiveRebidId(null);
        setRebidPrice("");
        setRebidMessage("");
    };

    /*
     * SEND COUNTER OFFER
     */
    const submitRebid = async (appId) => {
        const price = Number(rebidPrice);

        if (!Number.isFinite(price) || price < 0) {
            alert("Enter a valid price");
            return;
        }

        if (rebidMessage.length > 500) {
            alert("Message must be 500 characters or less");
            return;
        }

        try {
            setIsSubmitting(true);

            await onRebid(
                contract._id,
                appId,
                price,
                rebidMessage
            );

            cancelRebid();
        } catch (error) {
            console.error(
                "Counter offer error:",
                error
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    /*
     * STATUS ORDER
     */
    const statusPriority = {
        farmer_accepted: 1,
        pending: 2,
        owner_countered: 3,
        accepted: 4,
        rejected: 5
    };

    const sortedApplications = [
        ...(contract.applications || [])
    ].sort(
        (a, b) =>
            (statusPriority[a.status] || 99) -
            (statusPriority[b.status] || 99)
    );

    /*
     * FORMAT STATUS
     */
    const formatStatus = (status) => {
        if (!status) return "pending";

        return status
            .replaceAll("_", " ")
            .replace(/\b\w/g, (char) =>
                char.toUpperCase()
            );
    };

    return (
        <div
            className="contract_bids_overlay"
            onClick={onClose}
        >

            <div
                className="contract_bids_popup"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >

                {/* ========================= */}
                {/* CLOSE */}
                {/* ========================= */}

                <button
                    className="contract_bids_close"
                    onClick={onClose}
                    type="button"
                >
                    <img
                        src={remove_page}
                        alt="Close"
                    />
                </button>


                {/* ========================= */}
                {/* CONTENT */}
                {/* ========================= */}

                <div className="contract_bids_content">

                    <h2>
                        Bids for {contract.title}
                    </h2>

                    <div className="contract_popup_summary">

                        <p>
                            <strong>
                                Required:
                            </strong>{" "}
                            {contract.need}{" "}
                            {contract.unit}
                        </p>

                        <p>
                            <strong>
                                Your Price:
                            </strong>{" "}
                            {contract.price} tk/
                            {contract.unit}
                        </p>

                        <p>
                            <strong>
                                Delivery:
                            </strong>{" "}
                            {contract.delivery}
                        </p>

                    </div>


                    {/* ========================= */}
                    {/* NO BIDS */}
                    {/* ========================= */}

                    {sortedApplications.length ===
                        0 ? (
                        <p className="no_bids_message">
                            No bids yet.
                        </p>
                    ) : (

                        <div className="bids_list">

                            {sortedApplications.map(
                                (app) => {

                                    const isRebidding =
                                        activeRebidId ===
                                        app._id;

                                    return (
                                        <div
                                            className="bid_card"
                                            key={app._id}
                                        >

                                            {/* ========================= */}
                                            {/* BID HEADER */}
                                            {/* ========================= */}

                                            <div className="bid_card_header">

                                                <div>
                                                    <h3>
                                                        {app.applicantName ||
                                                            "Farmer"}
                                                    </h3>

                                                    <small>
                                                        Bidder ID:{" "}
                                                        {
                                                            app.applicantId
                                                        }
                                                    </small>
                                                </div>

                                                <span
                                                    className={`bid_status ${app.status
                                                        }`}
                                                >
                                                    {formatStatus(
                                                        app.status
                                                    )}
                                                </span>

                                            </div>


                                            {/* ========================= */}
                                            {/* INLINE COUNTER FORM */}
                                            {/* ========================= */}

                                            {isRebidding ? (

                                                <div className="inline_rebid_form">

                                                    <div className="inline_rebid_info">

                                                        <p>
                                                            Farmer's
                                                            current
                                                            offer:
                                                        </p>

                                                        <strong>
                                                            {
                                                                app.proposedPrice
                                                            }{" "}
                                                            tk/
                                                            {
                                                                contract.unit
                                                            }
                                                        </strong>

                                                    </div>


                                                    <div className="inline_input_group">

                                                        <label>
                                                            Counter
                                                            Price
                                                        </label>

                                                        <div className="inline_price_wrapper">

                                                            <input
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                value={
                                                                    rebidPrice
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) =>
                                                                    setRebidPrice(
                                                                        e
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                                required
                                                            />

                                                            <span>
                                                                tk/
                                                                {
                                                                    contract.unit
                                                                }
                                                            </span>

                                                        </div>

                                                    </div>


                                                    <div className="inline_input_group">

                                                        <label>
                                                            Message
                                                            to
                                                            Farmer
                                                        </label>

                                                        <textarea
                                                            rows="3"
                                                            maxLength="500"
                                                            value={
                                                                rebidMessage
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                setRebidMessage(
                                                                    e
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="Write your counter offer..."
                                                        />

                                                    </div>


                                                    <div className="bid_card_actions">

                                                        <button
                                                            type="button"
                                                            className="bid_accept_button"
                                                            disabled={
                                                                isSubmitting
                                                            }
                                                            onClick={() =>
                                                                submitRebid(
                                                                    app._id
                                                                )
                                                            }
                                                        >
                                                            {isSubmitting
                                                                ? "Sending..."
                                                                : "Send Offer"}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="bid_reject_button"
                                                            disabled={
                                                                isSubmitting
                                                            }
                                                            onClick={
                                                                cancelRebid
                                                            }
                                                        >
                                                            Cancel
                                                        </button>

                                                    </div>

                                                </div>

                                            ) : (

                                                <>

                                                    {/* ========================= */}
                                                    {/* BID DETAILS */}
                                                    {/* ========================= */}

                                                    <div className="bid_card_details">

                                                        <p>
                                                            <strong>
                                                                Proposed
                                                                Price:
                                                            </strong>{" "}
                                                            {
                                                                app.proposedPrice
                                                            }{" "}
                                                            tk/
                                                            {
                                                                contract.unit
                                                            }
                                                        </p>


                                                        {app.message && (
                                                            <p>
                                                                <strong>
                                                                    Message:
                                                                </strong>{" "}
                                                                {
                                                                    app.message
                                                                }
                                                            </p>
                                                        )}


                                                        <p>
                                                            <strong>
                                                                Status:
                                                            </strong>{" "}
                                                            {formatStatus(
                                                                app.status
                                                            )}
                                                        </p>

                                                    </div>


                                                    {/* ========================= */}
                                                    {/* ACTIONS */}
                                                    {/* ========================= */}

                                                    <div className="bid_card_actions">

                                                        {/* 
                                                         * PENDING
                                                         * Owner can directly
                                                         * accept the bid.
                                                         */}
                                                        {app.status ===
                                                            "pending" && (
                                                                <button
                                                                    type="button"
                                                                    className="bid_accept_button"
                                                                    onClick={() =>
                                                                        onAccept(
                                                                            contract._id,
                                                                            app._id
                                                                        )
                                                                    }
                                                                >
                                                                    Accept
                                                                </button>
                                                            )}


                                                        {/* 
                                                         * PENDING
                                                         * Owner can counter.
                                                         */}
                                                        {app.status ===
                                                            "pending" && (
                                                                <button
                                                                    type="button"
                                                                    className="bid_rebid_button"
                                                                    onClick={() =>
                                                                        startRebid(
                                                                            app
                                                                        )
                                                                    }
                                                                >
                                                                    Counter
                                                                    Offer
                                                                </button>
                                                            )}


                                                        {/* 
                                                         * FARMER ACCEPTED
                                                         * Owner can finalize.
                                                         */}
                                                        {app.status ===
                                                            "farmer_accepted" && (
                                                                <button
                                                                    type="button"
                                                                    className="bid_accept_button"
                                                                    onClick={() =>
                                                                        onAccept(
                                                                            contract._id,
                                                                            app._id
                                                                        )
                                                                    }
                                                                >
                                                                    Finalize
                                                                    Deal
                                                                </button>
                                                            )}


                                                        {/* 
                                                         * ACTIVE BIDS
                                                         * Owner can reject.
                                                         */}
                                                        {[
                                                            "pending",
                                                            "owner_countered",
                                                            "farmer_accepted"
                                                        ].includes(
                                                            app.status
                                                        ) && (
                                                                <button
                                                                    type="button"
                                                                    className="bid_reject_button"
                                                                    onClick={() =>
                                                                        onReject(
                                                                            contract._id,
                                                                            app._id
                                                                        )
                                                                    }
                                                                >
                                                                    Reject
                                                                </button>
                                                            )}

                                                    </div>

                                                </>
                                            )}

                                        </div>
                                    );
                                }
                            )}

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
};

export default ContractBidsPopup;