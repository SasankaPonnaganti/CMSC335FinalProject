const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const typesRouter = require("./routes/types");
const favoritesRouter = require("./routes/favorites");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

async function connectDB() {
    const mongo = process.env.MONGO_CONNECTION_STRING;
    if (!mongo) {
        console.error("MONGO_CONNECTION_STRING is not in .env");
        process.exit(1);
    }
    await mongoose.connect(mongo);
    console.log("Connected to MongoDB");
}

app.get("/", (req, res) => {
    const types = ["normal", "fire", "fighting", "water", "flying", "grass", "poison", "electric", "ground", "psychic", "rock", "ice", "bug", "dragon", "ghost", "dark", "steel", "fairy"]
    res.render("index", { title: "Favorite Pokémon by Type", types });
});

app.use("/types", typesRouter);
app.use("/favorites", favoritesRouter);

const port = process.env.PORT || 3000 

connectDB()
.then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
})
.catch((err) => {
    console.error("DB connection error:", err);
    process.exit(1);
});
