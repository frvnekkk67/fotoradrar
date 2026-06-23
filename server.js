const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.json());

// Wklej swój Discord Webhook URL tutaj:
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/XXXX/YYYY";

// Opcjonalny secret żeby tylko Twój serwer Roblox mógł wysyłać
const SECRET = "twoj_tajny_klucz_123";

app.post("/webhook", async (req, res) => {
    // Sprawdzenie klucza
    const auth = req.headers["x-secret"];
    if (auth !== SECRET) {
        return res.status(403).json({ error: "Forbidden" });
    }

    try {
        const response = await fetch(DISCORD_WEBHOOK, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body)
        });

        if (!response.ok) {
            const text = await response.text();
            console.error("Discord error:", text);
            return res.status(500).json({ error: text });
        }

        res.sendStatus(200);
    } catch (e) {
        console.error("Fetch error:", e);
        res.sendStatus(500);
    }
});

// Health check żeby Railway wiedział że serwer żyje
app.get("/", (req, res) => {
    res.send("Proxy działa!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Serwer działa na porcie " + PORT);
});
