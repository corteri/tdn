const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const handler = require('express-validator')
const web3 = require('web3');
const key = "hello";
const fs = require('fs');
const uuid = require('uuid');
const redis = require('redis');
const client = redis.createClient(63799);
const tdnfunctions = require('./tdn');
const Web3 = new web3("https://ropsten.infura.io/v3/d53201e69f9e4abcb3ff6ddb42ed1c99");
const dojson = require('C:/Users/aadit/tdn1/build/contracts/tdn.json');
const address ="0x31b5887FD725F4a7D589D77cd993452000851A02";
const profile = require('C:/Users/aadit/tdn1/build/contracts/profilecontract.json');
const profileabi = profile.abi;
const profileaddress = "0xae9D6020205BA91fF8d67588f2e044a7be3F38A3";
const profilecontract = new Web3.eth.Contract(profileabi,profileaddress);
const abi = dojson.abi;
const ipfsClient = require("ipfs-http-client");
const functions1 = require('./functions');
const ipfs = ipfsClient({host:'ipfs.infura.io',port:5001,protocol:'https'})
const expFileUpload = require("express-fileupload");
const axios = require('axios');
router.use(expFileUpload());
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
Web3.eth.accounts.wallet.add("b13538ad5d5081ce3321878241e3604dbe8205734ff375cfe6a43dcbdd95d269");

