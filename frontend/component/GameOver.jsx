// GameOver.jsx
import React from 'react';
import { Trophy, AlertCircle, RefreshCw } from 'lucide-react';

const GameOver = ({ won, correctNumber, attempts, onRestart }) => {
    return (
        <div className="card w-96 bg-base-200 shadow-xl">
            <div className="card-body items-center text-center">
                {won ? (
                    <Trophy className="w-16 h-16 text-success animate-bounce" />
                ) : (
                    <AlertCircle className="w-16 h-16 text-error animate-pulse" />
                )}
                <h2 className="card-title text-2xl">
                    {won ? 'Congratulations!' : 'Game Over!'}
                </h2>
                <p className="text-lg">
                    {won
                        ? `You won in ${attempts} attempts!`
                        : `The correct number was ${correctNumber}`
                    }
                </p>
                <div className="card-actions mt-4">
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={onRestart}
                    >
                        <RefreshCw className="mr-2" />
                        Play Again
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameOver;