import React from 'react';

const AttemptsCounter = ({ attempts, maxAttempts }) => {
    return (
        <div className="stats shadow w-96">
            <div className="stat">
                <div className="stat-title">Remaining Attempts</div>
                <div className="stat-value text-primary">{maxAttempts - attempts}</div>
                <div className="stat-desc">Out of {maxAttempts} attempts</div>
            </div>
            <div className="stat">
                <div className="stat-title">Used Attempts</div>
                <div className="stat-value text-secondary">{attempts}</div>
                <div className="stat-desc">Try to guess in fewer attempts!</div>
            </div>
        </div>
    );
};

export default AttemptsCounter;