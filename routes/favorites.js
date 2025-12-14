const express = require("express");
const router = express.Router();
const Favorite = require("../models/Favorite");

router.get("/", async (req, res) => {
    const favorites = await Favorite.find().sort({ createdAt: -1 }).lean();
    res.render("favorites", { title: "My Favorites", favorites });
});

router.post("/add", async (req, res) => {
    const pokemonName = (req.body.pokemonName || "").toLowerCase();
    const type = (req.body.type || "").toLowerCase();
    const spriteUrl = req.body.spriteUrl || "";
    const note = req.body.note || "";
    
    if (!pokemonName || !type || !spriteUrl) {
        return res.status(400).send("Missing data to save favorite.");
    }
    
    try {
        await Favorite.create({ pokemonName, type, spriteUrl, note });
        res.redirect("/favorites");
    } catch (err) {
        if (err.code === 11000) return res.redirect("/favorites");
        res.status(500).send(`Failed to save favorite. ${err.message}`);
    }
});

router.post("/delete", async (req, res) => {
    const id = req.body.id;
    if (!id) return res.status(400).send("Missing favorite id.");
    await Favorite.findByIdAndDelete(id);
    res.redirect("/favorites");
});

module.exports = router;
