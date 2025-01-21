// GuessInput.jsx
import React, { useState } from 'react';

const GuessInput = ({ onGuess, disabled }) => {
    const [guess, setGuess] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (guess && !isNaN(guess)) {
            onGuess(parseInt(guess));
            setGuess('');
        }
    };

    return (
        <div className="card w-96 bg-base-200 shadow-xl p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="number"
                    placeholder="Enter your guess..."
                    className="input input-bordered w-full"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    disabled={disabled}
                />
                <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={disabled}
                >
                    Make Guess
                </button>
            </form>
        </div>
    );
};

export default GuessInput;