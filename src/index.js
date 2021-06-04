const express = require('express');
const app = express();
const uuid = require('uuid-random');
const bodyParser = require("body-parser");
const handler = require('express-validator');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
const web3 = require('web3');
const crypto = require('crypto');
const aes = require('aes256');
const jwt = require('jsonwebtoken');
const sha256 = require('sha256');
app.use(require('./routers'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
const Web3 = new web3("https://ropsten.infura.io/v3/d53201e69f9e4abcb3ff6ddb42ed1c99");
Web3.eth.defaultAccount = Web3.eth.accounts[0];
const key = "hello";
const maincontractjson = require('C:/Users/aadit/tdn1/build/contracts/maincontract.json');
const address = "0x854bB10E0fa952e69CBC810E7bD25A460d35c7ba"
const abi = maincontractjson.abi;
const main_contract = new Web3.eth.Contract(abi,address);
const profilejson = require('C:/Users/aadit/tdn1/build/contracts/profilecontract.json');
const profileabi = profilejson.abi;
profileaddress = "0xae9D6020205BA91fF8d67588f2e044a7be3F38A3";
const tdnjson = require('C:/Users/aadit/tdn1/build/contracts/tdn.json');
const tdnabi = tdnjson.abi;
tdnaddress = "0x31b5887FD725F4a7D589D77cd993452000851A02";

const notification = require('C:/Users/aadit/tdn1/build/contracts/notification.json');
const notificationabi = notification.abi;
const notificationaddress = "0x1623CdC9368d0314924eB1244618f374d7Ef4076";

Web3.eth.accounts.wallet.add("b13538ad5d5081ce3321878241e3604dbe8205734ff375cfe6a43dcbdd95d269");


const profilecontract = new Web3.eth.Contract(profileabi,profileaddress);
const tdn = new Web3.eth.Contract(tdnabi,tdnaddress);
const notificationcontract = new Web3.eth.Contract(notificationabi,notificationaddress);

const redis = require('redis');
const client = redis.createClient(63799);
app.post('/register',handler.check("firstname").isString().escape(),handler.check("lastname").isString().escape(),handler.check("username").isString().escape(),handler.check("number").isString().escape(),handler.check("email").isEmail(),handler.check("password").escape(),(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"0",data:handler.validationResult(req).array()})

    }
    else
    {
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const username = req.body.username;
        const number = req.body.number;
        const email = req.body.email;
        const password = req.body.password;
        const uuid1 = uuid();
        let firstname1 = aes.encrypt(key,firstname);
        let lastname1 = aes.encrypt(key,lastname);
        let username1 = aes.encrypt(key,username);
        let number1 = sha256.x2(number);
        let password1 = sha256.x2(password);
        let uuid2 = sha256.x2(uuid1);
        let email1= sha256.x2(email);
        const init = async ()=>
        {
           await main_contract.methods.check_data(number1,email1).call((err,response)=>
           {
             if(err)
             {
               throw err;
             }
             else
             {
               if(response[0])
               {

              return res.status(200).send({response:"0",data:{number:response[0],email:response[1]}});
              }
              else if(response[1])
              {
                return res.status(200).send({response:"0",data:{number:response[0],email:response[1]}});
              }
              else
              {
                const init2 = async ()=>
                {
                const data_tx =  main_contract.methods.register(firstname1,lastname1,uuid2,number1,email1,username1,password1).encodeABI();
                await Web3.eth.sendTransaction({
                   from: '0x4202e278bbd654994DfbF52DAD471F66f2477741',
                   to:address,
                   data:data_tx,
                   gas:"900000"
               }, function(error, hash){
                   if(error)
                   {
                       throw error;
                   }
                   else
                   {
                       return res.status(200).send({response:"1",data:uuid1});
                   }
               });

              }
              init2();
            }

             }
           })
    }
    init();
}})



app.post('/login',handler.check("number").isString().escape(),handler.check("password").escape(),(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"0",data:handler.validationResult(req).array()})

    }
    else
    {
        const number = req.body.number;
        const password = req.body.password;
        let number1 = sha256.x2(number);
        let password1 = sha256.x2(password);
        const init = async()=>
        {
        await main_contract.methods.login(number1,password1).call((err,response)=>
        {
            if(err)
            {
                throw err;
            }
            else
            {
               if(response[0])
               {
                const token = jwt.sign({data:{uid:response[1],firstname:aes.decrypt(key,response[2]),lastname:aes.decrypt(key,response[3]),username:aes.decrypt(key,response[4])}},key,{expiresIn:'6h'});
                return res.status(200).send({response:"1",data:token})
               }
               else
               {
                 return res.status(200).send({response:"0",message:"Invalid Data"});
               }
            }
        })
      }
      init();
}})

