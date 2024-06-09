const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const { auth } = require('../middleware/index');
const Order = require('../schema/order');
const Cart = require('../schema/cart');
const User = require('../schema/user')
const { sendMail } = require('../methods/index')


const title = "Shopway - Order Confirmation";
const text = (name,orderId, paymentId) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return `Hello ${name},\nYour order on Shopway has been confirmed.\n\nOrder ID :  ${orderId}\n\nPayment Id :  ${paymentId}\n\nOrder Date :  ${formattedDate}\n\nThank you for shopping with us!`;
};


const createOrder = async ({ amount, products, _id }) => {
  const instance = await new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET
  });

  const res = await instance.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: _id,
    notes: products
  });
  return res;
}


router.post('/', auth, async (req, res) => {
  try {
    const { id } = req.headers;
    const result = await Cart.findOne({ userId: id });

    if (result === null) {
      res.status(200).send({ simple: true, message: "Cart's is empty" });
      return 0;
    }

    const products = result?.carts?.toObject();
    const amount = result?.totalPrice;
    const { _id } = result;
    let orderReceipt = await createOrder({ amount, products, _id });

    if (Object.keys(orderReceipt) === 0) {
      res.status(200).send({ message: "Network Error" });
      return 0;
    }

    const existingOrder = await Order.findOne({ userId: id });

    if (existingOrder) {
      existingOrder.orders.push({
        orderId: orderReceipt.id,
        totalQuantity: result.totalQuantity,
        totalAmount: result.totalPrice,
        products: products,
        createAt: new Date(),
      });
      await existingOrder.save();
    } else {
      await new Order({
        userId: id,
        orders: [{
          orderId: orderReceipt.id,
          totalQuantity: result.totalQuantity,
          totalAmount: result.totalPrice,
          products: products,
          createAt: new Date(),
        }]
      }).save();
    }

    orderReceipt.KEY_ID = process.env.KEY_ID;
    res.status(200).send({ status: true, data: orderReceipt });
  } catch (err) {
    console.log(err);
    res.status(200).send({ message: "Network Error" });
  }
});



router.patch('/', auth, async (req, res) => {
  try {
    const { id } = req.headers;
    const { orderId, paymentId } = req.body;


    const result = await Order.findOne({
      userId: id,
      orders: { $elemMatch: { orderId: orderId } }
    });


    if (result) {
      const order = result.orders.find(order => order.orderId === orderId);

      order.status = "process";
      order.paymentId = paymentId;
      await result.save();

      const { name, email } = await User.findOne({ _id: id });
      await sendMail(email, title, text(name,orderId,paymentId));
      res.status(200).send({ status: true, message: "Order updated successfully", });
      return 0;
    }

    res.status(200).send({ message: "Order not found" });

  } catch (err) {
    console.log(err);
    res.status(200).send({ message: "Network Error" });
  }
});


router.patch('/confirm', auth, async (req, res) => {
  try {
    const { userId, orderId } = req.body;


    const result = await Order.findOne({
      userId: userId,
      orders: { $elemMatch: { orderId: orderId } }
    });

    if (result) {
      const order = result.orders.find(order => order.orderId === orderId);

      order.status = "confirm";
      order.orderComplete = new Date();
      await result.save();

      res.status(200).send({ status: true, message: "Order updated successfully", data: order });
      return 0;
    }

    res.status(200).send({ message: "Order not found" });
  } catch (err) {
    res.status(200).send({ message: "Network Error" });
  }
});



router.get('/', auth, async (req, res) => {
  try {
    const { id } = req.headers;
    let { skip = 0, limit = 5 } = req.query;
    skip = parseInt(skip);
    limit = parseInt(limit);

    const result = await Order.findOne({ userId: id });

    if (result) {
      const array = await result.orders.reverse().slice(skip, skip === 0 ? limit : (skip + limit));

      res.status(200).send({ status: true, message: "Order's list", data: { array, size: result.orders.length } });
      return 0;
    }

    res.status(200).send({ message: "Order's not found" });

  } catch (err) {
    console.log(err);
    res.status(200).send({ message: "Network Error" });
  }
});

router.get('/list', auth, async (req, res) => {
  try {
    let { skip = 0, limit = 5 } = req.query;
    skip = parseInt(skip);
    limit = parseInt(limit);

    // create code
    const pipeline = [
      { $unwind: "$orders" },
      { $sort: { "orders.createAt": -1 } },
      {
        $addFields: {
          userIdObject: { $toObjectId: "$userId" }
        }
      },
      {
        $lookup: {
          from: "users", // Name of the users collection
          localField: "userIdObject",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      { $unwind: "$userDetails" },
      {
        $facet: {
          array: [
            { $skip: skip },
            { $limit: limit },
            { $project: { orders: 1, userDetails: 1 } }
          ],
          size: [
            { $count: "count" }
          ]
        }
      }
    ];


    const result = await Order.aggregate(pipeline);
    const data = { ...result };
    data.array = data[0]?.array;
    data.size = data[0]?.size[0]?.count ?? 0;
    delete data[0];

    res.status(200).send({ status: true, message: "ok", data });
  } catch (err) {
    console.log(err);
    res.status(200).send({ message: "Network Error" });
  }
});
module.exports = router;