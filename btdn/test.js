const express = require('express');
const router = express.Router();
const body_parser = require('body-parser');
const dotenv = require('dotenv');
const querystring = require("querystring");
dotenv.config();
const mysql = require('mysql');
const sql_helper = require('./sqlhelper');
const uuid = require('uuid-random');
const handler = require('express-validator'); 
const md5 = require('md5');
const request = require('request-promise');
const { body } = require('express-validator');
const con = sql_helper.connection1();
const con2 = sql_helper.connection();
const con3 = sql_helper.connection2();
const tokens = require('./token');
const util = require('util');
const fs = require('fs');
router.use(express.json());
const auth = require('./auth');
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
router.use(body_parser.urlencoded({extended:false}));


router.post("/notification_fetch",[handler.check('token').isString().isLength({min:10})],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(442).send({response:"Invalid Data"});


    }
    else
    {
        let token = req.body.token;
        let data = {};
        var options = {method:'POST',uri:"http://localhost:1112/tokens/normal1",form:{token:token},headers:{'content-type': 'application/x-www-form-urlencoded'}};
        request(options).then((body)=>
        {
            console.log(body);
            data = JSON.parse(body);
            console.log(data);
            if(data.result)
            {
                //const table  = "player_notification_"+data.id;
                const query = mysql.format("SELECT*FROM scout_notification");
                con.query(query,(err,response)=>
                {
                    if(err)
                    {
                        throw err;

                    }
                    else
                    {
                        return res.status(200).send(response);

                    }
                })
            }
            else
            {
                return res.status(200).send({response:"0"});

            }
        });


    }
})
router.post("/register",[handler.check('type').isString().escape(),handler.check('firstname').isString().escape().withMessage("Only Alphabetical Characters Allowed"),handler.check('lastname').isString().escape().withMessage("Only Alphabetical Characters Allowed"),handler.check('number').isNumeric().withMessage("Only Numbers Are Allowed").isLength({min:3}),handler.check('email').isEmail().withMessage("Only Email Allowed").isLength({min:3}),handler.body('ccode').isNumeric().withMessage("Only Codes Are Allowed").isLength({min:1}),handler.check('password').isString().withMessage("Only Password Allowed").isLength({min:3})],(req,res)=>
{
     const error_data = handler.validationResult(req);
    if(!error_data.isEmpty())
    {
        return res.status(200).send({errors:error_data.array()});
    }
    else
    {
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const number = req.body.number;
        const email = req.body.email;
        const address = "Unavailable";
        const ccode = req.body.ccode;
        const password = req.body.password;
        const e4 = uuid();
        const type = req.body.type;
        const new_check = md5(password+e4);
        const check = mysql.format("SELECT*FROM players where email = ? OR phone = ?",[email,number]);
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = mm + '/' + dd + '/' + yyyy;
        let today1 = new Date(today);
        var result = new Date(today);
        let days = 3;
        result.setDate(result.getDate() + days);
        const new_date = result;
        const uid21 = uuid();
        let d = new Date();
        let n = d.getTime();
        let time = n;
        con.query(check,(err,response)=>
        {
            if(err)
            {
                throw err;
            }
            else
            {
                if(response.length>0)
                {
                    return res.status(200).send({response:"2"});
                }
                else
                {
                    const insert_data = mysql.format("INSERT INTO players(name,lastname,phone,email,address,password,type,confirmation,e1,e2,e3,e4,e5,e6,p1,d1,d2,c1,v1,f1,fs,fe) values(?,?,?,?,?,?,'0','0',?,'0','0',?,?,?,'0','0','0','0','0','0',?,?)",[firstname,lastname,number,email,address,new_check,ccode,e4,type,"0",today1,new_date]);
                    con.beginTransaction((err98)=>
                    {
                        if(err98)
                        {
                        throw err98;
                        }
                        else
                        {
                            con.query(insert_data,(error,response)=>
                            {
                                if(error)
                                {
                                    throw error;

                                }
                                else
                                {
                                      const id = response.insertId;
                                        const user_search = 'user_search_'+id;
                                        const user_profile = 'user_profile_'+id;
                                        const user_projects = 'user_projects_'+id;
                                        const user_story = 'user_story_'+id;
                                        const user_cart = 'user_cart_'+id;
                                        const user_order = 'user_order_'+id;
                                        const notification = 'player_notification_'+id;
                                        const logs = 'player_logs_'+id;
                                        const table0 = mysql.format("CREATE TABLE ??(id  INT(11) primary key AUTO_INCREMENT,notification VARCHAR(1000),status1 VARCHAR(100),status2 VARCHAR(100),type VARCHAR(100),attachment VARCHAR(100),name VARCHAR(200),fid VARCHAR(100),uid VARCHAR(100),extra VARCHAR(150),data VARCHAR(150),e1 VARCHAR(150),e2 VARCHAR(150),e3 VARCHAR(150))",[notification]);
                                      const table1 = mysql.format("CREATE TABLE ??(id INT(12) primary key AUTO_INCREMENT,dob VARCHAR(100),hometown VARCHAR(100),currenttown VARCHAR(100),district VARCHAR(100),school VARCHAR(100),exschool VARCHAR(100),best VARCHAR(500),favsport VARCHAR(100),favsinger VARCHAR(100),company VARCHAR(100),hobby VARCHAR(800),innovater VARCHAR(100),interest VARCHAR(100),innovation VARCHAR(100))",[user_search]);
                                      const table2 = mysql.format("CREATE TABLE ??(id INT(12) primary key AUTO_INCREMENT,name VARCHAR(100),last VARCHAR(100),mid VARCHAR(100),api VARCHAR(100),phone VARCHAR(100),email VARCHAR(100),location VARCHAR(100),bio VARCHAR(2000),times VARCHAR(1000),login VARCHAR(100),cover VARCHAR(100))",[user_profile]);
                                    const table3 = mysql.format("CREATE TABLE ??(id INT(12) primary key AUTO_INCREMENT,uid VARCHAR(100),title VARCHAR(2000),description VARCHAR(2000),mid VARCHAR(100),api VARCHAR(100),type VARCHAR(100),date VARCHAR(100),time VARCHAR(100),extra_info VARCHAR(2000),cover VARCHAR(1000))",[user_projects]);
                                    const table4 = mysql.format("CREATE TABLE ??(id INT(12) primary key AUTO_INCREMENT,uid VARCHAR(100),title VARCHAR(2000),description VARCHAR(2000),mid VARCHAR(100),api VARCHAR(100),type VARCHAR(100),date VARCHAR(100),time VARCHAR(100),extra_info VARCHAR(2000),cover VARCHAR(1000))",[user_story]);  
                           const table5 = mysql.format("CREATE TABLE ??(id INT(12) primary key AUTO_INCREMENT,name VARCHAR(200), stock VARCHAR(300) ,nop VARCHAR(200),description VARCHAR(2000),e1 VARCHAR(500),e2 VARCHAR(500),e3 VARCHAR(5000),e4 VARCHAR(500),category VARCHAR(500),lid VARCHAR(100),sid VARCHAR(100))",[user_cart]);
                            const table6 = mysql.format("CREATE TABLE ??(id INT(12) primary key AUTO_INCREMENT,name VARCHAR(200), stock VARCHAR(300) ,nop VARCHAR(200),description VARCHAR(2000),e1 VARCHAR(500),e2 VARCHAR(500),e3 VARCHAR(5000),e4 VARCHAR(500),category VARCHAR(500),lid VARCHAR(100),sid VARCHAR(100),e5 VARCHAR(2000),e6 VARCHAR(1000),e7 VARCHAR(1000),e8 VARCHAR(1000))",[user_order]);
                            const table7 = mysql.format("CREATE TABLE ?? (uid varchar(500) primary key,date varchar(500),time varchar(500),ip varchar(500),user_agent varchar(500),e1 varchar(500),e2 varchar(500))",[logs]);
                        con.query(table1,(error1,response1)=>
                        {
                            if(error1)
                            {
                                       con.rollback((rerr1)=>
                                       {
                                           if(rerr1)
                                           {
                                               throw rerr1;
                                           }
                                           else
                                           {
                                               return res.status(500);
                                           }
                                       });
                            }
                            else
                            {
                                con.query(table2,(error2,response2)=>
                                {
                                    if(error2)
                                    {
                                        con.rollback((rerr2)=>
                                        {
                                            if(rerr2)
                                            {
                                                throw rerr2;
                                            }
                                            else
                                            {
                                                return res.status(500);
                                            }

                                        })
                                    }
                                    else
                                    {
                                        con.query(table3,(error3,response3)=>
                                        {
                                            if(error3)
                                            {
                                                con.rollback((rerr3)=>
                                                {
                                                    if(rerr3)
                                                    {
                                                        throw rerr3;
                                                    }
                                                    else
                                                    {
                                                        return res.status(500);
                                                    }
        
                                                })
                                            }
                                            else
                                            {
                                                con.query(table4,(error4,response4)=>
                                {
                                    if(error4)
                                    {
                                        con.rollback((rerr4)=>
                                        {
                                            if(rerr4)
                                            {
                                                throw rerr4;
                                            }
                                            else
                                            {
                                                return res.status(500);
                                            }

                                        })
                                    }
                                    else
                                    {
                                        con.query(table5,(error5,response5)=>
                                {
                                    if(error5)
                                    {
                                        con.rollback((rerr5)=>
                                        {
                                            if(rerr5)
                                            {
                                                throw rerr5;
                                            }
                                            else
                                            {
                                                return res.status(500);
                                            }

                                        })
                                    }
                                    else
                                    {
                                        con.query(table6,(error6,response6)=>
                                {
                                    if(error6)
                                    {
                                        con.rollback((rerr6)=>
                                        {
                                            if(rerr6)
                                            {
                                                throw rerr6;
                                            }
                                            else
                                            {
                                                return res.status(500);
                                            }

                                        })
                                    }
                                    else
                                    {
                                        con.query(table0,(error9,response9)=>
                                        {
                                            if(error9)
                                            {
                                                throw error9;

                                            }
                                            else
                                            {
                                                con.query(table7,(error10,response10)=>
                                                {
                                                    if(error10)
                                                    {
                                                        con.rollback((rerr6)=>
                                        {
                                            if(rerr6)
                                            {
                                                throw rerr6;
                                            }
                                            else
                                            {
                                                return res.status(500);
                                            }

                                        })
                                                    }
                                                    else
                                                    {
                                                        return res.status(200).send({response:"1",token:"null"})
                                                    }

                                                })

                                            }
                                        })
                                    }
                                })
                                    }
                                })
                                    }
                                })
                                            }
                                        })
                                    }
                                })

                            }

                        })
                                }
                            })
                        }

                    })
                }


            }
        });
    }

}
);

