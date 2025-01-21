import React, { useState, useEffect } from "react";
import GuessInput from "./GuessInput";
import Feedback from "./Feedback";
import AttemptsCounter from "./AttemptsCounter";
import GameOver from "./GameOver";
import axios from "axios";

const GuessingGame = () => {
    const [gameState, setGameState] = useState({
        attemptsLeft: 5,
        gameOver: false,
        won: false,
        feedback: "Loading game...",
        feedbackType: "hint",
    });

    const generateId = async () => {
        try {
            await axios.get("http://localhost:3000/api/destroy", { withCredentials: true });
            await initializeGame(); // Start a new session and game
        } catch (err) {
            console.error("Error destroying session and starting a new game:", err);
        }
    };

    const initializeGame = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/game", {
                withCredentials: true,
            });
            setGameState((prev) => ({
                ...prev,
                attemptsLeft: res.data.attemptsLeft,
                gameOver: false,
                won: false,
                feedback: "Game started! Guess a number between 1 and 20",
                feedbackType: "hint",
            }));
        } catch (err) {
            console.error("Error initializing game:", err);
        }
    };

    const handleGuess = async (guess) => {
        try {
            const res = await axios.post(
                "http://localhost:3000/api/guess",
                { guess },
                { withCredentials: true }
            );
            const { message, won, correctNumber } = res.data; // Update to include correctNumber
            setGameState((prev) => ({
                ...prev,
                attemptsLeft: prev.attemptsLeft - 1,
                feedback: message,
                feedbackType: won ? "success" : "hint",
                gameOver: won || prev.attemptsLeft - 1 === 0,
                won,
                correctNumber, // Save correctNumber
            }));
        } catch (err) {
            console.error("Error processing guess:", err);
        }
    };


    useEffect(() => {
        initializeGame();
    }, []);

    return (
        <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center gap-6 p-4">
            <h1 className="text-4xl font-bold mb-8">Number Guessing Game</h1>

            {!gameState.gameOver ? (
                <>
                    <Feedback
                        message={gameState.feedback}
                        type={gameState.feedbackType}
                    />
                    <AttemptsCounter
                        attempts={5 - gameState.attemptsLeft}
                        maxAttempts={5}
                    />
                    <GuessInput
                        onGuess={handleGuess}
                        disabled={gameState.gameOver}
                    />
                </>
            ) : (
                <GameOver
                    won={gameState.won}
                    correctNumber={gameState.correctNumber || "unknown"}
                    attempts={5 - gameState.attemptsLeft}
                    onRestart={generateId}
                />
            )}
        </div>
    );
};

export default GuessingGame;
