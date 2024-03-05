const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const connection = require("./dbConnection");
const cors = require("cors");

connection();

app.use(express.json());
app.use(cors());

app.use("/auth", require("./routes/Authentication"));
app.use("/products", require("./routes/Products"));
app.use("/cart", require("./routes/Cart"));

app.listen(process.env.PORT, () => {
	console.log("Listening on port", process.env.PORT);
});