router.post("/carrier",[handler.check('token').isString().isLength({min:5}),handler.check('position').isAlpha().isLength({min:3}),handler.check('club').isAlpha().isLength({min:3}),handler.check('from').isString(),handler.check('to').isString().isLength({min:3})],(req,res)=>
{
    let data555 =[]; 
    const result  = handler.validationResult(req);
    if(!result.isEmpty())
    {
        res.status(401).json(result.array());
    } 
    else
    {
        const token = req.body.token;
        const position = req.body.position;
        const club = req.body.club;
        const from = req.body.from;
        const to = req.body.to;
        let data = {};
        var options = {method:'POST',uri:"http://localhost:1112/tokens/normal1",form:{token:token},headers:{'content-type': 'application/x-www-form-urlencoded'}};
        request(options).then((body)=>
        {
            console.log(body);
            data = JSON.parse(body);
            console.log(data);
            if(data.result)
            {
                const id = data.id;
                const table = "user_profile_"+id;
                let insert_query = mysql.format("INSERT INTO ??(name,last,mid,api,phone,email,location,bio,times,login,cover) values(?,?,?,?,'0','0','0','0','0','0','0')",[table,position,club,from,to]);
                con.query(insert_query,(error,response)=>
                {
                    if(error)
                    {
                        res.status(500).json({response:"0"});
                        throw error;
     
                    }
                    else
                    {
                        res.status(200).json({response:"1"});
     
                    }
                })
     
            } 
            else
            {
                return res.status(401).send("Access Denied");
     
            }
        
        }).catch((err)=>
        {
            console.log(err);
        })
        console.log(data.result); 
    }

});

router.post('/delete_carrier',[handler.check('cid').isNumeric().isLength({min:1}),handler.check('token').isString().isLength({min:3})],(req,res)=>
{
    const result = handler.validationResult(req);
    if(!result.isEmpty())
    {
        res.status(442).send({response:result.array()})
    }
    else
    {
        const cid = req.body.cid;
        const tokens = req.body.token;
        let data = {};
        var options = {method:'POST',uri:"http://localhost:1112/tokens/normal1",form:{token:tokens},headers:{'content-type': 'application/x-www-form-urlencoded'}};
        request(options).then((body)=>
        {
            data = JSON.parse(body);
            if(data.result)
            {
                const id = data.id;
                const table = "user_profile_"+id;
                const delete_query = mysql.format("DELETE FROM ?? where id = ?",[table,cid]);
                con.query(delete_query,(error,response)=>
                {
                    if(error)
                    {
                        res.status(500).json({response:"2"});
                        throw error;
                    }
                    else
                    {
                        res.status(200).send({response:1});
                    }
                })
    
            }
            else
            {
                res.status(401).json({response:2});
            }  



        
        }).catch((err)=>
        {
            console.log(err);
        })
    }
})

router.post("/edit",[handler.check('token').isString().isLength({min:5}),handler.check('type').isAlpha().isLength({min:5}),handler.check('value').isString().isLength({min:2})],(req,res)=>
{
    const result = handler.validationResult(req);
    if(!result.isEmpty())
    {
        res.status(442).send({response:"Please Input Valid Data"});

    }
    else
    {
        const token = req.body.token;
        const value = req.body.value;
        const type= req.body.type;
        let data = {};
        var options = {method:'POST',uri:"http://localhost:1112/tokens/normal1",form:{token:token},headers:{'content-type': 'application/x-www-form-urlencoded'}};
        request(options).then((body)=>
        {
            console.log(body);
            data = JSON.parse(body);
            console.log(data);
            if(data.result)
            {
                const id = data.id;
                const table = "user_search_"+id;
                if(type==="dob")
                {
                    let sql = mysql.format("UPDATE ?? SET ?? = ?",[table,type,value]);
                    con.query(sql,(error,response)=>
                    {
                        if(error)
                        {
                            res.status(500).send({response:2})
                            throw error;
                        }
                        else
                        {
                            res.status(200).json({response:1});
                        }
                    })
    
                } 
                else if(type==="age")
                {
                    let type1 = "company";
                    let sql = mysql.format("UPDATE ?? SET ?? = ?",[table,type1,value]);
                    con.query(sql,(error,response)=>
                    {
                        if(error)
                        {
                            res.status(500).send({response:2})
                            throw error;
                        }
                        else
                        {
                            res.status(200).json({response:1});
                        }
                    })
    
                }
                else if(type==="nationality")
                {
                    let type1 = "hometown";
                    let sql = mysql.format("UPDATE ?? SET ?? = ?",[table,type1,value]);
                    con.query(sql,(error,response)=>
                    {
                        if(error)
                        {
                            res.status(500).send({response:2})
                            throw error;
                        }
                        else
                        {
                            res.status(200).json({response:1});
                        }
                    })
    
                }
                else if(type==="position")
                {
                    let type1 = "currenttown";
                    let sql = mysql.format("UPDATE ?? SET ?? = ?",[table,type1,value]);
                    con.query(sql,(error,response)=>
                    {
                        if(error)
                        {
                            res.status(500).send({response:2})
                            throw error;
                        }
                        else
                        {
                            res.status(200).json({response:1});
                        }
                    })
    
                }
                else if(type==="height")
                {
                    let type1 = "district";
                    let sql = mysql.format("UPDATE ?? SET ?? = ?",[table,type1,value]);
                    con.query(sql,(error,response)=>
                    {
                        if(error)
                        {
                            res.status(500).send({response:2})
                            throw error;
                        }
                        else
                        {
                            res.status(200).json({response:1});
                        }
                    })
    
                }
                else if(type==="weight")
                {
                    let type1 = "school";
                    let sql = mysql.format("UPDATE ?? SET ?? = ?",[table,type1,value]);
                    con.query(sql,(error,response)=>
                    {
                        if(error)
                        {
                            res.status(500).send({response:2})
                            throw error;
                        }
                        else
                        {
                            res.status(200).json({response:1});
                        }
                    })
    
                }
                else if(type==="team")
                {
                    let type1 = "exschool";
                    let sql = mysql.format("UPDATE ?? SET ?? = ?",[table,type1,value]);
                    con.query(sql,(error,response)=>
                    {
                        if(error)
                        {
                            res.status(500).send({response:2})
                            throw error;
                        }
                        else
                        {
                            res.status(200).json({response:1});
                        }
                    })
    
                }
                else if(type==="jersey")
                {
                    let type1 = "best";
                    let sql = mysql.format("UPDATE ?? SET ?? = ?",[table,type1,value]);
                    con.query(sql,(error,response)=>
                    {
                        if(error)
                        {
                            res.status(500).send({response:2})
                            throw error;
                        }
                        else
                        {
                            res.status(200).json({response:1});
                        }
                    })
    
                }
                else if(type==="skills")
                {
                    let type1 = "favsport";
                    let sql = mysql.format("UPDATE ?? SET ?? = ?",[table,type1,value]);
                    con.query(sql,(error,response)=>
                    {
                        if(error)
                        {
                            res.status(500).send({response:2})
                            throw error;
                        }
                        else
                        {
                            res.status(200).json({response:1});
                        }
                    })
    
                }
                else if(type==="about")
                {
                    let type1 = "favsinger";
                    let sql = mysql.format("UPDATE ?? SET ?? = ?",[table,type1,value]);
                    con.query(sql,(error,response)=>
                    {
                        if(error)
                        {
                            res.status(500).send({response:2})
                            throw error;
                        }
                        else
                        {
                            res.status(200).json({response:1});
                        }
                    })
    
                }
            }
            else
            {
                res.status(401).send({response:2});
    
            }
        
        }).catch((err)=>
        {
            console.log(err);
        })
        
    }
})
router.post('/profile_insert',[handler.check('dob').isString().escape(),handler.check('position').isString(),handler.check('nation').isString().isLength({min:1}),handler.check('current_team').isString().escape(),handler.check('about').isString().escape(),handler.check('token').isString().escape()],(req,res)=>
{
    const check_result = handler.validationResult(req);
    if(!check_result.isEmpty())
    {
        res.status(200).send(check_result.array());
    }
    else
    {
        const token = req.body.token;
        let data = {};
        var options = {method:'POST',uri:"http://localhost:1112/tokens/normal1",form:{token:token},headers:{'content-type': 'application/x-www-form-urlencoded'}};
        request(options).then((body)=>
        {
            console.log(body);
            data = JSON.parse(body);
            console.log(data);
            if(data.result)
            {
                const dob = req.body.dob;
                const nation = req.body.nation;
                const position = req.body.position;
                const height = "Unset";
                const weight = "Unset";
                const current_team = req.body.current_team;
                const jersey_number = "Unset";
                const skills = "Unset";
                const about = req.body.about;
                const bio ="Unset";
                const experience = "Unset";
                const id = data.id;
                const address = req.body.address;
                const table = "user_search_"+id;
                let insert_query = mysql.format("INSERT INTO ??(dob,hometown,currenttown,district,school,exschool,best,favsport,favsinger,company,hobby,innovater,interest,innovation) values(?,?,?,?,?,?,?,?,?,?,?,?,?,'0')",[table,dob,nation,position,height,weight,current_team,jersey_number,skills,about,bio,'0',address,experience]);
                con.query(insert_query,(error,response)=>
                {
                    if(error)
                    {
                        res.status(500).json({response:0});
                    }
                    else
                    {
                        res.status(200).send({response:1});
                    }
                })
            }
            else
            {
                res.status(401).send("Un Authorize Access");
            }
        }).catch((err)=>
        {
            console.log(err);
        })
    }
});
router.post('/fetch_carrier',[handler.check('token').isString().isLength({min:3})],(req,res)=>
{
    const result = handler.validationResult(req);
    if(!result.isEmpty())
    {
        res.status(200).send({response:result.array()})
    }
    else
    {
        const tokens = req.body.token;
        let data = {};
        var options = {method:'POST',uri:"http://localhost:1112/tokens/normal1",form:{token:tokens},headers:{'content-type': 'application/x-www-form-urlencoded'}};
        request(options).then((body)=>
        {
            data = JSON.parse(body);
            if(data.result)
            {
                const id = data.id;
                const table = "user_profile_"+id;
                const query = mysql.format("SELECT*FROM ??",[table]);
                con.query(query,(error,response)=>
                {
                    if(error)
                    {
                        throw error;
                    }
                    else
                    {
                        res.status(200).send(response);
                    }
                })
            }
            else
            {
                res.status(401).send({response:"0"});
            }

        });
    }
});






