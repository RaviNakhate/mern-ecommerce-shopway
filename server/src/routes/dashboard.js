const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/index');
const User = require('../schema/user');
const Product = require('../schema/product');
const Order = require('../schema/order')

router.get('/', auth, async (req, res) => {
    try {
        const totalUsers = await User.find({ user: 'client' }).count();
        const totalProducts = await Product.find({}).count();
        const totalOrders = await Order.aggregate([
            { $unwind: "$orders" },
            { $count: "size" }
        ]);

        const totalProcessOrders = await Order.aggregate([
            { $unwind: "$orders" },
            { $match: { "orders.status": "process" } },
            {
                $count: "size"
            }
        ]);
        const totalFailOrders = await Order.aggregate([
            { $unwind: "$orders" },
            { $match: { "orders.status": "fail" } },
            {
                $count: "size"
            }
        ]);
        const totalConfirmOrders = await Order.aggregate([
            { $unwind: "$orders" },
            { $match: { "orders.status": "confirm" } },
            {
                $count: "size"
            }
        ]);

        const totalSaleAmount = await Order.aggregate([
            { $unwind: "$orders" },
            {
                $group: {
                    _id: null,
                    "size": { $sum: "$orders.totalAmount" }
                }
            }
        ]);
        const x = totalSaleAmount[0]?.size ?? 0;
        const totalMargin = Math.round((x/100)*10);
        let totalProfit = await Order.aggregate([
            { $unwind: "$orders" },
            { $match: { "orders.status": "confirm" } },
            {
                $group: {
                    _id: null,
                    "size": { $sum: "$orders.totalAmount" }
                }
            }
        ]);
        const y = totalProfit[0]?.size ?? 0;
        totalProfit = Math.round((y/100)*10);


        const data = await [
            {
                key: "Total Users",
                value: totalUsers,
                color: "#7c73e6"
            },
            {
                key: "Total Products",
                value: totalProducts,
                color: "teal"
            },
            {
                key: "Total Orders",
                value: totalOrders[0]?.size ?? 0,
                color: "salmon"
            },
            {
                key: "Total Process Orders",
                value: totalProcessOrders[0]?.size ?? 0,
                color: "#00bbf0"
            },
            {
                key: "Total Fail Orders",
                value: totalFailOrders[0]?.size ?? 0,
                color: "#fd5959"
            },
            {
                key: "Total Confirm Orders",
                value: totalConfirmOrders[0]?.size ?? 0,
                color: "#ffbd67"
            },
            {
                key: "Total Sales Amount",
                value: totalSaleAmount[0]?.size ?? 0,
                rupees: true,
                color: "#a06ee1",
            },
            {
                key: "Total Margin (10%)",
                value: totalMargin,
                rupees: true,
                color: "#008000"
            },
            {
                key: "Total Profit",
                value: totalProfit,
                rupees: true,
                color: "#f96d00"
            }
        ];

        res.status(200).send({ status: true, message: "", data });

    } catch (err) {
        console.log(err);
        res.status(200).send({ message: "Network error" });
    }


});

module.exports = router;