const tdn = new Web3.eth.Contract(abi,address);
router.post("/do",[handler.check("token").isString().escape(),handler.check("do").isString()],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"1",message:"Invalid Request"});
    }
    else
    {
        const token = req.body.token;
        const tweet = req.body.do;
        const newdata =[];
        console.log(newdata)
        jwt.verify(token,key,(err,response)=>
        {
            if(err)
            {
                throw err;
            }
            else
            {
                const uid = response.data.uid;
                const mid = "0"
                let tid = "";
                if(req.body.tid)
                {
                    tid = req.body.tid;
                console.log("maa aap ho")

                }
                else
                {
                    tid = uuid();
                }
                console.log(tid,"showing up tid")
                const image = "0";
                const type="txt";
                const data = "0";
                const rid = "0";
                if(newdata.length>0)
                {
                        const init1 = async()=>
                        {
                          const tx = await tdn.methods.insertData(newdata,["why"],tid).encodeABI();
                      let nonce = Date.now();
                          await Web3.eth.sendTransaction({
                            from: '0x4202e278bbd654994DfbF52DAD471F66f2477741',
                            to:address,
                            data:tx,
                            gas:"872197",
                            nonce
                        }, function(error, hash){
                            if(error)
                            {
                                throw error;
                            }
                            else
                            {
                              console.log(hash,"why not");
                            }
                        });
                        }
                        init1();
                }
                functions1.mentions(tweet,(data)=>
                {
                  if (data.response)
                  {
                  functions1.sendMentions(uuid(),tid,uid,"has mention you in his peek","0","0",data.data,(data)=>
                  {
                    if(data.response==="1")
                    {
                      console.log("Done");
                    }
                  })
                  }
                })
                functions1.hashtags(tweet,(data)=>
                {
                  if(data.response)
                  {
                    lo = data.data;
                    console.log(lo)
                    const init1 = async()=>
                    {
                      const tx = await tdn.methods.setHastagf(lo).encodeABI();
                      let nonce = await Web3.eth.getTransactionCount("0x4202e278bbd654994DfbF52DAD471F66f2477741")
                      await Web3.eth.sendTransaction({
                        from: '0x4202e278bbd654994DfbF52DAD471F66f2477741',
                        to:address,
                        data:tx,
                        nonce,
                        gas:"6721975"
                    }, function(error, hash){
                        if(error)
                        {
                            throw error;
                        }
                        else
                        {
                          console.log(hash);
                        }
                    });
                    }
                    init1();
                    const init2 = async()=>
                    {
                        let nonce = await Web3.eth.getTransactionCount("0x4202e278bbd654994DfbF52DAD471F66f2477741")
                      const tx = await tdn.methods.setHashtag(lo,Date.now().toString(),uid,tid).encodeABI();
                      await Web3.eth.sendTransaction({
                        from: '0x4202e278bbd654994DfbF52DAD471F66f2477741',
                        to:address,
                        nonce,
                        data:tx,
                        gas:"6721975"
                    }, function(error, hash){
                        if(error)
                        {
                            throw error;
                        }
                    });
                    }
                    init2();
                  }
                })
                const init = async()=>
                {
                    const tx = await tdn.methods.dotdn(tweet,data,image,type,tid,uid,rid,mid,Date.now().toString()).encodeABI();
                    let nonce = await Web3.eth.getTransactionCount("0x4202e278bbd654994DfbF52DAD471F66f2477741")+1;
                    await Web3.eth.sendTransaction({
                        from: '0x4202e278bbd654994DfbF52DAD471F66f2477741',
                        to:address,
                        data:tx,
                        nonce,
                        gas:"900000"
                    }, function(error, hash){
                        if(error)
                        {
                            console.log(error);
                        }
                        else
                        {
                          functions1.sendNotification2(tid,uuid(),"tweet",uid,"has tweeted","0","0",(data)=>
                          {
                            if(data.response==="1")
                            {
                              return res.status(200).send({response:"1"});
                            }
                          })
                        }
                    });
                }
                init();
            }
        })
    }
})
const addFile = async (fileName, filePath) => {
    const file = fs.readFileSync(filePath);
    const filesAdded = await ipfs.add({ path: fileName, content: file }, {
    progress: (len) => console.log("Uploading file..." + len)
  });
    console.log(filesAdded);
    const fileHash = filesAdded.cid.string;

    return fileHash;
};
router.post("/do_upload",[handler.check("token").isString().escape(),handler.check("do").isString()],(req,res)=>
{
    if (req.files.inputFile) {
        const file = req.files.inputFile;
        const fileName = file.name;
        const filePath = __dirname + "/files/" + fileName;
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"1",message:"Invalid Request"});
    }
    else
    {
        const token = req.body.token;
        const tweet = req.body.do;
        jwt.verify(token,key,(err,response)=>
        {
            if(err)
            {
                throw err;
            }
            else
            {
                const uid = response.data.uid;
                const tid = uuid();
                const mid = "0"
                const type="file";
                const data = "0";
                const rid = "0";
                file.mv(filePath, async (err) => {
                    if (err) {
                        console.log("Error: failed to download file.");
                        return res.status(500).send(err);
                    }
                    const fileHash = await addFile(fileName, filePath);
                    console.log("File Hash received __>", fileHash);
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.log("Error: Unable to delete file. ", err);
                        }
                    });
                    functions1.mentions(tweet,(data)=>
                    {
                      if (data.response)
                      {
                      functions1.sendMentions(uuid(),tid,uid,data.data,response.data.firstname+"has mention you in his tweet","0","0",(data)=>
                      {
                        if(data.response==="1")
                        {
                          console.log("Done");
                        }
                      })
                      }
                    })
                    functions1.hashtags(tweet,(data)=>
                    {
                      if(data.response)
                      {
                        lo = data.data;
                        console.log(lo)
                        const init1 = async()=>
                        {
                          const tx = await tdn.methods.setHastagf(lo).encodeABI();
                          await Web3.eth.sendTransaction({
                            from: '0x4202e278bbd654994DfbF52DAD471F66f2477741',
                            to:address,
                            data:tx,
                            gas:"6721975"
                        }, function(error, hash){
                            if(error)
                            {
                                throw error;
                            }
                            else
                            {
                              console.log(hash);
                            }
                        });
                        }
                        init1();
                        const init2 = async()=>
                        {
                          const tx = await tdn.methods.setHashtag(lo,Date.now().toString(),uid,tid).encodeABI();
                          await Web3.eth.sendTransaction({
                            from: '0x4202e278bbd654994DfbF52DAD471F66f2477741',
                            to:address,
                            data:tx,
                            gas:"6721975"
                        }, function(error, hash){
                            if(error)
                            {
                                throw error;
                            }
                        });
                        }
                        init2();
                      }
                    })
                const init = async()=>
                {
                    const tx = await tdn.methods.dotdn(tweet,data,fileHash,type,tid,uid,rid,mid,Date.now().toString()).encodeABI();
                    await Web3.eth.sendTransaction({
                        from: '0x4202e278bbd654994DfbF52DAD471F66f2477741',
                        to:address,
                        data:tx,
                        gas:"900000"
                    }, function(error, hash){
                        if(error)
                        {
                            throw error;
                        }
                        else
                        {
                            return res.status(200).send({response:"1"});
                        }
                    });
                }
                init();
            });
            }
        })
    }
    }
    else
    {
        return res.status(200).send({response:"0",message:"Invalid Data"});
    }
});

