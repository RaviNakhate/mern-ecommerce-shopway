const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/index');
const User = require('../schema/user');
const Cart = require('../schema/cart');
const Product = require('../schema/product');


router.post('/', auth, async (req, res) => {
    try {
        const { id } = req.headers;
        const { productId, status } = req.body;

        let usrCart = await Cart.findOne({ userId: id });

        if (!usrCart) {
            usrCart = await new Cart({ userId: id });
        }

        const cartItem = usrCart.carts.find(item => item.productId === productId);

        switch (status) {
            case 1: // Increment quantity
                if (cartItem) {
                    cartItem.quantity += 1;
                } else {
                    const product = await Product.findOne({ _id: productId });
                    
                    usrCart.carts.push({
                        productId: product._id,
                        quantity: 1,
                        price: product.price
                    });
                }
                break;

            case 2: // Decrement quantity
                if (cartItem) {
                    if (cartItem.quantity > 1) {
                        cartItem.quantity -= 1;
                    } else {
                        usrCart.carts = usrCart.carts.filter(item => item.productId !== productId);
                    }
                }
                break;

            case 3: // Delete all products
                await Cart.deleteOne({ id });
                return res.status(200).send({ status: true, message: "All Cart's deleted" });

            default:
                return res.status(400).send({ message: "Invalid status" });
        }

        usrCart.totalQuantity = usrCart.carts.length;
        usrCart.totalPrice = usrCart.carts.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        await usrCart.save();

        res.status(200).send({ status: true, message: "", data: usrCart });
    } catch (err) {
        console.log(err);
        res.status(200).send({ message: "Network error" });
    }


});



router.get('/:userid', auth, async (req, res) => {
    try {
        const { userid } = req.params;

        const result = await Cart.findOne({ userId: userid });
        res.status(200).send({ status: true, message: "", data: result });

    } catch (err) {
        console.log(err);
        res.status(200).send({ message: "Network error" });
    }


});

module.exports = router;