app.post('/getAllProfile',[handler.check("token").isString().escape()],(req,res)=>
{
  if(!handler.validationResult(req).isEmpty())
  {
    return res.status(200).send({response:"0",message:"Invalid Resquest"});
  }
  else
  {
    const token = req.body.token;
    jwt.verify(token,key,(err,data)=>
    {
      if(err)
      {
        throw err
      }
      else
      {
        const uid = data.data.uid;
        const init = async()=>
        {
          await profilecontract.methods.sendAllProfile().call((err,response)=>
          {
            if(err)
            {
              throw err;
            }
            else{
              return res.status(200).send(response);
            }
          })
        }
        init();

      }
    })
  }
})
app.post('/getSomeUser',[handler.check("token").isString().escape()],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"0",data:handler.validationResult(req).array()})
    }
    else
    {
      const token = req.body.token;
      jwt.verify(token,key,(err,response)=>
      {
        if(err)
        {
          throw err;
        }
        else
        {
          const uid = response.data.uid;
          const init = async()=>
          {
            await main_contract.methods.getData(uid).call((err,response)=>
            {
              if(err)
              {
                throw err;

              }
              else
              {
                let new_element =  []; let new_element1=[];
                let data2data = [];
                for (let index = 0; index < response.length; index++) {
                  const element = response[index];
                   new_element1 = [];
                   data2data = [];
                  for(let j =0;j<element.length-1;j++)
                  {
                    new_element1.push(aes.decrypt(key,element[j]).toString());
                  }
                  new_element1.push(element[3]);
                  new_element.push(new_element1);
                }
                return res.status(200).send({response:"1",data:new_element});
              }
            })
          }
          init();
        }
      })
    }
  });

  function getUser()
  {
            client.get("profile",(err4,response4)=>
            {
              if(err4)
              {
                throw err4;
              }
              const init = async ()=>
              {
              response4 = JSON.parse(response4);
            await main_contract.methods.getData("b26ce98cff22bbcababd5ed092091f67cfbc5454434b2c8a08b6ac5526c0266b").call((err,response)=>
            {
              if(err)
              {
                throw err;

              }
              else
              {
                let new_element =  []; let new_element1=[];
                let data2data = [];
                for (let index = 0; index < response.length; index++) {
                  const element = response[index];
                  check = false;
                   new_element1 = [];
                   data2data = [];
                  for(let j =0;j<element.length-1;j++)
                  {
                    new_element1.push(aes.decrypt(key,element[j]).toString());
                  }
                  for (let index = 0; index < response4.data.length; index++) {
                    const element4 = response4.data[index];
                    if(element4[0]===element[3])
                    {
                      check = true;
                      data2data.push(element4[1])
                      data2data.push(element4[2])
                    }
                  }
                  if(check)
                  {
                    new_element1.push(data2data[0]);
                    new_element1.push(data2data[1]);
                    data2data = [];
                  }
                  else
                  {
                    new_element1.push(null)
                    new_element1.push(null)
                  }
                  new_element1.push(element[3]);
                  new_element.push(new_element1);
                }

                client.set("users",JSON.stringify({data:new_element}));
              }
            })
          }
          init();
          })
  }
   function getFollower()
  {
    const init = async()=>
    {
      await profilecontract.methods.sendAllFollowerData().call((err,response)=>
      {
        if(err)
        {
          throw err;
        }
        else
        {
          console.log(response)

          if(response.length>0)
          {
          client.set("follower",JSON.stringify({data:response}));
        }}
      })
    }
    init();
  }



  function getProfile()
  {
    const init = async()=>
    {
      await profilecontract.methods.sendAllProfile().call((err,response)=>
      {
        if(err)
        {
          throw err;
        }
        else
        {
          if(response.length>0)
          {
          client.set("profile",JSON.stringify({data:response}));
        }}
      })
    }
    init();
  }
 async function getAllModel()
  {
    const init = async()=>
    {
      await tdn.methods.getAllModel().call((err,response)=>
      {
        if(err)
        {
          throw err;
        }
        else
        {

          if(response.length>0)
          {
            let newdata = JSON.stringify({data:response})
          client.set("model",newdata);
          }
        }
      })
    }
    init();
  }

  async function getAllLikes()
  {
    const init = async()=>
    {
      await tdn.methods.getAllLikes().call((err,response)=>
      {
        if(err)
        {
          throw err;
        }
        else
        {
          if(response.length>0)
          {
          client.set("likes",JSON.stringify({data:response}));
        }}
      })
    }
    init();
  }
   function getAllHashtags()
  {
    const init = async()=>
    {
      await tdn.methods.getAllHashtags().call((err,response)=>
      {
        if(err)
        {
          throw err;
        }
        else
        {
          if(response.length>0)
          {
          client.set("Hashtags",JSON.stringify({data:response}));
        }}
      })
    }
    init();
  }






  function getAllData()
  {
    const init = async()=>
    {
      await tdn.methods.getData().call((err,response)=>
      {
        if(err)
        {
          throw err;
        }
        else
        {

          if(response.length>0)
          {
          client.set("data",JSON.stringify({data:response}));
        }}
      })
    }
    init();
  }
 function getAllHashtagf()
  {
    const init = async()=>
    {
      await tdn.methods.getAllHashtagf().call((err,response)=>
      {
        if(err)
        {
          throw err;
        }
        else
        {
          if(response.length>0)
          {
          client.set("Hashtagf",JSON.stringify({data:response}));
        }}
      })
    }
    init();
  }
  function getAllMentions()
  {
    const init = async()=>
    {
      await notificationcontract.methods.getAllMentions().call((err,response)=>
      {
        if(err)
        {
          throw err;
        }
        else
        {
          if(response.length>0)
          {
          client.set("mentions",JSON.stringify({data:response}));
        }}
      })
    }
    init();
  }
  function getAllNotification()
  {
    const init = async()=>
    {
      await notificationcontract.methods.getAllNotification().call((err,response)=>
      {
        if(err)
        {
          throw err;
        }
        else
        {
          if(response.length>0)
          {
          client.set("notifications",JSON.stringify({data:response}));
        }}
      })
    }
    init();
  }



  function caller()
  {

    getAllModel();
    getAllLikes();
    getAllMentions();
    getAllHashtags();
    getAllHashtagf();
    getFollower();
    getProfile();
    getUser();
    getAllData();
    getAllNotification();

  }



app.listen("5555",(err)=>
{
    if(err)
    {
        throw err;
    }
    else
    {
        console.log("Hey This Is Running On Port 5555");
        setInterval(caller,3000);
    }
})