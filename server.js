const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.json());

const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1519050131570298971/ovTGxTam3oJeRoPUpkJMwW5ii_5M75bvmBgp9vE-qc2MJ-cOGXbGqQbjHUZ6vsicKFKK";
const SECRET = "twoj_tajny_klucz_123";

app.post("/webhook", async (req, res) => {
    const auth = req.headers["x-secret"];
    if (auth !== SECRET) {
        return res.status(403).json({ error: "Forbidden" });
    }

    console.log("Payload otrzymany:", JSON.stringify(req.body, null, 2));

    try {
        const response = await fetch(DISCORD_WEBHOOK, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body)
        });

        const text = await response.text();
        console.log("Discord status:", response.status);
        console.log("Discord odpowiedź:", text);

        if (!response.ok) {
            return res.status(500).json({ error: text });
        }

        res.sendStatus(200);
    } catch (e) {
        console.error("Błąd:", e);
        res.sendStatus(500);
    }
});

app.get("/", (req, res) => {
    res.send("Proxy działa!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Serwer działa na porcie " + PORT);
});
