const { Client } = require('pg');

// Initialize the PostgreSQL client with a persistent connection
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'guess',
    password: 'root',
    port: 5432,
});

// Create the table and setup DB connection
const table_create = async () => {
    try {
        await client.connect();  // Connect only once

        // Enable the 'uuid-ossp' extension if not already enabled
        await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

        // Create the users table with UUID as the primary key
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                random_number INT,
                chance INT DEFAULT 5
            )
        `);

        console.log("Table created successfully");
    } catch (err) {
        console.error("Error creating table:", err);
    }
};

// Call the table creation function only once at the start
table_create();

module.exports = { client };
