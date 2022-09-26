const express = require('express')
import './server/js/db'
import Excel from './server/models/excel'
import Keyword from './server/models/keyword'
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const app = express()
const excelToJson = require('convert-excel-to-json');
const port = 3000
const fs = require('fs')
const path = require('path')


app.set('view engine', 'ejs')
app.set("views", path.join(__dirname, 'server', "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/css', express.static(__dirname + '/server' + '/css'))


// db.query('SELECT * FROM excel', function (error, results, fields) {
//     if (error) console.log(error)
//     console.log(results);
// });

// db.end();

app.get('/', async (req, res) => {
    res.render('home')
})

app.get('/reset', async (req, res) => {
    const remove = await Excel.deleteMany({});
    await Keyword.deleteMany({});
    if (remove) {
        console.log('리셋')
        return res.render('home')
    }
})
app.get('/result', async (req, res) => {
    const excelFind = await Excel.find({});
    const keywordFind = await Keyword.find({});
    
    if(excelFind.length !== 0  && keywordFind.length !== 0) {
        let a = excelFind;
        let b = keywordFind;
        let obj = {};
        for(let i = 0; i < b.length; i++) {
            let cnt = 0;
            let key = b[i].name
            for(let x of a) {
                let title = x.name;
                let price = x.price;
                let express = x.express;
                let sum = price + express;
                if(title.indexOf(key) >= 0)  {
                    if(!obj[key]) {
                        obj[key] = [1,sum]
                    } else {
                        obj[key][0]++
                        obj[key][1] = obj[key][1]+sum
                    }
                }

            }
        }
        let newArr = Object.entries(obj)
        console.log(newArr)
        return res.render('result', { result : true, newArr})
    } else {
        return res.render('result',{result : false, errMessage : '홈으로 가서 키워드와 엑셀 파일을 업로드 해주세요.'})
    }
})

app.post('/excel', upload.single('file'), async (req, res) => {
    const { body: { key } } = req;
    console.log(key, req.file)
    console.log(key, req.file)
    if (key !== undefined && req.file !== undefined) {
        let arrKey = [...key.split(',')]

        for (let x of arrKey) {
            await Keyword.create({ name: x })
        }

        const result = importExcelData2MongoDB(__dirname + '/uploads/' + req.file.filename);
        const resultValue = result[Object.keys(result)[0]];
        let saveResult = await Excel.insertMany(resultValue)
        if (saveResult) console.log('save')
        return res.redirect('/')
    } else {
        return res.redirect('/')
    }


})

function importExcelData2MongoDB(filePath) {
    const result = excelToJson({
        sourceFile: filePath,
        header: {
            rows: 1
        },
        columnToKey: {
            B: 'name',
            C: 'price',
            D: 'express'
        }
    });
    return result
};

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})