router.post("/getFeed",[handler.check("token").isString().escape()],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"0",message:"Invalid Data"});

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
                const init = async ()=>
                {
                await profilecontract.methods.getfriend(uid).call((err,response)=>
                {
                    if(err)
                    {
                        throw err;
                    }
                    else
                    {
                        let arr = [];
                        for (let index = 0; index < response.length; index++) {
                            const element = response[index];
                            arr.push(element[1]);
                        }
                        if(arr.length>0)
                        {
                            timestamp = Date.now()-259200000;
                            timestamp1 = timestamp.toString();
                            tdnfunctions.getFeed(uid,arr,timestamp1,(data)=>
                            {
                                return res.status(200).send({response:"1",data:data});
                            })
                        }
                    }
                });
            }
            init();
            }
        })

    }
})
router.post("/trendingHashtags",[handler.check("token").isString().escape()],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"0",message:"Invalid Data"});
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
                let uid = response.data.uid;
                let timestamp = Date.now()-259200000;
                timestamp = timestamp.toString()
                tdnfunctions.trendingTweets(uid,timestamp,(data)=>
                {
                    return res.status(200).send({response:"1",data:data});
                })
            }
        })

    }
})




router.post("/singlefeed",[handler.check("token").isString().escape(),handler.check("tid").isString().escape()],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"0",message:"Invalid Data"});
    }
    else
    {
        const token = req.body.token;
        const tid = req.body.tid;
        jwt.verify(token,key,(err,response)=>
        {
            if(err)
            {
                throw err;
            }
            else
            {
                let uid = response.data.uid;
                let timestamp = Date.now()-259200000;
                timestamp = timestamp.toString()
                tdnfunctions.singleFeed(tid,uid,(data)=>
                {
                    return res.status(200).send({response:"1",data:data});
                })
            }
        })

    }
})





router.post("/do_like",[handler.check("token").isString().escape(),handler.check("tid").isString()],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"1",message:"Invalid Request"});
    }
    else

    {
        const token = req.body.token;
        const lid = uuid();
        const tid = req.body.tid;
        jwt.verify(token,"hello",(err,response)=>
        {
            if(err)
            {
                throw err;
            }
            else
            {
                const uid = response.data.uid;
                const mid = uuid();
                const rid = "0";
                const e1 = "0";
                tdnfunctions.checkLike(tid,uid,(data)=>
                {
                    console.log(data);
                    if(data.response)
                    {
                        let lid = data.lid;
                        const init = async()=>
                {
                    const tx = await tdn.methods.unlike(uid,tid).encodeABI();
                    await Web3.eth.sendTransaction({
                        from: '0x4202e278bbd654994DfbF52DAD471F66f2477741',
                        to:address,
                        data:tx,
                        gas:"900000"
                    }, function(error, hash){
                        if(error)
                        {
                            throw error;
                        }
                        else
                        {
                            return res.status(200).send({response:"1",data:false});
                        }
                    });
                }
                init();

                    }
                    else
                    {
                        const init = async()=>
                        {
                            const tx = await tdn.methods.doLike(lid,uid,tid,rid,mid,e1,Date.now().toString()).encodeABI();
                            await Web3.eth.sendTransaction({
                                from: '0x4202e278bbd654994DfbF52DAD471F66f2477741',
                                to:address,
                                data:tx,
                                gas:"900000"
                            }, function(error, hash){
                                if(error)
                                {
                                    throw error;
                                }
                                else
                                {
                                    return res.status(200).send({response:"1",data:true});
                                }
                            });
                        }
                        init();

                    }
                })
            }
        })
    }
})