router.post('/profile_giver1',[handler.check('token').isString().isLength({min:5})],(req,res)=>
{
    const check_result = handler.validationResult(req);
    if(!check_result.isEmpty())
    {
        res.status(442).send("Wrong Input");

    }
    else
    {


        let token = req.body.token;
        let data = {};
        var options = {method:'POST',uri:"http://localhost:1112/tokens/normal1",form:{token:token},headers:{'content-type': 'application/x-www-form-urlencoded'}};
        request(options).then((body)=>
        {
            console.log(body);
            data = JSON.parse(body);
            console.log(data);
            if(data.result)
            {
                const id = data.id;
                console.log(id);
                let player_query = mysql.format("SELECT*FROM players where id = ?",[id]);
                const story ="user_story_"+id;
                let profile_query = mysql.format("SELECT*FROM ?? where title = 'profile'",[story]); 
                let cover_query = mysql.format("SELECT*FROM ?? where title = 'cover'",[story]);
                const search = "user_search_"+id;
                let search_query= mysql.format("SELECT*FROM ??",[search]);
                let length,profile1,length1,cover1,length2,length3;
                con.query(profile_query,(error,response0)=>
                {
                    if(error)
                    {
                        res.status(500).json({response:2});
                          throw error;
                    }
                    else
                    {
                        if(response0.length>0)
                        {
                             length = response0.length;
                             profile1 = response0[l-1].cover;
    
                        }
                        else
                        {
                             profile1 = "empty";
    
                        }
                           
                        con.query(cover_query,(error1,response1)=>
                {
                    if(error1)
                    {
                        res.status(500).json({response:0});
    
                    }
                    else
                    {
                        if(response1.length>0)
                        {
                             length1 = response1.length;
                             cover1 = response1[l-1].cover;
    
                        }
                        else
                        {
                             cover1 = "empty";
    
                        }
    
                        con.query(search_query,(error2,response3)=>
                        {
                            if(error2)
                            {
                                res.status(500).send({response:"0"});
                            }
                            else
                            {
                                 length2 = response3.length;
                                if(length2>0)
                                {
                                    length2 = length2-1;
    
                                }
                                else
                                {
                                    length2 = 0;
                                }
                                console.log(length2);
                                if(response3.length==0)
                                {
                                    const send = {id:data.id,name:data.name,last:data.last,email:data.email,phone:data.phone,ccode:data.ccode,address:data.address,e2:data.e2,e3:data.e3,e4:data.e4,e5:data.e5,e6:data.e6,profile:data.profile,cover:data.cover,dob:"0",nationality:"0",position:"0",height:"0",weight:"0",current_team:"0",jersey_number:"0",skills:"0",about:"0",bio:"0",contact:"0",experience:"0",address:"0"};
                                          return res.status(200).send(send);
                                }
                                else
                                {
                                    const send = {id:data.id,name:data.name,last:data.last,email:data.email,phone:data.phone,ccode:data.ccode,address:data.address,e2:data.e2,e3:data.e3,e4:data.e4,e5:data.e5,e6:data.e6,profile:data.profile,cover:data.cover,dob:response3[length2].dob,nationality:response3[length2].hometown,position:response3[length2].currenttown,height:response3[length2].district,weight:response3[length2].school,current_team:response3[length2].exschool,jersey_number:response3[length2].best,skills:response3[length2].favsport,about:response3[length2].favsinger,bio:response3[length2].company,contact:response3[length2].hobby,experience:response3[length2].innovater,address:response3[length2].interest};
                                    return res.status(200).send(send);
                                }
                            }
                        })
              }
                })
                    }
                })
            }
            else
            {
                res.status(401).send("UnAuthorize Access");
            }
        }).catch((err)=>
        {
            console.log(err);
        })
    }
})
router.post("/media_giver",[handler.check('token').isAlphanumeric().isLength({min:3}),handler.check('id').isNumeric().isLength({min:3})],(req,res)=>
{
   const data_new = handler.validationResult(req);
   if(!data_new.isEmpty())
   {
       return res.status(442).send({response:"Invalid Data"});
   }
   else
   {
       const token = req.body.token;
       const pid = req.body.pid;
       let check = false;
       const data1 = tokens.token(token);
       let data = {};
       var options = {method:'POST',uri:"http://localhost:1112/tokens/normal1",form:{token:token},headers:{'content-type': 'application/x-www-form-urlencoded'}};
       request(options).then((body)=>
       {
           console.log(body);
           data = JSON.parse(body);
           console.log(data);
       const table = "user_story"+pid;
       const query = mysql.format("SELECT*FROM ?? where title!='cover' or title!='profile'",[table]);
       con.query(query,(error,response)=>
       {
           if(error)
           {
               throw error;
           }
           else
           {
               res.status(200).send(response);
           }
       })  
       }).catch((err)=>
       {
           console.log(err);
       })

    }
})






