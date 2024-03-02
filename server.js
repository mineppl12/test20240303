const express = require('express');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

const PORT = 5000 || process.env.PORT;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json())

// MySQL Setup
const mysql = require('mysql');
let con;

(() => {
    const con_config = {
        host: 'points.jshsus.kr',
        port: 3306,
        user:'root',
        password:'Hello00!',
        database:'plma'
    };
    
    const connectSQL = () => {
        con = mysql.createConnection(con_config);

        con.connect(err => {
            if (err) setTimeout(connectSQL, 2000);
        });

        con.on('error', err => {
            if (err.code == "PROTOCOL_CONNECTION_LOST") connectSQL();
            else throw err;
        });
    }

    connectSQL();
})();
//SQL Setup END

app.get('/', (req, res) => {
    res.render('index.ejs', {"SUBTITLE" : "학생 관리부"});
});

app.post('/search/presearch', (req, res) => {
    const value = req.body.value;
    const method = (req.body.method == '0') ? "name" : "stuid";
    const sqlcmd = `SELECT stuid, name, plus, minus FROM user WHERE ${method} REGEXP "^(${value})([0-9]+)?" ORDER BY stuid`;

    let arr = new Array();

    con.query(sqlcmd, (err, result, fields) => {
        if (err) console.log(`error occured : \n${err}`);
        else{
            result.forEach((box) => {
                let _arr = {
                    "name" : box.name,
                    "stuid" : box.stuid,
                    "scores" : {"good" : box.plus, "bad" : box.minus}
                };

                arr.push(_arr);
            });

            res.send({"data" : arr});
        }
    });
});

app.post('/search/research', (req, res) => {
    const value = req.body.value;
    const sqlcmd = `SELECT stuid, name, plus, minus, gisu FROM user WHERE stuid=${value}`;

    con.query(sqlcmd, (err, result, fields) => {
        if (err) console.log(`error occured : \n${err}`);
        else{
            result[0].profileImg = '../../media/person5.png';
            res.send({"data" : result});
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server Listening on ${PORT}`);
});