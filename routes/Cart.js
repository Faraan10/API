const express = require("express");
const router = express.Router();
const Products = require("../models/ProductModel");
const Cart = require("../models/CartModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
	const token = req.headers.authtoken;

	if (!token) {
		res.status(401).json({ message: "No token" });
		return;
	}

	const authtoken = jwt.decode(token, process.env.SECRET_KEY);

	const username = authtoken.username;

	const cart = await Cart.find({
		username: username,
	});

	res.status(200).json(cart);
});

router.post("/post/", async (req, res) => {
	const token = req.headers.authtoken;
	const productId = req.headers.productid;

	if (!token) {
		res.status(401).json({ message: "No token" });
		return;
	}

	const authtoken = jwt.decode(token, process.env.SECRET_KEY);

	const username = authtoken.username;

	const checkCart = await Cart.findOne({
		username,
		productid: productId,
	});

	if (checkCart) {
		res.status(401).json({ messgae: "Item is already added to the cart" });
		return;
	}

	const product = await Products.findById(productId);
	// console.log(product);
	const { quantity } = req.body;

	const cart = await Cart.create({
		username,
		productid: productId,
		quantity: quantity,
		title: product.title,
		description: product.description,
		price: product.price,
		image: product.image,
	});

	res.status(200).json(cart);
});

router.put("/update", async (req, res) => {
	const token = req.headers.authtoken;
	const cartId = req.headers.cartid;

	if (!token) {
		res.status(401).json({ message: "No token" });
		return;
	}

	if (!cartId) {
		res.status(401).json({ message: "No cartid" });
		return;
	}
	const authtoken = jwt.decode(token.process.env.SECRET_KEY);

	const cart = await Cart.findById(cartId);

	if (!cart) {
		res.status(401).json({ message: "no item with such cart id" });
		return;
	}

	if (authtoken.username !== cart.username) {
		res.status(401).json({ message: "You are not Authorized" });
		return;
	}

	const { quantity } = req.body;

	if (!quantity) {
		res.status(401).json({ message: "Enter the quantity" });
		return;
	}

	const updateCart = await Cart.findByIdAndUpdate(
		cartId,
		{
			quantity: quantity,
		},
		{ new: true }
	);
});

router.delete("/delete", async (req, res) => {
	const token = req.headers.authtoken;

	const cartId = req.headers.cartid;

	if (!token) {
		res.status(401).json({ message: "No token" });
		return;
	}

	if (!cartId) {
		res.status(401).json({ message: "No cart Id" });
		return;
	}

	const authtoken = jwt.decode(token, process.env.SECRET_KEY);

	const cart = await Cart.findById(cartId);

	if (!cart) {
		res.status(401).json({ message: "No item with such id" });
		return;
	}

	if (authtoken.username !== cart.username) {
		res.status(401).json({ message: "You are not Authorized" });
		return;
	}

	const deleteCart = await Cart.findByIdAndDelete(cartId);

	res.status(200).json(deleteCart);
});
module.exports = router;