router.post("/photoapi",[handler.check('token').isAlphanumeric().isLength({min:3}),handler.check('id').isNumeric().isLength({min:3})],(req,res)=>
{
   const data_new = handler.validationResult(req);
   if(!data_new.isEmpty())
   {
       return res.status(442).send({response:"Invalid Data"});
   }
   else
   {
       const token = req.body.token;
       const pid = req.body.pid;
       let data = {};
       var options = {method:'POST',uri:"http://localhost:1112/tokens/normal",form:{token:"tukku"},headers:{'content-type': 'application/x-www-form-urlencoded'}};
       request(options).then((body)=>
       {
           console.log(body);
           data = JSON.parse(body);
           console.log(data);
       
       
       }).catch((err)=>
       {
           console.log(err);
       })
       let check = false;
       if(data1.result)
       {
               check = true;
       }
       else
       {
           const data2 = tokens.tokens1(token);
           if(data2.result)
           {
              check = true;
           }
           else
           {
               return res.status(401).send({response:"0",message:"Access Denied"});
           }
       }
   }
   if(check)
   {
       const table = "user_story"+pid;
       const query = mysql.format("SELECT*FROM ?? where title!='cover' or title!='profile'",[table]);
       con.query(query,(error,response)=>
       {
           if(error)
           {
               throw error;
           }
           else
           {
               res.status(200).send(response);
           }
       })
   }
   else
   {

   }
})
router.post("/fetch_notification",[handler.check('token').isAlphanumeric().isLength({min:3})],(req,res)=>
{
     const result = handler.validationResult(req);
     if(!result.isEmpty())
     {
         return res.status(442).send({response:"response"});
     }
     else
     {
         const token = req.body.token;
         const data = tokens.tokens1(token);
         if(data.result)
         {
             const id = data.id;
             const table = "player_notification_"+id;
             const sql_method = mysql.format("SELECT*FROM ??",[table]);
             con.query(sql_method,(error,response)=>
             {
                 if(error)
                 {
                     res.status(500).json({response:"Server Failure"});
                     throw error;
                 }
                 else
                 {
                     return res.status(200).send(response);
                 }
             })
         }
         else
         {
             return res.status(401).send({response:"Access Denied"});
         }
     }
})

router.post('/logout',[handler.check('token').isString().isLength({min:5})],(req,res)=>
{
    const result_data = handler.validationResult(req);
    if(!result_data.isEmpty())
    {
        return res.status(442).send({response:"Invalid Data"});

    
    }
    else
    {
        const token = req.body.token;
        let data = {};
        var options = {method:'POST',uri:"http://localhost:1112/tokens/normal1",form:{token:token},headers:{'content-type': 'application/x-www-form-urlencoded'}};
        request(options).then((body)=>
        {
            console.log(body);
            data = JSON.parse(body);
            console.log(data);
            if(data.result)
            {
                const id = data.id;
                const sql = mysql.format("UPDATE players SET e6 = '0' where id = ?",[id]);
                con.query(sql,(error,response)=>
                {
                    if(error)
                    {
                        res.status(500).send({response:"Failure"});
    
                    }
                    else
                    {
                        res.status(200).send({response:"1"});
                    }
                })
    
             }
            else
            {
                res.status(401).json({response:"Access Denied"});
    
            } 
        
        }).catch((err)=>
        {
            console.log(err);
        })       
    }
})

router.post('/player_data',[handler.check('token').isString().isLength({min:10}),handler.check('pid').isNumeric().isLength({min:1})],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        
       
          return res.status(442).send({response:"Invalid Data"});


    }
    else
    {
        const token = req.body.token;
        let data = {};
        var options = {method:'POST',uri:"http://localhost:1112/tokens/normal1",form:{token:token},headers:{'content-type': 'application/x-www-form-urlencoded'}};
        request(options).then((body)=>
        {
            console.log(body);
            data = JSON.parse(body);
            console.log(data);
        
            if(data.result)
            {


               const pid = req.body.pid;

               const sql = mysql.format("SELECT*FROM players where id = ?",[pid]);
               
                con2.query(sql,(err,response)=>
                {
                    if(err)
                    {
                        throw err;
                    }
                    else
                    {
                        if(response.length>0)
                        {
                            let search = "user_search_"+pid;

                            let search_query= mysql.format("SELECT*FROM ?? where hobby = '1'",[search]);

                            con2.query(search_query,(err1,response3)=>
                            {
                                if(err1)
                                {
                                    throw err1;
                                }
                                else
                                {
                                    let length = 0;
                                    if(response3.length>0)
                                    {
                                 length = response3.length-1;
                                    }

                                     if(response3.length==0)
                                     {
                                        const send = {id:pid,name:response[0].name,last:response[0].lastname,email:response[0].email,phone:response[0].phone,ccode:response[0].e1,address:response[0].address,e2:response[0].e2,e3:response[0].e3,e4:response[0].e4,e5:response[0].e5,profile:response[0].profile,cover:response[0].cover,dob:"Unset",nationality:"Unset",position:"Unset",height:"Unset",weight:"Unset",current_team:"Unset",jersey_number:"Unset",skills:"Unset",about:"Unset",bio:"Unset",contact:"Unset",experience:"Unset",address:"Unset"};
                                        return res.status(200).send(send);

                                     }
                                     else
                                     {
                                        const send = {id:pid,name:response[0].name,last:response[0].lastname,email:response[0].email,phone:response[0].phone,ccode:response[0].e1,address:response[0].address,e2:response[0].e2,e3:response[0].e3,e4:response[0].e4,e5:response[0].e5,profile:response[0].profile,cover:response[0].cover,dob:response3[length].dob,nationality:response3[length].hometown,position:response3[length].currenttown,height:response3[length].district,weight:response3[length].school,current_team:response3[length].exschool,jersey_number:response3[length].best,skills:response3[length].favsport,about:response3[length].favsinger,bio:response3[length].company,contact:response3[length].hobby,experience:response3[length].innovater,address:response3[length].interest};
                                        return res.status(200).send(send);

                                     }
                                }
                            })

                        }
                        else
                        {
                            return res.status(200).send({response:"0"});
                        }
                    }
                })
        }
        else
        {
            return res.status(200).send({response:"0"});

        }
    });

    }
})
router.post('/sorting_all',[handler.check('token').isString().isLength({min:3})],(req,res)=>
{
    let array_data = [];
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"Invalid Data"});

    }
    else
    {
        const token = req.body.token;
        let data = {};
        var options = {method:'POST',uri:"http://localhost:1112/tokens/normal1",form:{token:token},headers:{'content-type': 'application/x-www-form-urlencoded'}};
        request(options).then((body)=>
        {
            console.log(body);
            data = JSON.parse(body);
            console.log(data)
            if(data.result)
            {
                const query = util.promisify(con2.query).bind(con2);
                const query1 = mysql.format("SELECT*FROM players");
                con2.query(query1,async(err,response)=>
                {
                    if(err)
                    {
                        throw err;

                    }
                    else
                    {
                        if(response.length>0)
                        {
                             for (let index = 0; index < response.length; index++) {
                                     const element = response[index];
                               let id = element.id;
                               let table = "user_search_"+id;
                               let query2 = mysql.format("SELECT*FROM ??",[table]);
                               try
                               {
                               let rows = await query(query2);
                               if(rows.length>0)
                               {
                                   let length = rows.length-1;
                                   array_data.push({pid:element.id,name:element.name,lastname:element.lastname,profile:element.profile,status:element.e2,position:rows[length].currenttown,nationality:rows[length].hometown,experience:rows[length].innovater,age:age,height:rows[length].district,weight:rows[length].school});
                               }
                            }
                            catch(error)
                            {
                                throw error;
                            }
                        }
                        return res.status(200).send(array_data);

                    }
            }
        });
    }
            else
            {
                return res.status(200).send({response:"0"});

            }
        });

    }
})

