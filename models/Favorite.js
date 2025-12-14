const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
    {
        pokemonName: { type: String, required: true, trim: true, lowercase: true },
        type: { type: String, required: true, trim: true, lowercase: true },
        spriteUrl: { type: String, required: true },
        note: { type: String, default: "" }
    },
    { timestamps: true }
);

favoriteSchema.index({ pokemonName: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", favoriteSchema);
