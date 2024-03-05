const mongoose = require("mongoose");
const ProductsModel = mongoose.Schema(
	{
		title: { type: String, required: true, unique: true },
		price: { type: Number, required: true },
		description: { type: String, requried: true },
		category: { type: String, required: true },
		image: { type: String, required: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("product", ProductsModel);