router.post("/unlike",[handler.check("token").isString().escape(),handler.check("tid").isString(),handler.check("lid").isString().escape()],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"1",message:"Invalid Request"});
    }
    else
    {
        const token = req.body.token;
        const lid = req.body.lid;
        const tid = req.body.tid;
        jwt.verify(token,"hello",(err,response)=>
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
                    const tx = await tdn.methods.unlike(lid,tid).encodeABI();
                    await Web3.eth.sendTransaction({
                        from: '0x4202e278bbd654994DfbF52DAD471F66f2477741',
                        to:address,
                        data:tx,
                        gas:"900000"
                    }, function(error, hash){
                        if(error)
                        {
                            throw error;
                        }
                        else
                        {
                            return res.status(200).send({response:"1"});
                        }
                    });
                }
                init();
            }
        })
    }
})
router.post("/doRetweet",[handler.check("token").isString(),handler.check("tid").isString().escape(),handler.check("fid")],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"1",message:"Invalid Request"});
    }
    else
    {
        const token = req.body.token;
        const tid = req.body.tid;
        const fid = req.body.fid;
        jwt.verify(token,key,(err,response)=>
        {
            if(err)
            {
                throw err;
            }
            else
            {
                const uid = response.data.uid;
                const rid = fid;
               // functions1.mentions(tweet,(data)=>
                //{
                  //if (data.response)
                  //{
                  //functions1.sendMentions(uuid(),"mention",uid,data.data,response.data.firstname+"has mention you in his tweet","0","0",(data)=>
                  //{
                    //if(data.response==="1")
                    //{
                      //console.log("Done");
                    //}
                  //})
                  //}
                //})
                //functions1.hashtags(tweet,(data)=>
                //{
                  //if(data.response)
                  //{
                    //lo = data.data;
                    //console.log(lo)
                    //const init1 = async()=>
                    //{
                      //const tx = await tdn.methods.setHastagf(lo).encodeABI();
                      //await Web3.eth.sendTransaction({
                        //from: '0x4202e278bbd654994DfbF52DAD471F66f2477741',
                        //to:address,
                        //data:tx,
                        //gas:"6721975"
                    //}, function(error, hash){
                      //  if(error)
                      //  {
                       /**       throw error;
                        }
                        else
                        {
                          console.log(hash);
                        }
                    });
                    }
                    init1();
                    const init2 = async()=>
                    {
                      const tx = await tdn.methods.setHashtag(lo,Date.now().toString(),uid,tid).encodeABI();
                      await Web3.eth.sendTransaction({
                        from: '0x4202e278bbd654994DfbF52DAD471F66f2477741',
                        to:address,
                        data:tx,
                        gas:"6721975"
                    }, function(error, hash){
                        if(error)
                        {
                            throw error;
                        }
                    });
                    }
                    init2();
                    */

                    client.get("model",(err,response)=>
                    {
                        if(err)
                        {
                            throw err;
                        }else
                        {
                            let check=false;
                            response = JSON.parse(response);
                            for (let index = 0; index < response.data.length; index++) {
                                const element = response.data[index];
                                if(element[4]===tid&&element[6]===uid&&element[7]==="0")
                                {
                                    check = true;
                                    break;
                                }
                            }
                            if(check)
                            {
                                return res.status(200).send({response:"0",message:"Already Retweeted"});
                            }
                            else
                            {
                                const init = async()=>
                                {
                                    const tx = await tdn.methods.sendRetweet(uid,rid,tid,Date.now().toString(),"0").encodeABI();
                                    await Web3.eth.sendTransaction({
                                        from: '0x4202e278bbd654994DfbF52DAD471F66f2477741',
                                        to:address,
                                        data:tx,
                                        gas:"900000"
                                    }, function(error, hash){
                                        if(error)
                                        {
                                            throw error;
                                        }
                                        else
                                        {
                                            return res.status(200).send({response:"1"});
                                        }
                                    });
                                }
                                init();

                            }
                        }
                    })
            }
            })
        }
    });
