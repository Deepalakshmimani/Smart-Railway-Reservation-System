import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import "./Payment.css";

const Payment = () => {

    const { axios, backendUrl, navigate } = useAppContext();

    const location = useLocation();

    const {

        bookingId,

        bookingCode,

        totalAmount

    } = location.state;

    const [wallet, setWallet] = useState({

        rewardCredits: 0,

        pendingRewards: 0,

        feedbackCount: 0

    });

    const [loading, setLoading] = useState(true);

    const [useRewards, setUseRewards] = useState(false);

    const [redeemAmount, setRedeemAmount] = useState(0);

    /* ===================================
       FETCH REWARD WALLET
    =================================== */

    useEffect(() => {

        fetchWallet();

    }, []);

    const fetchWallet = async () => {

        try {

            const { data } = await axios.get(

                `${backendUrl}/api/rewards/wallet`

            );

            console.log(data);

            if (data.success) {

                setWallet(data.wallet);

            }

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };



    const handleRewardToggle = (checked) => {

        setUseRewards(checked);

        if (!checked) {

            setRedeemAmount(0);

            return;

        }

        const maxRedeem = Math.min(

            wallet.rewardCredits,

            totalAmount

        );

        setRedeemAmount(maxRedeem);

    };

    /* ===================================
       HANDLE REDEEM INPUT
    =================================== */

    const handleRedeemChange = (value) => {

        let amount = Number(value);

        if (isNaN(amount)) amount = 0;

        if (amount < 0) amount = 0;

        if (amount > wallet.rewardCredits)

            amount = wallet.rewardCredits;

        if (amount > totalAmount)

            amount = totalAmount;

        setRedeemAmount(amount);

    };

    /* ===================================
       FINAL AMOUNT
    =================================== */

    const payableAmount =

        totalAmount -

        (useRewards ? redeemAmount : 0);

    /* ===================================
       PAYMENT
    =================================== */

    const handlePayment = async () => {

        try {

            const { data } = await axios.post(
                `${backendUrl}/api/payment/pay/${bookingId}`,
                {
                    useRewards,
                    redeemAmount
                }
            );

            if (data.success) {

                toast.success("Payment Successful");

                navigate(`/ticket/${bookingId}`);

            }

            else {

                toast.error(data.message);

            }

        }

        catch (error) {

            console.log(error);

            toast.error(

                error.response?.data?.message ||

                "Payment Failed"

            );

        }

    };

    return (

        <div className="payment-page">

            <div className="payment-card">

                <h1>Payment</h1>

                <hr />

                <div className="payment-row">

                    <strong>Booking Code</strong>

                    <span>{bookingCode}</span>

                </div>

                <div className="payment-row">

                    <strong>Booking ID</strong>

                    <span>{bookingId}</span>

                </div>

                <div className="payment-row">

                    <strong>Ticket Amount</strong>

                    <span>₹ {totalAmount}</span>

                </div>

                {/* ======================
                    REWARD SECTION
                ======================= */}

                {/* ======================
                    REWARD SECTION
                ====================== */}

                {!loading && (

                    <div className="reward-section">

                        <h3>🎁 RailGo Rewards</h3>

                        <div className="reward-details">

                            <div className="reward-item">

                                <span>Reward Wallet</span>

                                <strong className="wallet-value">

                                    ₹ {wallet.rewardCredits}

                                </strong>

                            </div>

                            <div className="reward-item">

                                <span>Pending Rewards</span>

                                <strong>

                                    ₹ {wallet.pendingRewards}

                                </strong>

                            </div>

                            <div className="reward-item">

                                <span>Feedback Progress</span>

                                <strong>

                                    {wallet.feedbackCount} / 10

                                </strong>

                            </div>

                        </div>

                        <div className="progress-bar">

                            <div

                                className="progress-fill"

                                style={{

                                    width: `${Math.min(
                                        wallet.feedbackCount * 10,
                                        100
                                    )}%`

                                }}

                            />

                        </div>

                        {wallet.rewardCredits > 0 ? (

                            <>

                                <label className="reward-checkbox">

                                    <input

                                        type="checkbox"

                                        checked={useRewards}

                                        onChange={(e) =>
                                            handleRewardToggle(
                                                e.target.checked
                                            )
                                        }

                                    />

                                    Use Reward Credits

                                </label>

                                {useRewards && (

                                    <div className="redeem-box">

                                        <label>

                                            Redeem Amount

                                        </label>

                                        <input

                                            type="number"

                                            min="0"

                                            max={Math.min(
                                                wallet.rewardCredits,
                                                totalAmount
                                            )}

                                            value={redeemAmount}

                                            onChange={(e) =>
                                                handleRedeemChange(
                                                    e.target.value
                                                )
                                            }

                                        />

                                    </div>

                                )}

                            </>

                        ) : (

                            <div className="reward-message">

                                <p>

                                    💰 Current Reward Wallet :
                                    <strong>

                                        ₹ {wallet.rewardCredits}

                                    </strong>

                                </p>

                                <p>

                                    🎁 Pending Rewards :
                                    <strong>

                                        ₹ {wallet.pendingRewards}

                                    </strong>

                                </p>

                                <p>

                                    ⭐ Submit

                                    <strong>

                                        {" "}
                                        {wallet.remainingFeedbacks}{" "}

                                    </strong>

                                    more feedback

                                    {wallet.remainingFeedbacks > 1
                                        ? "s"
                                        : ""}

                                    to unlock

                                    <strong>

                                        {" "}₹50 Reward Credits

                                    </strong>

                                </p>

                            </div>

                        )}

                    </div>

                )}

                {/* ======================
                    BILL
                ======================= */}

                {useRewards && (

                    <div className="payment-row">

                        <strong>

                            Reward Discount

                        </strong>

                        <span>

                            - ₹ {redeemAmount}

                        </span>

                    </div>

                )}

                <div className="amount">

                    <h2>Final Amount</h2>

                    <h1>

                        ₹ {payableAmount}

                    </h1>

                </div>

                <button

                    className="pay-btn"

                    onClick={handlePayment}

                >

                    Pay ₹ {payableAmount}

                </button>

            </div>

        </div>

    );

};

export default Payment;