router.post('/sorting',[handler.check('token').isString().isLength({min:3})],(req,res)=>
{
    let array_data = [];
    const query = util.promisify(con2.query).bind(con2);
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({respons:"Invalid Data"});

    }
    else
    {
        const token = req.body.token;
        let data = {};
        var options = {method:'POST',uri:"http://localhost:1112/tokens/normal1",form:{token:token},headers:{'content-type': 'application/x-www-form-urlencoded'}};
        request(options).then((body)=>
        {
            console.log(body);
            data = JSON.parse(body);
            console.log(data);
            if(data.result)
            {
                let date = req.body.date;
                let position = req.body.position;
                let  locality = req.body.locality;
                let experience = req.body.experience;
                console.log(date);
                console.log(position);
                console.log(locality);
                console.log(experience);
                let query1 ="";
                let class1 = req.body.class;
                if(class1==="3")
                {
               query1 = mysql.format("SELECT*FROM players");
                }
                else
                {
                	  query1 = mysql.format("SELECT*FROM players where address = ?",[class1]);
                }
                con2.query(query1,async(err,response)=>
                 {
                     if(err)
                     {
                         throw err;

                     }
                     else
                     {
                         if(response.length>0)
                         {
                              for (let index = 0; index < response.length; index++) {
                                      const element = response[index];
                                let id = element.id;
                                let table = "user_search_"+id;
                                let query2 = mysql.format("SELECT*FROM ?? where hobby='1'",[table]);
                                try
                                {
                                let rows = await query(query2);
                                if(rows.length>0)
                                {
                                    let length = rows.length-1;
                                    let dob = rows[length].dob;
                                    if(date==="7")
                                    {
                                        dob = "12/12/2002";
                                    }
                                    dategiver(dob,(data)=>
                                    {
                                        let age = data;
                                        console.log(age);
                                        if(date==="0")
                                        {
                                            console.log("0");
                                            if(age<17)
                                            {
                                                console.log("17");
                                                if(position==="8")
                                                {
                                                    position = rows[length].currenttown;
                                                }
                                                if(locality==="5")
                                                {
                                                    locality = rows[length].hometown;
                                                }
                                                if(experience==="5")
                                                {
                                                    experience = rows[length].innovater;
                                                }
                                                if(position===rows[length].currenttown)
                                                {

                                                    if(experience===rows[length].innovater)
                                                    {
                                                            if(locality===rows[length].hometown)
                                                            {
                                                        array_data.push({pid:element.id,name:element.name,lastname:element.lastname,profile:element.profile,status:element.e2,position:rows[length].currenttown,nationality:rows[length].hometown,experience:rows[length].innovater,age:age,height:rows[length].district,weight:rows[length].school});
                                                        console.log(array_data);        
                                                    }


                                                    }
                                                }

                                            }
                                        }
                                        else if(date==="1")
                                        {
                                            console.log("1");
                                            if(age==17&&age<=19)
                                            {
                                                console.log("17=19");
                                                if(position==="8")
                                                {
                                                    position = rows[length].currenttown;
                                                }
                                                if(locality==="5")
                                                {
                                                    locality = rows[length].hometown;
                                                }
                                                if(experience==="5")
                                                {
                                                    experience = rows[length].innovater;
                                                }
                                                if(position===rows[length].currenttown)
                                                {

                                                    if(experience===rows[length].innovater)
                                                    {
                                                            if(locality===rows[length].hometown)
                                                            {
                                                                array_data.push({pid:element.id,name:element.name,lastname:element.lastname,profile:element.profile,status:element.e2,position:rows[length].currenttown,nationality:rows[length].hometown,experience:rows[length].innovater,age:age,height:rows[length].district,weight:rows[length].school});
                                                                console.log(array_data); 
                                                            }


                                                    }
                                                }

                                            }

                                        }
                                        else if(age==="2")
                                        {
                                            console.log("2");
                                            if(age==20&&age<=22)
                                            {
                                                console.log("20-22");
                                                if(position==="8")
                                                {
                                                    position = rows[length].currenttown;
                                                }
                                                if(locality==="5")
                                                {
                                                    locality = rows[length].hometown;
                                                }
                                                if(experience==="5")
                                                {
                                                    experience = rows[length].innovater;
                                                }
                                                if(position===rows[length].currenttown)
                                                {

                                                    if(experience===rows[length].innovater)
                                                    {
                                                            if(locality===rows[length].hometown)
                                                            {
                                                            array_data.push({pid:element.id,name:element.name,lastname:element.lastname,profile:element.profile,status:element.e2,position:rows[length].currenttown,nationality:rows[length].hometown,experience:rows[length].innovater,age:age,height:rows[length].district,weight:rows[length].school});

                                                            console.log(array_data); 
                                                            }


                                                    }
                                                }
                                            }


                                        }
                                        else if(date==="3")
                                        {
                                            console.log("3");
                                            if(age==23&& age<=25)
                                            {
                                                console.log("25");
                                                if(position==="8")
                                                {
                                                    position = rows[length].currenttown;
                                                }
                                                if(locality==="5")
                                                {
                                                    locality = rows[length].hometown;
                                                }
                                                if(experience==="5")
                                                {
                                                    experience = rows[length].innovater;
                                                }
                                                if(position===rows[length].currenttown)
                                                {

                                                    if(experience===rows[length].innovater)
                                                    {
                                                            if(locality===rows[length].hometown)
                                                            {
                              array_data.push({pid:element.id,name:element.name,lastname:element.lastname,profile:element.profile,status:element.e2,position:rows[length].currenttown,nationality:rows[length].hometown,experience:rows[length].innovater,age:age,height:rows[length].district,weight:rows[length].school});
                              console.log(array_data); 
                                                            }


                                                    }
                                                }
                                            }
                                        }
                                        else if(date==="4")
                                        {
                                            console.log("4");
                                            if(age==26&&age<=28)
                                            {
                                                if(position==="8")
                                                {
                                                    position = rows[length].currenttown;
                                                }
                                                if(locality==="5")
                                                {
                                                    locality = rows[length].hometown;
                                                }
                                                if(experience==="5")
                                                {
                                                    experience = rows[length].innovater;
                                                }
                                                console.log("26-28");
                                                if(position===rows[length].currenttown)
                                                {

                                                    if(experience===rows[length].innovater)
                                                    {
                                                            if(locality===rows[length].hometown)
                                                            {
                                                   array_data.push({pid:element.id,name:element.name,lastname:element.lastname,profile:element.profile,status:element.e2,position:rows[length].currenttown,nationality:rows[length].hometown,experience:rows[length].innovater,age:age,height:rows[length].district,weight:rows[length].school});
                                                   console.log(array_data); 
                                                            }


                                                    }
                                                }
                                            }
                                        }
                                        else if(date==="5")
                                        {
                                            console.log("5");
                                            if(position==="8")
                                                {
                                                    position = rows[length].currenttown;
                                                }
                                                if(locality==="5")
                                                {
                                                    locality = rows[length].hometown;
                                                }
                                                if(experience==="5")
                                                {
                                                    experience = rows[length].innovater;
                                                }
                                            if(age==29&&age<=31)
                                            {
                                                console.log("29-31");
                                                console.log(position+"=="+rows[length].currenttown);
                                                console.log(locality+"=="+rows[length].hometown);
                                                console.log(experience+"=="+rows[length].innovater);

                                                if(position===rows[length].currenttown)
                                                {


                                                    if(experience===rows[length].innovater)
                                                    {
                                                            if(locality===rows[length].hometown)
                                                            {
                                                                 array_data.push({pid:element.id,name:element.name,lastname:element.lastname,profile:element.profile,status:element.e2,position:rows[length].currenttown,nationality:rows[length].hometown,experience:rows[length].innovater,age:age,height:rows[length].district,weight:rows[length].school});   console.log(array_data);    

                                                                 console.log(array_data); 

                                                            }


                                                    }
                                                }
                                            }
                                        }
                                        else if(date==="6")
                                        {
                                            console.log("6");
                                            if(age>31)
                                            {
                                                if(position==="8")
                                                {
                                                    position = rows[length].currenttown;
                                                }
                                                if(locality==="5")
                                                {
                                                    locality = rows[length].hometown;
                                                }
                                                if(experience==="5")
                                                {
                                                    experience = rows[length].innovater;
                                                }
                                                console.log("31");
                                                if(position===rows[length].currenttown)
                                                {

                                                    if(experience===rows[length].innovater)
                                                    {
                                                            if(locality===rows[length].hometown)
                                                            {
                                              array_data.push({pid:element.id,name:element.name,lastname:element.lastname,profile:element.profile,status:element.e2,position:rows[length].currenttown,nationality:rows[length].hometown,experience:rows[length].innovater,age:age,height:rows[length].district,weight:rows[length].school});
                                              console.log(array_data);                 
                                            
                                            }
                                                    }
                                                }
                                            }
                                        }
                                        else if(date==="7")
                                        {
                                            console.log("7 all");
                                                if(position==="8")
                                                {
                                                    position = rows[length].currenttown;
                                                    console.log(position);
                                                }
                                                if(locality==="5")
                                                {
                                                    locality = rows[length].hometown;
                                                    console.log(locality);
                                                }
                                                if(experience==="5")
                                                {
                                                    experience = rows[length].innovater;
                                                    console.log(experience);
                                                }
                                                console.log("31");
                                                if(position===rows[length].currenttown)
                                                {

                                                    if(experience===rows[length].innovater)
                                                    {
                                                            if(locality===rows[length].hometown)
                                                            {
                                              array_data.push({pid:element.id,name:element.name,lastname:element.lastname,profile:element.profile,status:element.e2,position:rows[length].currenttown,nationality:rows[length].hometown,experience:rows[length].innovater,age:age,height:rows[length].district,weight:rows[length].school});
                                                            
                                              console.log(array_data); 
                                            }
                                                    }
                                                }
                                            
                                        }
                                
                                    })
                                            
                                }
                            }catch(err)
                            {
                                console.log(err);
                            }
                        
                        

                             }
                            
                             return res.status(200).send(array_data);
                         }
                         else
                         {
                             return res.status(200).send({response:"0"});
                         }

                     }
                 })
            }
            else
            {
                return res.status(200).send({response:"0"});

            }
    });
}
    });




function dategiver(date,callback)
{
    var today = new Date();
    console.log(today);
    console.log(date);
            var birthDate = new Date(date);
            var age = today.getFullYear() - birthDate.getFullYear();
            var m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
    console.log("Age of the player is "+age);
    return callback(age);
}


