const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { client } = require("./db/db");

const app = express();

// Enable JSON parsing
app.use(express.json());

// Enable CORS
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Initialize session middleware
app.use(
    session({
        secret: "moy7qg8wpv",
        resave: true,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);

// Function to create a user
const createsUser = async () => {
    let random_number = Math.floor(Math.random() * 10) + 1;
    try {
        const res = await client.query(
            `INSERT INTO users (random_number, chance) VALUES ($1, 5) RETURNING *`,
            [random_number]
        );
        return res.rows[0];
    } catch (err) {
        console.error("Error creating user:", err);
        throw err;
    }
};

// Fetch random number
const getRandomNumber = async (userId) => {
    try {
        const res = await client.query(
            'SELECT random_number FROM users WHERE id = $1',
            [userId]
        );
        // Return the random_number from the first row of the result
        return res.rows[0]?.random_number || null;
    } catch (err) {
        console.error("Error retrieving random number:", err);
        throw err;
    }
};

// Decrease chance
const decreaseChance = async (userId) => {
    try {
        await client.query(
            'UPDATE users SET chance = chance - 1 WHERE id = $1',
            [userId]
        );
    } catch (err) {
        console.error("Error decreasing chance:", err);
        throw err;
    }
};
app.get("/api/destroy", (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
                res.status(500).send("Failed to destroy session");
            } else {
                res.send("Session destroyed");
            }
        });
    } else {
        res.status(400).send("No active session to destroy");
    }
});

// Route to start a game or fetch game state
app.get("/api/game", async (req, res) => {
    if (!req.session.user) {
        try {
            const user = await createsUser();
            req.session.user = user.id;
            res.json({ randomNumber: user.random_number, attemptsLeft: 5 });
        } catch (err) {
            res.status(500).send("Error creating user");
        }
    } else {
        try {
            const randomNumber = await getRandomNumber(req.session.user);
            const { rows } = await client.query(
                'SELECT chance FROM users WHERE id = $1',
                [req.session.user]
            );
            res.json({ randomNumber, attemptsLeft: rows[0].chance });
        } catch (err) {
            res.status(500).send("Error retrieving game state");
        }
    }
});

// Route to check a guess
app.post("/api/guess", async (req, res) => {
    const { guess } = req.body;
    if (!req.session.user) return res.status(400).send("No active session");

    try {
        const randomNumber = await getRandomNumber(req.session.user);
        if (guess === randomNumber) {
            res.json({ message: "Correct! You won!", won: true, correctNumber: randomNumber });
        } else {
            await decreaseChance(req.session.user);
            const { rows } = await client.query(
                'SELECT chance FROM users WHERE id = $1',
                [req.session.user]
            );
            const attemptsLeft = rows[0].chance;
            if (attemptsLeft === 0) {
                res.json({ message: "Out of attempts!", won: false, correctNumber: randomNumber });
            } else {
                res.json({
                    message: guess > randomNumber ? "Too high!" : "Too low!",
                    won: false,
                });
            }
        }
    } catch (err) {
        res.status(500).send("Error processing guess");
    }
});


// Start the server
app.listen(3000, () => {
    console.log("Backend is running on http://localhost:3000");
});