router.post("/doReply_upload",[handler.check("token").isString().escape(),handler.check("do").isString(),handler.check("tid").isString(),handler.check("fid").isString().escape()],(req,res)=>
{
    if (req.files.inputFile) {
        const file = req.files.inputFile;
        const fileName = file.name;
        const filePath = __dirname + "/files/" + fileName;
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"1",message:"Invalid Request"});
    }
    else
    {
        const token = req.body.token;
        const tweet = req.body.do;
        const tid = req.body.tid;
        const tid1 = uuid();
        const fid = req.body.fid;
        functions1.mentions(tweet,(data)=>
                {
                  if (data.response)
                  {
                  functions1.sendMentions(uuid(),tid1,uid,data.data,response.data.firstname+"has mention you in his tweet","0","0",(data)=>
                  {
                    if(data.response==="1")
                    {
                      console.log("Done");
                    }
                  })
                  }
                })
        functions1.hashtags(tweet,(data)=>
        {
          if(data.response)
          {
            lo = data.data;
            console.log(lo)
            const init1 = async()=>
            {
              const tx = await tdn.methods.setHastagf(lo).encodeABI();
              await Web3.eth.sendTransaction({
                from: '0x4202e278bbd654994DfbF52DAD471F66f2477741',
                to:address,
                data:tx,
                gas:"6721975"
            }, function(error, hash){
                if(error)
                {
                    throw error;
                }
                else
                {
                  console.log(hash);
                }
            });
            }
            init1();
            const init2 = async()=>
            {
              const tx = await tdn.methods.setHashtag(lo,Date.now().toString(),uid,tid).encodeABI();
              await Web3.eth.sendTransaction({
                from: '0x4202e278bbd654994DfbF52DAD471F66f2477741',
                to:address,
                data:tx,
                gas:"6721975"
            }, function(error, hash){
                if(error)
                {
                    throw error;
                }
            });
            }
            init2();
          }
        })
        jwt.verify(token,key,(err,response)=>
        {
            if(err)
            {
                throw err;
            }
            else
            {
                const uid = response.data.uid;
                const mid = fid
                const type="file";
                const data = "0";
                const rid = uid;
                file.mv(filePath, async (err) => {
                    if (err) {
                        console.log("Error: failed to download file.");
                        return res.status(500).send(err);
                    }
                    const fileHash = await addFile(fileName, filePath);
                    console.log("File Hash received __>", fileHash);
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.log("Error: Unable to delete file. ", err);
                        }
                    });
                const init = async()=>
                {
                    const tx = await tdn.methods.sendReply(tweet,data,fileHash,type,tid1,uid,mid,tid,Date.now().toString()).encodeABI();
                    await Web3.eth.sendTransaction({
                        from: '0x4202e278bbd654994DfbF52DAD471F66f2477741',
                        to:address,
                        data:tx,
                        gas:"900000"
                    }, function(error, hash){
                        if(error)
                        {
                            throw error;
                        }
                        else
                        {
                            return res.status(200).send({response:"1"});
                        }
                    });
                }
                init();
            });
            }
        })
    }
    }
    else
    {
        return res.status(200).send({response:"0",message:"Invalid Data"});
    }
});
router.post("/doReply",[handler.check("token").isString().escape(),handler.check("tid").isString(),handler.check("fid"),handler.check("do").isString()],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"1",message:"Invalid Request"});
    }
    else
    {
        const token = req.body.token;
        const tweet = req.body.do;
        jwt.verify(token,key,(err,response)=>
        {
            if(err)
            {
                throw err;
            }
            else
            {
                const uid = response.data.uid;
                let tid = "";
                if(req.body.nid)
                {
                    tid = req.body.nid;
                }
                else
                {
                    tid = uuid();
                }
                console.log(tid,"this is tid");
                const mid =  req.body.fid;
                const image = "0";
                const type="txt";
                const data = "0";
                const rid = "0";
                const extra = req.body.tid;
                console.log("this is extra")
                const newdata = [];
                if(newdata.length>0)
                {
                        const init1 = async()=>
                        {
                          const tx = await tdn.methods.insertData(newdata,[],tid).encodeABI();
                          await Web3.eth.sendTransaction({
                            from: '0x4202e278bbd654994DfbF52DAD471F66f2477741',
                            to:address,
                            data:tx,
                            gas:"6721975"
                        }, function(error, hash){
                            if(error)
                            {
                                throw error;
                            }
                            else
                            {
                              console.log(hash);
                            }
                        });
                        }
                        init1();
                }
                functions1.mentions(tweet,(data)=>
                {
                  if (data.response)
                  {
                  functions1.sendMentions(uuid(),tid,uid,data.data,response.data.firstname+"has mention you in his tweet","0","0",(data)=>
                  {0
                    if(data.response==="1")
                    {
                      console.log("Done");
                    }
                  })
                  }
                })
                functions1.hashtags(tweet,(data)=>
                {
                  if(data.response)
                  {
                    lo = data.data;
                    console.log(lo)
                    const init1 = async()=>
                    {
                      const tx = await tdn.methods.setHastagf(lo).encodeABI();
                      await Web3.eth.sendTransaction({
                        from: '0x4202e278bbd654994DfbF52DAD471F66f2477741',
                        to:address,
                        data:tx,
                        gas:"6721975"
                    }, function(error, hash){
                        if(error)
                        {
                            throw error;
                        }
                        else
                        {
                          console.log(hash);
                        }
                    });
                    }
                    init1();
                    const init2 = async()=>
                    {
                      const tx = await tdn.methods.setHashtag(lo,Date.now().toString(),uid,tid).encodeABI();
                      await Web3.eth.sendTransaction({
                        from: '0x4202e278bbd654994DfbF52DAD471F66f2477741',
                        to:address,
                        data:tx,
                        gas:"6721975"
                    }, function(error, hash){
                        if(error)
                        {
                            throw error;
                        }
                    });
                    }
                    init2();
                  }
                })
                const init = async()=>
                {
                    console.log(tweet,data,image,type,tid,uid,mid,extra);
                    let nonce = await Web3.eth.getTransactionCount("0x4202e278bbd654994DfbF52DAD471F66f2477741")+1;
                    const tx = await tdn.methods.sendReply(tweet,data,image,type,tid,uid,mid,extra,Date.now().toString()).encodeABI();
                    await Web3.eth.sendTransaction({
                        from: '0x4202e278bbd654994DfbF52DAD471F66f2477741',
                        to:address,
                        data:tx,
                        gas:"900000",
                        nonce
                    }, function(error, hash){
                        if(error)
                        {
                            throw error;
                        }
                        else
                        {
                            return res.status(200).send({response:"1"});
                        }
                    });
                }
                init();
            }
        })
    }
})
router.post("/getTweet",[handler.check("token").isString().escape()],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"0",message:"Invalid Request"});
    }
    else
    {
        const token = req.body.token;
        jwt.verify(token,"hello",(err,response)=>
        {
            if(err)
            {
                throw err;
            }
            else
            {
                const uid = response.data.uid;
                const init= async()=>
                {
                  await  tdnfunctions.getTweet(uid,(data)=>
                    {
                        console.log(data);
                        return res.status(200).send({response:"1",data:data});
                    })
                }
                init();
                //tdn.methods.getTweet(uid).call((err,response)=>
                //{
                  //if(err)
                  //{
                    //throw err;
                  //}
                  //else
                  //{
                    //return res.status(200).send({response:"1",data:response})
                  //}
            }
                })
            }
        })
        router.post("/getRepeek",[handler.check("token").isString().escape()],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"0",message:"Invalid Request"});
    }
    else
    {
        const token = req.body.token;
        jwt.verify(token,"hello",(err,response)=>
        {
            if(err)
            {
                throw err;
            }
            else
            {
                const uid = response.data.uid;
                const init= async()=>
                {
                  await  tdnfunctions.getRepeek(uid,(data)=>
                    {
                        console.log(data);
                        return res.status(200).send({response:"1",data:data});
                    })
                }
                init();
                //tdn.methods.getTweet(uid).call((err,response)=>
                //{
                  //if(err)
                  //{
                    //throw err;
                  //}
                  //else
                  //{
                    //return res.status(200).send({response:"1",data:response})
                  //}
            }
                })
            }
        })