router.post('/player_fetch_carrier',[handler.check('token').isString().isLength({min:3}),handler.check('pid').isNumeric()],(req,res)=>
{
    const result = handler.validationResult(req);
    if(!result.isEmpty())
    {
        res.status(442).send({response:result.array()})
    }
    else
    {
        const tokens = req.body.token;
        let data = {};
        var options = {method:'POST',uri:"http://localhost:1112/tokens/normal1",form:{token:tokens},headers:{'content-type': 'application/x-www-form-urlencoded'}};
        request(options).then((body)=>
        {
            data = JSON.parse(body);
            if(data.result)
            {
                const id = req.body.pid;
                const table = "user_profile_"+id;
                const query = mysql.format("SELECT*FROM ??",[table]);
                con2.query(query,(error,response)=>
                {
                    if(error)
                    {
                        throw error;
                    }
                    else
                    {
                        res.status(200).send(response);
                    }
                })
            }
            else
            {
                res.status(401).send({response:"0"});
            }

        });
    }
});

router.post('/player_profile_giver',[handler.check('token').isString().isLength({min:5}),handler.check('pid').isNumeric()],(req,res)=>
{
    console.log(req.body.token);
    const check_result = handler.validationResult(req);
    if(!check_result.isEmpty())
    {
        res.status(442).send("Wrong Input");

    }
    else
    {


        let token = req.body.token;
        const pid = req.body.pid;

        let data = {};
        var options = {method:'POST',uri:"http://localhost:1112/tokens/normal1",form:{token:token},headers:{'content-type': 'application/x-www-form-urlencoded'}};
        request(options).then((body)=>
        {
            console.log(body);
            data = JSON.parse(body);
            console.log(data);
            if(data.result)
            {
                const id = pid;
                console.log(id);
                let player_query = mysql.format("SELECT*FROM players where id = ?",[id]);
                const story ="user_story_"+id;
                let profile_query = mysql.format("SELECT*FROM ?? where title = 'profile'",[story]); 
                let cover_query = mysql.format("SELECT*FROM ?? where title = 'cover'",[story]);
                const search = "user_search_"+id;
                let search_query= mysql.format("SELECT*FROM ??",[search]);
                let length,profile1,length1,cover1,length2,length3;
                con2.query(profile_query,(error,response0)=>
                {
                    if(error)
                    {
                        res.status(500).json({response:2});
                          throw error;
                    }
                    else
                    {
                        if(response0.length>0)
                        {
                             length = response0.length;
                             profile1 = response0[length-1].cover;
    
                        }
                        else
                        {
                             profile1 = "empty";
    
                        }
                           
                        con2.query(cover_query,(error1,response1)=>
                {
                    if(error1)
                    {
                        throw error1;
                        res.status(500).json({response:0});
    
                    }
                    else
                    {
                        if(response1.length>0)
                        {
                             length1 = response1.length;
                             cover1 = response1[l-1].cover;
    
                        }
                        else
                        {
                             cover1 = "empty";
    
                        }
    
                        con2.query(search_query,(error2,response3)=>
                        {
                            if(error2)
                            {
                                throw error2;
                                res.status(500).send({response:"0"});
                            }
                            else
                            {
                                 length2 = response3.length;
                                if(length2>0)
                                {
                                    length2 = length2-1;
    
                                }
                                else
                                {
                                    length2 = 0;
                                }
                                console.log(length2);
                                con2.query(player_query,(error0,data)=>
                                {
                                    if(error0)
                                    {
                                        throw error0;
                                    }

                                    if(response3.length==0)
                                    {
                                        const send = {name:data[0].name,last:data[0].lastname,ccode:data[0].e1,address:data[0].address,e2:data[0].e2,profile:data[0].profile,cover:data[0].profile,dob:response3[length2].dob,nationality:"0",position:"0",height:"0",weight:"0",current_team:"0",jersey_number:"0",skills:"0",about:"0",bio:"0",contact:"0",experience:"0",address:"0",main_position:"0",other_position:"0",preferred_position:"0"};
                                              return res.status(200).send(send);
                                    }
                                    else
                                    {
                                        const send = {name:data[0].name,last:data[0].lastname,ccode:data[0].e1,address:data[0].address,e2:data[0].e2,profile:data[0].profile,cover:data[0].cover,dob:response3[length2].dob,nationality:response3[length2].hometown,position:response3[length2].currenttown,height:response3[length2].district,weight:response3[length2].school,current_team:response3[length2].exschool,jersey_number:response3[length2].best,skills:response3[length2].favsport,about:response3[length2].favsinger,bio:response3[length2].company,contact:response3[length2].hobby,experience:response3[length2].innovater,address:response3[length2].interest,main_position:response3[length2].main_position,other_position:response3[length2].other_position,preferred_position:response3[length2].preferred_position};
                                        return res.status(200).send(send);
                                    }

                                })

                            }
                        })
                    }
                })
                    }
                })
            }
            else
            {
                res.status(401).send("UnAuthorize Access");
            }
        }).catch((err)=>
        {
            console.log(err);
        })
    }
})
router.post("/fetch_sortlist",[handler.check('token').isString()],async(req,res)=>
{
    let array_data = [];
    const query33 = util.promisify(con2.query).bind(con2);
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"Invalid Data"});

    }
    else
    {
        const token = req.body.token;
        let data = {};
        var options = {method:'POST',uri:"http://localhost:1112/tokens/normal1",form:{token:token},headers:{'content-type': 'application/x-www-form-urlencoded'}};
        request(options).then((body)=>
        {
            console.log(body);
            data = JSON.parse(body);
            console.log(data);
            if(data.result)
            {
                const id = data.id;
                const table = "user_projects_"+id;
                const sql = mysql.format("SELECT*FROM ??",[table]);
                  con.query(sql,async (error,rows)=>
                  {
                      if(error)
                      {
                          throw error;
                      }
                      else
                      {
                        if(rows.length>0)
                        {
                        for (let index = 0; index < rows.length; index++) {
                            const element = rows[index];
                            let sql2 = mysql.format("SELECT*FROM players where uid = ?",[element.uid]);
                            let [rows1] = await query33(sql2);
                            try
                            {
                                console.log(rows1);
                             array_data.push({pid:element.uid,check:element.cover,name:element.title,last:element.description,profile:rows1.profile});
                            }
                            catch(err)
                            {
                                console.log(err);
                            }
                            }
                        return res.status(200).send(array_data);
                        }
                        else
                        {
                            return res.status(200).send({response:"Invalid Details"});
                        }
                      }

                  })

            }
            else
            {
                return res.status(200).send({response:"0"});

            }


    });
}
});

router.post("/sortlist",[handler.check('pid').isString(),handler.check("token").isString().escape()],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"Invalid Details"});


    }
    else
    {
        const token = req.body.token;
        let data = {};
        var options = {method:'POST',uri:"http://localhost:1112/tokens/normal1",form:{token:token},headers:{'content-type': 'application/x-www-form-urlencoded'}};
        request(options).then((body)=>
        {
            console.log(body);
            data = JSON.parse(body);
            console.log(data);
            if(data.result)
            {

                const id = data.id;
                const pid = req.body.pid;
                const sql1 = mysql.format("SELECT*FROM players where uid = ?",[pid]);
                con2.query(sql1,(error,response)=>
                {
                    if(error)
                    {
                        throw error;
                    }
                    else
                    {
                        const firstname = response[0].name;
                        const lastname = response[0].lastname;
                        const table = "user_projects_"+id;
                        const sql2 =mysql.format("SELECT*FROM ?? where uid = ?",[table,pid]);
                        con.query(sql2,(err,response)=>
                        {
                            console.log(response,"helllllo")
                            if(err)
                            {
                                throw err;

                            }
                            else
                            {
                                if(response.length>0)
                                {
                                    return res.status(200).send({response:"1"})
                                }
                                else
                                {
                                    const sql1 = mysql.format("INSERT INTO ??(uid,title,description,mid,api,type,date,time,extra_info,cover) values(?,?,?,'0','0','0','0','0','0','0')",[table,pid,firstname,lastname]);
                                    con.query(sql1,(error1,response1)=>
                                    {
                                    if(error1)
                                    {
                                       throw error1;
                                    }
                                    else
                                    {
                                    return res.status(200).send({response:"1"});
                                    }
                                    })

                                }

                            }
                        })
                    }
                })
            }
            else
            {
                return res.status(200).send({response:"0"});
            }
        });






    }
})

router.post("/player_promotion",[handler.check('pid').isNumeric(),handler.check('token').isString().isLength({min:5})],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"Invalid data"});

    }
    else
    {
        const token = req.body.token;
        
        var options = {method:'POST',uri:"http://localhost:1112/tokens/normal1",form:{token:token},headers:{'content-type': 'application/x-www-form-urlencoded'}};
        request(options).then((body)=>
        {
            console.log(body);
            data = JSON.parse(body);
            console.log(data);
        
            let sql = "";
            if(data.result)  
            {
               const plan = data.plan;
               const id = req.body.pid;
               const table = "user_story_"+id;
               if(plan==="0")
               {
                  return res.status(200).send({response:"0"})
               }
               else
               {
                    sql=mysql.format("SELECT*FROM ?? where type='video' AND mid = '6'",[table]);

                   
               }
               con2.query(sql,(error1,response1)=>
               {
                   if(error1)
                   {
                       throw error1;
                   }
                   else
                   {
                       return res.status(200).send(response1);
                   }
               })
            }
            else
            {
                return res.status(200).send({response:"0"})



            }
        
    });
}
})























