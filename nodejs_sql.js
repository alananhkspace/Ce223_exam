//Open Call Express 
const express = require('express')
const bodyParser = require('body-parser')
 
const mysql = require('mysql');
const PoolNamespace = require('mysql/lib/PoolNamespace');
 
const app = express()
const port = process.env.PORT || 5000;
 
app.use(bodyParser.json())
//--------view-------//
app.set('view engine','ejs')
 
//MySQL Connect phpMyAdmin
const pool = mysql.createPool({
    connectionLimit : 10,
    connectionTimeout : 20,
    host : 'localhost', //www.google.com/sql or Server IP Address
    user : 'root',
    password : '',
    database : 'nodejs_lottery' //Connect Database from beers.sql (Import to phpMyAdmin)
})
 
//GET (เรียกข้อมูลขึ้นมาดู) | POST (ส่งข้อมูลหน้า Website กลับเข้ามา)
//GET All Beers (beers.sql)

var obj = {} // Global Variables

//สร้าง GET สำหรับรองรับการแสดงผล Front-End ส่วนของ Post ไว้บนสุด
app.get('/addprize',(req, res) => {
    res.render('addprize')
})

app.get('',(req, res) => {
 
    pool.getConnection((err, connection) => {  //err คือ connect ไม่ได้ or connection คือ connect ได้ บรรทัดที่ 13-20
        if(err) throw err
        console.log("connected id : ?" ,connection.threadId) //ให้ print บอกว่า Connect ได้ไหม
        //console.log(`connected id : ${connection.threadId}`) //ต้องใช้ ` อยู่ตรงที่เปลี่ยนภาษา ใช้ได้ทั้ง 2 แบบ
         
        connection.query('SELECT * FROM prizes', (err, rows) => { 
            connection.release();
            if(!err){ 
                //Back-End : Postman Test --> res.send(rows)
                //res.send(rows)
                //Front-End :
                //ทำการ Package ข้อมูล ที่ต้องการส่ง เพื่อจะให้สามารถส่งไปได้ทั้งชุด

                //-------------- Model of Data -------//
                obj = { prizes: rows, Error : err}

                //------------ Controller ------------//
                res.render('index', obj)
               
            } else {
                console.log(err)
            }
         }) 
    })
})
 

 

 
//(1)Post --> Insert 
//ใช้คำสั่งที่ให้สามารถรับข้อมูลรูปแบบ x-www-form-urlencoded ทดสอบด้วย Postman ลงฐานข้อมูลได้
app.use(bodyParser.urlencoded({ extended: false }))
//สร้าง path ของเว็บไซต์ additem
app.post('/addprize',(req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        const params = req.body
            //Check
            pool.getConnection((err, connection2) => {
                connection2.query(`SELECT COUNT(id) AS count FROM prizes WHERE id = ${params.id}`,(err, rows) => {
                    if(!rows[0].count){
                        connection.query('INSERT INTO prizes SET ?', params, (err, row) => {
                            connection.release()
                            if(!err){
                                //res.send(`${params.name} is complete adding item.`)
                                obj = {Error : err , mesg : `Succcess adding data ${params.Category}`}
                                res.render('addprize', obj)
                            } else {
                                console.log(err)
                            }
                        })
                    } else {
                        //res.send(`${params.name} do not insert data`)
                        obj = {Error : err, mesg : `Cannot adding data ${params.Category}`}
                        res.render('addprize', obj)
                    }
                    })
                })
            })
        })

        app.get('/checkprize',(req, res) => {
 
            pool.getConnection((err, connection) => {  //err คือ connect ไม่ได้ or connection คือ connect ได้ บรรทัดที่ 13-20
                if(err) throw err
                console.log("connected id : ?" ,connection.threadId) //ให้ print บอกว่า Connect ได้ไหม
                //console.log(`connected id : ${connection.threadId}`) //ต้องใช้ ` อยู่ตรงที่เปลี่ยนภาษา ใช้ได้ทั้ง 2 แบบ
                 
                connection.query('SELECT * FROM prizes', (err, rows) => { 
                    connection.release();
                    if(!err){ 
                        //Back-End : Postman Test --> res.send(rows)
                        //res.send(rows)
                        //Front-End :
                        //ทำการ Package ข้อมูล ที่ต้องการส่ง เพื่อจะให้สามารถส่งไปได้ทั้งชุด
        
                        //-------------- Model of Data -------//
                        obj = { prizes: rows, Error : err}
        
                        //------------ Controller ------------//
                        res.render('checkprize', obj)
                       
                    } else {
                        console.log(err)
                    }
                 }) 
            })
        })      
        app.get('/checkprize/:Draw',(req, res) => {
 
            pool.getConnection((err, connection) => {  //err คือ connect ไม่ได้ or connection คือ connect ได้ บรรทัดที่ 13-20
                if(err) throw err
                console.log("connected id : ?" ,connection.threadId) //ให้ print บอกว่า Connect ได้ไหม
                //console.log(`connected id : ${connection.threadId}`) //ต้องใช้ ` อยู่ตรงที่เปลี่ยนภาษา ใช้ได้ทั้ง 2 แบบ
         
                connection.query('SELECT * FROM prizes WHERE `Draw` = ?', req.params.Draw, (err, rows) => { 
                    connection.release();
                    if(!err){ //ถ้าไม่ error จะใส่ในตัวแปร rows
                            //res.send(rows)
                            obj = {prizes : rows, Error : err}
                            res.render('checkprize2.ejs', obj)
                    } else {
                        console.log(err)
                    }
                 }) 
            })
        })

        app.get('/credit',(req, res) => {
 
            pool.getConnection((err, connection) => {  //err คือ connect ไม่ได้ or connection คือ connect ได้ บรรทัดที่ 13-20
                if(err) throw err
                console.log("connected id : ?" ,connection.threadId) //ให้ print บอกว่า Connect ได้ไหม
                //console.log(`connected id : ${connection.threadId}`) //ต้องใช้ ` อยู่ตรงที่เปลี่ยนภาษา ใช้ได้ทั้ง 2 แบบ
                 
                connection.query('SELECT * FROM prizes', (err, rows) => { 
                    connection.release();
                    if(!err){ 
                        //Back-End : Postman Test --> res.send(rows)
                        //res.send(rows)
                        //Front-End :
                        //ทำการ Package ข้อมูล ที่ต้องการส่ง เพื่อจะให้สามารถส่งไปได้ทั้งชุด
        
                        //-------------- Model of Data -------//
                        obj = { prizes: rows, Error : err}
        
                        //------------ Controller ------------//
                        res.render('credit', obj)
                       
                    } else {
                        console.log(err)
                    }
                 }) 
            })
        })
        app.delete('/delete/:id',(req, res) => {
            pool.getConnection((err,connection) => {
                if(err) throw err
                console.log("connected id : ?", connection.threadId)
                //ลบข้อมูลโดยใช้ id
                connection.query('DELETE FROM `prizes` WHERE `prizes` . `id` = ?', [req.params.id], (err, rows) => {
                    connection.release();
                    if(!err){
                        res.send(`${[req.params.id]} is complete delete item.`)
        
                    } else {
                        console.log(err)
                    }
                })
            })
        })        

app.listen(port, () => 
    console.log("listen on port : ?", port)
    )