router.post("/mainfeed",[handler.check("token").isString().escape()],(req,res)=>
{
    if(!req.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"0",message:"Invalid Message"});
    }
    else
    {

    }
})

router.post("/getReply",[handler.check("token").isString().escape(),handler.check("tid").isString().escape()],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"0",message:"Invalid Data"});
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
                const tid = req.body.tid;
                tdnfunctions.getReply(uid,tid,(data)=>
                {
                    return res.status(200).send({response:"1",data:data});
                }
                )
            }
        })

    }
})



router.post("/getRetweet",[handler.check("token").isString().escape(),handler.check("tid").isString().escape()],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"1",message:"Invalid Request"});
    }
    else
    {
        const token = req.body.token;
        jwt.verify(token,"hello",(err,response)=>
        {
            if(err)
            {
                throw err;
            }
            else
            {
                const uid = response.data.uid;
                const tid = req.body.tid;
                tdn.methods.getRetweet(tid).call((err,response)=>
                {
                  if(err)
                  {
                    throw err;
                  }
                  else
                  {
                    return res.status(200).send({response:"1",data:response})
                  }
                })
            }
        })
    }
})

router.post("/hashtags",[handler.check("token").isString().escape()],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"",message:"Invalid Data"});

    }
    else
    {
        const token = req.body.token
        jwt.verify(token,key,(err,response)=>
        {
            if(err)
            {
                throw err;
            }
            else
            {

                tdnfunctions.trendingHashtags(Date.now().toString(),(data)=>
                {
                    return res.status(200).send({response:"1",data:data});
                })
            }
        })

    }
})