router.post("/player_media",[handler.check('pid').isNumeric(),handler.check('token').isString().isLength({min:5})],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"Invalid data"});

    }
    else
    {
        const token = req.body.token;
        
        var options = {method:'POST',uri:"http://localhost:1112/tokens/normal1",form:{token:token},headers:{'content-type': 'application/x-www-form-urlencoded'}};
        request(options).then((body)=>
        {
            console.log(body);
            data = JSON.parse(body);
            console.log(data);
        
            let sql = "";
            if(data.result)  
            {
               const plan = data.plan;
               const id = req.body.pid;
               const table = "user_story_"+id;
               if(plan==="1")
               {
                   sql=mysql.format("SELECT*FROM ?? where type='video' AND mid = '0'",[table]);

               }
               else if(plan==="2")
               {
                sql=mysql.format("SELECT*FROM ?? where type='video' AND mid = '0' AND mid='1'",[table]);

               }
               else if(plan==="3")
               {
                sql=mysql.format("SELECT*FROM ?? where type='video' AND mid!='3'",[table]);
               }
               else if(plan==="4")
               {
                sql=mysql.format("SELECT*FROM ?? where type='video'",[table]);
               }
               else
               {
                   return res.status(200).send({response:"0"})
               }
               con2.query(sql,(error1,response1)=>
               {
                   if(error1)
                   {
                       throw error1;
                   }
                   else
                   {
                       return res.status(200).send(response1);
                   }
               })



            }
            else
            {
                return res.status(200).send({response:"0"})



            }
    });
}
})

router.post("/remove_sortlist",[handler.check('pid').isString(),handler.check('token').isString().isLength({min:5})],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"Invalid Details"});


    }
    else
    {
        const token = req.body.token;
        let data = {};
        var options = {method:'POST',uri:"http://localhost:1112/tokens/normal1",form:{token:token},headers:{'content-type': 'application/x-www-form-urlencoded'}};
        request(options).then((body)=>
        {
            console.log(body);
            data = JSON.parse(body);
            console.log(data);
        
            if(data.result)  
            {
                let table = "user_projects_"+data.id;
                let pid = req.body.pid;
                const sql = mysql.format("DELETE FROM ?? where uid = ?",[table,pid]);
                con.query(sql,(err,response)=>
                {
                    if(err)
                    {
                        throw err;
                    }
                    else
                    {
                        return res.status(200).send({response:"1"});

                    }
                })

            
            }
            else
            {
                return res.status(200).send({response:"0"});
            }
        });
    }
});


router.post("/check_player",[handler.check('pid').isNumeric(),handler.check('token').isString().isLength({min:5})],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"Invalid Details"});


    }
    else
    {
        const token = req.body.token;
        
        let data = {};
        var options = {method:'POST',uri:"http://localhost:1112/tokens/normal1",form:{token:token},headers:{'content-type': 'application/x-www-form-urlencoded'}};
        request(options).then((body)=>
        {
            console.log(body);
            data = JSON.parse(body);
            console.log(data);
        
            if(data.result)  
            {
                let table = "user_projects_"+data.id;
                let pid = req.body.pid;
                const sql = mysql.format("SELECT*FROM ?? where uid = ?",[table,pid]);
                con.query(sql,(err,response)=>
                {
                    if(err)
                    {
                        throw err;
                    }
                    else
                    {
                        if(response.length>0)
                        {
                            return res.status(200).send({response:"1"})

                        }
                        else
                        {
                            return res.status(200).send({response:"0"})
                        }

                    }
                })

            
            }
            else
            {
                return res.status(200).send({response:"0"});
            }
        });
    }
});




router.post("/report_giver2",[handler.check('token').isString().isLength({min:3}),handler.check('pid').isNumeric()],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"Invalid Data"});

    }
    else
    {
        
        const token = req.body.token;
        const pid = req.body.pid;
        console.log(token);   
        let data = {};
        var options = {method:'POST',uri:"http://localhost:1112/tokens/normal1",form:{token:token},headers:{'content-type': 'application/x-www-form-urlencoded'}};
        request(options).then((body)=>
        {
            
            data = JSON.parse(body);
            console.log(data);
        
            if(data.result)  
            {
                let plan = data.plan;
                let table = "user_story_"+pid;
                let sql = mysql.format("SELECT*FROM ?? where type='report'",[table]);
                console.log(sql);
                con2.query(sql,(err,response)=>
                {
                    if(err)
                    {
                        throw err;
                    }
                    else
                    {
                        console.log(response.length);
                        if(response.length>0)
                        {
                            let filename = response[response.length-1].cover;
                            let path = "/var/www/digiscoutfootball.com/html/digiscout/uploads/"+filename;
                            if(plan==="1")
                            {
                              return res.status(200).send({response:"0"});
                            }
                            else
                            {
                                let file = fs.createReadStream(path);
                                let stat = fs.statSync(path);
                                res.setHeader('Content-Length',stat.size);
                                res.setHeader('Content-Type','application/pdf');
                                res.setHeader('Content-Disposition','attachment; filename=report.pdf');
                                file.pipe(res);
                            }
                        }
                        else
                        {
                            return res.status(200).send({response:"empty"});
                        }
                    }
                })
            }
            else
            {
                return res.status(200).send({response:"empty"});
           }
});
    }
})

router.post("/show_all",[handler.check('token').isString()],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(400).send({message:"Invalid Input"})
    }
    else
    {
        let checking = false;
        const query3 = util.promisify(con2.query).bind(con2);
        const token = req.body.token;
        //const filter = req.body.filter;
        auth.cmauth(token,(data)=>
        {
            console.log(data);
            if(data.response)
            {
                let query = "";
                let id = data.uid;
                if(data.p1==="1")
                {
                     query= mysql.format("SELECT*FROM players");
                }
                else
                {
                    query= mysql.format("SELECT*FROM players where vi='1'");
  }
                con.query(query,async(err,response)=>
                {
                    if(err)
                    {
                        throw err;
                    }
                    else
                    {
                        const new_array = [];

                        for (let index = 0; index < response.length; index++) {
                            const element = response[index];
                            let pid = element.uid;
                            let query1 = mysql.format("SELECT*FROM user_search where pid = ?",[pid]);
                            let rows = await query3(query1);
                             checking = false;

                                        if(rows.length>0)
                                        {
                                            let table = "user_projects_"+id;
                                            let query2 = mysql.format("SELECT*FROM ?? where uid = ?",[table,pid]);
                                            con2.query(query2,(err4,response4)=>
                                            {
                                                if(err4)
                                                {
                                                    throw err4;
                                                }
                                                else
                                                {
                                                    if(response4.length>0)
                                                    {
                                                        checking = true;

                                                    }
                                                }
                                            })
                                        new_array.push({element,main:rows[rows.length-1].main_position,preferred:rows[rows.length-1].preferred_position,other_position:rows[rows.length-1].other_position,sorted:checking});
                                        }
                                        else
                                        {
                                            new_array.push({element,main:"0",preferred:"0",other:"0",sorted:checking});
                                        }
                        }
                        return res.status(200).send(new_array);
                    }
                    })

            }
            else
            {
                return res.status(200).send({response:"0"})

            }
        });

    }
})
router.post("/carrier_fetch",[handler.check('token').isString().escape(),handler.check('pid').isString().escape()],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(400).send({response:"Invalid Input"})

    }
    else
    {
        const token = req.body.token;
        const pid = req.body.pid;
        auth.cmauth(token,(data)=>
        {
            if(data.response)
            {

                const query = mysql.format("SELECT*FROM profile where pid = ?",[pid]);
                con2.query(query,(err,response)=>
                {
                    if(err)
                    {
                        throw err;
                    }
                    else
                    {
                        return res.status(200).send(response);
                    }
                })
            }
            else
            {
                return res.status(200).send({response:"0",message:"Invalid Token"})

            }
        })

    }

})

