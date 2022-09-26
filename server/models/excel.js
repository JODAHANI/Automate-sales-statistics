const mongoose = require('mongoose');

const excelSchema = new mongoose.Schema({
    _id : {
        type:  Number
    },
    name : {
        type : String
    },
    price : {
        type : Number
    },
    express : {
        type : Number
    }
});


const Excel = mongoose.model('Excel', excelSchema);
export default Excel