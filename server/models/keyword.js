const mongoose = require('mongoose');
const keywordSchema = new mongoose.Schema({
    name : {
        type : String
    },
});
const Keyword = mongoose.model('Keyword', keywordSchema);

export default Keyword