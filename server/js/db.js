const mongoose = require('mongoose');

mongoose.connect(process.env.MONGOURI).then(() => {
    console.log('잘 연결됐음.')
}).catch( (err) => {
    console.log(err)
});


const db = mongoose.connection;
export default db;


// var mysql = require('mysql');
// var connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '123123',
//     database: 'yaksarecipe'
// });

// connection.connect();



// module.exports = connection;