router.post('/profile_giver',[handler.check('token').isString().isLength({min:5}),handler.check('pid').isString().escape()],(req,res)=>
{
    const check_result = handler.validationResult(req);
    if(!check_result.isEmpty())
    {
        res.status(442).send("Wrong Input");
    }
    else
    {
        let token = req.body.token;
        let pid = req.body.pid;
        auth.cmauth(token,(data)=>
        {
            if(data.response)
            {
                const id = pid;
                let player_query = mysql.format("SELECT*FROM players where uid = ?",[id]);
                const story ="story"
                let profile_query = mysql.format("SELECT*FROM story where title = 'profile' AND pid = ?",[pid]); 
                let cover_query = mysql.format("SELECT*FROM story where title = 'cover' AND pid = ?",[pid]);
                const search = "user_search";
                let search_query= mysql.format("SELECT*FROM ?? where hobby = '0' AND pid = ? ORDER BY timestamp",[search,pid]);
                let length,profile1,length1,cover1,length2,length3;
                con2.query(profile_query,(error,response0)=>
                {
                    if(error)
                    {
                        res.status(500).json({response:2});
                          throw error;
                    }
                    else
                    {
                        if(response0.length>0)
                        {
                             length = response0.length;
                             profile1 = response0[length-1].cover;
                        }
                        else
                        {
                             profile1 = "empty";
                        }
                        con2.query(cover_query,(error1,response1)=>
                {
                    if(error1)
                    {
                        res.status(500).json({response:0});
                    }
                    else
                    {
                        if(response1.length>0)
                        {
                             length1 = response1.length;
                             cover1 = response1[length1-1].cover;
                        }
                        else
                        {
                             cover1 = "empty";
                        }
                        con2.query(search_query,(error2,response3)=>
                        {
                            if(error2)
                            {
                                res.status(500).send({response:"0"});
                            }
                            else
                            {
                                 length2 = response3.length;
                                if(length2>0)
                                {
                                    length2 = length2-1;
                                }
                                else
                                {
                                    length2 = 0;
                                }
                                console.log(length2);
                                    con2.query(player_query,(err,responseplayer)=>
                                    {
                                        console.log(responseplayer,"Hello");
                                        if(err)
                                        {
                                            throw err;
                                        }
                                        else
                                        {
                                            if(response3.length===0)
                                        {
                                            const send = {id:id,name:responseplayer[0].name,vi:responseplayer[0].vi,last:responseplayer[0].lastname,email:responseplayer[0].email,phone:responseplayer[0].phone,address:responseplayer[0].address,e2:responseplayer[0].e2,e3:responseplayer[0].e3,e4:responseplayer[0].e4,e5:responseplayer[0].e5,e6:responseplayer[0].e6,profile:responseplayer[0].profile,cover:responseplayer[0].cover,dob:"0",nationality:"0",position:"0",height:"0",weight:"0",current_team:"0",jersey_number:"0",skills:"0",about:"0",bio:"0",experience:"0",main_position:"0",other_position:"0",preferred_position:"0",extracontact:"0",newid:"0"};
                                            return res.status(200).send(send);
                                        }
                                        else
                                        {
                                            const send = {id:id,name:responseplayer[0].name,last:responseplayer[0].lastname,vi:responseplayer[0].vi,email:responseplayer[0].email,phone:responseplayer[0].phone,address:responseplayer[0].address,e2:responseplayer[0].e2,e3:responseplayer[0].e3,e4:responseplayer[0].e4,e5:responseplayer[0].e5,e6:responseplayer[0].e6,profile:responseplayer[0].profile,cover:responseplayer[0].cover,dob:response3[response3.length-1].dob,nationality:response3[response3.length-1].hometown,position:response3[response3.length-1].currenttown,height:response3[response3.length-1].district,weight:response3[response3.length-1].school,current_team:response3[response3.length-1].exschool,jersey_number:response3[response3.length-1].best,skills:response3[response3.length-1].favsport,about:response3[response3.length-1].favsinger,bio:response3[response3.length-1].company,experience:response3[response3.length-1].innovater,address:response3[response3.length-1].interest,main_position:response3[response3.length-1].main_position,other_position:response3[response3.length-1].other_position,preferred_position:response3[response3.length-1].preferred_position,extracontact:response3[response3.length-1].extra_contact,newid:response3[response3.length-1].newid};
                                            return res.status(200).send(send);
                                        }
                                        }
                                    })
                            }
                        })
                    }
                })
                    }
                })

            }
            else
            {
                return res.status(200).send({response:"0",message:"Invalid Token"});
            }
        })
    }
});

router.post("/player_video",[handler.check('token').isString().isLength({min:5}),handler.check('pid').isString().escape()],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"Invalid data"});

    }
    else
    {
        const token = req.body.token;
        const pid = req.body.pid;
        auth.cmauth(token,(body)=>
        {
            let sql = "";
            if(body.response)
            {
               const id = pid;
                const table = "story";
                        sql=mysql.format("SELECT*FROM ?? where type='video' AND pid = ?",[table,pid]);
               con2.query(sql,(error1,response1)=>
               {
                   if(error1)
                   {
                       throw error1;
                   }
                   else
                   {
                       return res.status(200).send(response1);
                   }
               })
            }
            else
            {
                return res.status(200).send({response:"0"})



            }
    });
}
})

router.post("/player_image",[handler.check('token').isString().isLength({min:5}),handler.check('pid').isString().escape()],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"Invalid data"});

    }
    else
    {
        const token = req.body.token;
        const pid = req.body.pid;
        auth.cmauth(token,(body)=>
        {
            let sql = "";
            if(body.response)
            {
               const id = pid;
                const table = "story";
                        sql=mysql.format("SELECT*FROM ?? where type='image' AND pid = ?",[table,pid]);
               con2.query(sql,(error1,response1)=>
               {
                   if(error1)
                   {
                       throw error1;
                   }
                   else
                   {
                       return res.status(200).send(response1);
                   }
               })
            }
            else
            {
                return res.status(200).send({response:"0"})



            }
    });
}
})








router.post("/player_report",[handler.check('token').isString().isLength({min:5}),handler.check('pid').isString().escape()],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"Invalid data"});

    }
    else
    {
        const token = req.body.token;
        const pid = req.body.pid;
        auth.cmauth(token,(body)=>
        {
            let sql = "";
            if(body.response)
            {
               const id = pid;
                const table = "story";
                        sql=mysql.format("SELECT*FROM ?? where type='report' AND pid = ?",[table,pid]);
               con2.query(sql,(error1,response1)=>
               {
                   if(error1)
                   {
                       throw error1;
                   }
                   else
                   {
                       if(response1.length>0)
{
                       return res.status(200).sendFile("/var/www/digiscoutfootball.com/html/digiscout/uploads/"+response1[0].cover);
}
else
{
 return res.status(200).send({response:"2"});
}
                   }
               })
            }
            else
            {
                return res.status(200).send({response:"0"})



            }
    });
}
})
 
router.get("/getReport",[handler.check("token").isString().escape(),handler.check("report").isString().escape()],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"0",message:"Invalid Data"});

    }
    else
    {
        const token = req.query.token;
        const report = req.query.report;
        auth.cmauth(token,(body)=>
        {
            if(body.response)
            {
                return res.status(200).sendFile("/var/www/digiscoutfootball.com/html/digiscout/uploads/"+report);
            }
            else
            {
                return res.status(200).send({response:"0",message:"Invalid Token"});
            }
        })

    }
})








router.post("/promotional_video",[handler.check('pid').isString().escape(),handler.check('token').isString().isLength({min:3})],(req,res)=>
{
   const data_new = handler.validationResult(req);
   if(!data_new.isEmpty())
   {
       return res.status(400).send({response:"Invalid Data"});
   }
   else
   {
       const token = req.body.token;
       auth.cmauth(token,(data)=>
       {
           if(data.response)
           {
            let pid = req.body.pid;
            const table = "story";
            const query = mysql.format("SELECT * FROM ?? where mid= ? AND  pid = ? AND  type= ?",[table,"6",pid,"promo"]);
            con2.query(query,(error,response)=>
            {
                if(error)
                {
                    throw error;
                }
                else
                {
                    res.status(200).send(response);
                }
            })

           }
           else
           {
               return res.status(200).send({response:"0",message:"Invalid Token"});
           }
       })
   }
});

router.post('/enquire',[handler.check('token').isString().isLength({min:3}),handler.check('pid').isString().escape(),handler.check('name').isString(),handler.check('profile').isString().escape()],(req,res)=>
{
    const result = handler.validationResult(req);
    if(!result.isEmpty())
    {
        res.status(442).send({response:result.array()})
    }
    else
    {
        const tokens = req.body.token;
        let data = {};
        var options = {method:'POST',uri:"http://localhost:1112/tokens/normal1",form:{token:tokens},headers:{'content-type': 'application/x-www-form-urlencoded'}};
        request(options).then((body)=>
        {
            data = JSON.parse(body);
            if(data.result)
            {
                const sid = data.id;
                const email = data.email
                const phone = data.phone;
                const name = req.body.name;
                const pid = req.body.pid;
                const profile = req.body.profile;
                const query = mysql.format("INSERT INTO enquire (uid,pid,name,profile,sid,email,phone,timestamp) values(?,?,?,?,?,?,?,?)",[uuid(),pid,name,profile,sid,email,phone,Date.now().toString()]);
                con3.query(query,(err,response)=>
                {
                    if(err)
                    {
                        throw err;
                    }
                    else
                    {
                        const update = mysql.format("UPDATE ?? set cover='1' where uid = ?",["user_projects_"+sid,pid]);
                        con.query(update,(err1,response1)=>
                        {
                            if(err1)
                            {
                                throw err1
                            }
                            else
                            {
                                return res.status(200).send({response:"1",message:"Message Sent"});
                            }

                        })
                    }
                })
            }
            else
            {
                return res.status(200).send({response:"0",message:"INVALID TOKEN"})
            }
        });
    }

});

module.exports = router; 