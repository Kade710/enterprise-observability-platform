const express = require("express");
const { Pool } = require("pg")
const redis = require("redis")

const app = express();
const PORT = process.env.PORT || 3000;

// This line allows my API to automatically parse JSON request bodies
app.use(express.json());

// Postgres connection
const pool = new Pool({
    host: process.env.POSTGRES_HOST || "postgres",
    user: process.env.POSTGRES_USER || "obs_user",
    password: process.env.POSTGRES_PASSWORD || "obs_pass",
    database: process.env.POSTGRES_DB || "observability",
    port: 5432,
});

// Redis connection
const redisClient = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST || "redis",
        port: 6379,
    },
});

redisClient.connect()
    .then(() => console.log("Redis connected"))
    .catch(err => {
        console.error("Redis connect error:", err);
        process.exit(1);
});

// Health Endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Readiness endpoint
app.get("/api/ready", async (req, res) => {
    try {
        // Check Postgres
        await pool.query("SELECT 1");

        // Check Redis
        await redisClient.ping();

        res.json({ status: "ready" });
    }   catch (err) {
        console.error("Readiness check failed:", err);
        res.status(503).json({ status: "not ready", error: err.message })
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`API running on port ${PORT}`);
});