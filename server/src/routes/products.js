const express = require('express');
const router = express.Router();
const { auth, upload } = require('../middleware/index');
const Product = require('../schema/product');
const fs = require("fs");
const path = require('path');



router.post('/', auth, upload, async (req, res) => {
    try {
        const x = JSON.stringify(req.body);
        const newbody = JSON.parse(x);

        const { title, price, rating, description, delivery, category } = newbody;

        const result = await Product.findOne({ title, price, rating, description, delivery, category });
        if (result) {
            res.status(200).send({ message: "Product already added" });
            return 0;
        }

        await new Product(
            {
                title: title.replace(/ +(?= )/g, '').trim(),
                price,
                rating,
                description: description.replace(/ +(?= )/g, '').trim(),
                delivery,
                category,
                imageUrl: `/photos/${req.file.filename}`,
            }
        ).save();
        res.status(200).send({ status: true, message: 'added product', data: newbody });


    } catch (err) {
        console.log(err);
        res.status(200).send({ message: "Network error" });
    }

});


router.get('/search', async (req, res) => {
    try {
        const { category = [],
            skip = 0,
            limit = 7,
            rating = 0,
            sort = 0,
            search = "" } = req.query;


        let filter = {
            title: { $regex: search, $options: 'i' },
            rating: { $gte: parseInt(rating) }
        };
        if (category?.length) {
            filter.category = { $in: category.split(";") };
        }

        let sortOrder = {};
        if (sort == 1) {
            sortOrder.price = 1;
        } else if (sort == 2) {
            sortOrder.price = -1;
        }

        const totalProducts = await Product.find(filter).count();
        const products = await Product.find(filter).sort(sortOrder)
            .skip(skip)
            .limit(limit);

        const data = [...products];
        if (!(sortOrder?.price)) {
            await data.sort(() => Math.random() - 0.5);
        }


        res.status(200).send({ status: true, message: "ok", data: { totalProducts, data } });
    }
    catch (err) {
        console.log(err);
        res.status(200).send({ message: "Network error" });
    }
});


router.delete('/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const result = await Product.findOne({ _id: productId });

        if(result) {
            if (result?.imageUrl && fs.existsSync(path.join(__dirname,"..","..",  result.imageUrl))) {
                fs.unlinkSync(path.join(__dirname,"..","..",  result.imageUrl));
            }

            await Product.deleteOne({ _id: productId });
            res.status(200).send({ status: true, message: "Product is deleted" });
            return 0;
        }

        res.status(200).send({ message: "Order not found" });
    } catch (err) {
        console.log(err);
        res.status(200).send({ message: "Network error" });
    }

});


router.get('/list', auth, async (req, res) => {
    try {
        const { skip = 0, limit = 5 } = req.query;

        const totalProducts = await Product.find({}).count();
        const result = await Product.find({}).skip(skip).limit(limit);


        res.status(200).send({ status: true, message: "", data: { totalProducts, data: result } });

    } catch (err) {
        console.log(err);
        res.status(200).send({ message: "Network error" });
    }

});


router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findOne({ _id: id });

        res.status(200).send({ status: true, message: "success", data: product });
    }
    catch (err) {
        console.log(err);
        res.status(200).send({ statue: false, message: "Network error" });
    }
});




module.exports = router;