const express = require("express");
const router = express.Router();

async function fetchJSON(url) {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Fetch failed: ${resp.status} ${url}`);
    return resp.json();
}

router.get("/", (req, res) => {
    const t = (req.query.type || "").toLowerCase();
    if (!t) return res.redirect("/");
    res.redirect(`/types/${t}`);
});

router.get("/:type", async (req, res) => {
    const type = (req.params.type || "").toLowerCase();
    
    try {
        const typeData = await fetchJSON(`https://pokeapi.co/api/v2/type/${type}`);
        const all = typeData.pokemon.map(p => p.pokemon);
        const limit = 20;
        const subset = all.slice(0, limit);
        
        const withSprites = await Promise.all(
            subset.map(async (p) => {
                try {
                    const details = await fetchJSON(`https://pokeapi.co/api/v2/pokemon/${p.name}`);
                    const sprite = details.sprites?.front_default || "";
                    return { name: p.name, spriteUrl: sprite };
                } catch {
                    return { name: p.name, spriteUrl: "" };
                }
            })
        );
        
        res.render("type", {
            title: `Type: ${type}`,
            type,
            pokemonList: withSprites,
            totalCount: all.length,
            shownCount: withSprites.length
        });
    } catch (err) {
        res.status(500).send(`Error loading type "${type}". ${err.message}`);
    }
});

module.exports = router;