router.post("/getHashtags",[handler.check("token").isString().escape(),handler.check("hashtag").isString()],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"",message:"Invalid Data"});

    }
    else
    {
        const token = req.body.token
        const hashtag = req.body.hashtag;
        jwt.verify(token,key,(err,response)=>
        {
            if(err)
            {
                throw err;
            }
            else
            {

                tdnfunctions.getHashtagData(hashtag,(data)=>
                {
                    return res.status(200).send({response:"1",data:data});
                })
            }
        })

    }
})
router.post("/getNotification",[handler.check("token").isString().escape()],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"",message:"Invalid Data"});

    }
    else
    {
        const token = req.body.token
        jwt.verify(token,key,(err,response)=>
        {
            if(err)
            {
                throw err;
            }
            else
            {
                const uid = response.data.uid;
                tdnfunctions.sendNotification(uid,(data)=>
                {
                    return res.status(200).send({response:"1",data:data});
                })
            }
        })
    }
})

router.post("/getMentions",[handler.check("token").isString().escape()],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"",message:"Invalid Data"});

    }
    else
    {
        const token = req.body.token
        jwt.verify(token,key,(err,response)=>
        {
            if(err)
            {
                throw err;
            }
            else
            {
                const uid = response.data.uid;
                tdnfunctions.sendMentions(uid,(data)=>
                {
                    return res.status(200).send({response:"1",data:data});
                })
            }
        })
    }
})




router.post("/getTweet1",[handler.check("token").isString().escape(),handler.check("fid").isString().escape()],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"0",message:"Invalid Request"});
    }
    else
    {
        const token = req.body.token;
        const fid = req.body.fid;
        jwt.verify(token,"hello",(err,response)=>
        {
            if(err)
            {
                throw err;
            }
            else
            {
                const uid = response.data.uid;
                const init= async()=>
                {
                  await  tdnfunctions.getTweet(fid,(data)=>
                    {
                        console.log(data);
                        return res.status(200).send({response:"1",data:data});
                    })
                }
                init();
                //tdn.methods.getTweet(uid).call((err,response)=>
                //{
                  //if(err)
                  //{
                    //throw err;
                  //}
                  //else
                  //{
                    //return res.status(200).send({response:"1",data:response})
                  //}
            }
                })
            }
        })
        router.post("/getRepeek1",[handler.check("token").isString().escape(),handler.check("fid").isString().escape()],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"0",message:"Invalid Request"});
    }
    else
    {
        const token = req.body.token;
        const fid = req.body.fid;
        jwt.verify(token,"hello",(err,response)=>
        {
            if(err)
            {
                throw err;
            }
            else
            {
                const uid = response.data.uid;
                const init= async()=>
                {
                  await  tdnfunctions.getRepeek(fid,(data)=>
                    {
                        console.log(data);
                        return res.status(200).send({response:"1",data:data});
                    })
                }
                init();
                //tdn.methods.getTweet(uid).call((err,response)=>
                //{
                  //if(err)
                  //{
                    //throw err;
                  //}
                  //else
                  //{
                    //return res.status(200).send({response:"1",data:response})
                  //}
            }
                })
            }
        })
router.post("/testing",[handler.check("token").isString().escape(),handler.check("data")],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"0",message:"Invalid Message"});
    }
    else
    {
        const token = req.body.token;
        const data = req.body.newdata;
        const tid = uuid();
        jwt.verify(token,key,(err,response)=>
        {
            if(err)
            {
                throw err;
            }
            else
            {
                const init1 = async()=>
                {
                  const tx = await tdn.methods.insertData(data,["why"],tid).encodeABI();
                  let nonce = await Web3.eth.getTransactionCount("0x4202e278bbd654994DfbF52DAD471F66f2477741");
                  console.log(nonce);
                  await Web3.eth.sendTransaction({
                    from: '0x4202e278bbd654994DfbF52DAD471F66f2477741',
                    to:address,
                    data:tx,
                    gas:"900000",
                    nonce
                }, function(error, hash){
                    if(error)
                    {
                        console.log(error);
                    }
                    else
                    {
                        return res.status(200).send({response:"1",message:"Done",hash:hash,tid:tid});
                    }
                });
                }
                init1();
            }
        })

    }
})

//this is a new async addFile Function
module.exports = router;