const mongoose = require('mongoose');

const system = new mongoose.Schema({
    categoryList: Array
});


const System = mongoose.model('systems',system);
module.exports = System;