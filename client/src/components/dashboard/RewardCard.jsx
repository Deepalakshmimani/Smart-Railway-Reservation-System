import React from "react";
import {
    FaGift,
    FaCoins,
    FaStar,
    FaCheckCircle,
    FaLock
} from "react-icons/fa";

const RewardCard = ({ reward }) => {

    if (!reward) {

        return (

            <div className="dashboard-card reward-card">

                <h2 className="card-title">
                    Reward Wallet
                </h2>

                <p className="card-subtitle">
                    No reward information available.
                </p>

            </div>

        );

    }

    const percentage = Math.min(
        (reward.progress / reward.requiredFeedback) * 100,
        100
    );

    return (

        <div className="dashboard-card reward-card">

            {/* Header */}

            <div className="reward-header">

                <div>

                    <h2 className="card-title">
                        Reward Wallet
                    </h2>

                    <p>
                        Earn rewards by travelling and submitting feedback.
                    </p>

                </div>

                <div className="reward-icon">

                    <FaGift />

                </div>

            </div>

            {/* Wallet */}

            <div className="wallet-box">

                <span>Total Reward Wallet</span>

                <h1>

                    ₹{reward.rewardWallet}

                </h1>

            </div>

            {/* Stats */}

            <div className="reward-stats">

                <div className="reward-item">

                    <FaGift />

                    <div>

                        <span>
                            Pending Rewards
                        </span>

                        <h3>

                            ₹{reward.pendingRewards}

                        </h3>

                    </div>

                </div>

                <div className="reward-item">

                    <FaStar />

                    <div>

                        <span>
                            Feedback Submitted
                        </span>

                        <h3>

                            {reward.feedbackCount}

                        </h3>

                    </div>

                </div>

            </div>

            {/* Progress */}

            <div className="progress-section">

                <div className="progress-title">

                    <span>

                        Reward Progress

                    </span>

                    <span>

                        {reward.progress}/{reward.requiredFeedback}

                    </span>

                </div>

                <div className="progress">

                    <div
                        className="progress-fill"
                        style={{
                            width: `${percentage}%`
                        }}
                    />

                </div>

            </div>

            {/* Status */}

            {

                reward.claimAvailable ?

                    <div className="claim-ready">

                        <FaCheckCircle />

                        Congratulations! Reward ready to claim.

                    </div>

                    :

                    <div className="claim-pending">

                        <FaLock />

                        Complete more feedback to unlock rewards.

                    </div>

            }

        </div>

    );

};

export default RewardCard;