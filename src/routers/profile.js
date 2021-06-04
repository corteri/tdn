const express = require('express');
const router = express.Router();
const body_parser = require('body-parser');
const jwt = require('jsonwebtoken');
const handler = require('express-validator')
const web3 = require('web3');
const key = "hello";
const fs = require('fs');
const aes = require('aes256');
const tdn1 = require('./tdn');
const Web3 = new web3("https://ropsten.infura.io/v3/d53201e69f9e4abcb3ff6ddb42ed1c99");
const profilejson = require('C:/Users/aadit/tdn1/build/contracts/profilecontract.json');
const maincontractjson = require('C:/Users/aadit/tdn1/build/contracts/maincontract.json');
const notificationjson = require('C:/Users/aadit/tdn1/build/contracts/notification.json');
const address = "0xae9D6020205BA91fF8d67588f2e044a7be3F38A3";
const address1 = "0x854bB10E0fa952e69CBC810E7bD25A460d35c7ba";
const abi = profilejson.abi;
const tdnfunctions = require('./tdn');
const abi2 = maincontractjson.abi;
const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({host:'ipfs.infura.io',port:5001,protocol:'https'})
const expFileUpload = require("express-fileupload");
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
router.use(expFileUpload());
//router.post("/fileUpload",(req,res)=>
//{
   // return res.status(200).send({response:"0",data:req.files.inputFile});
//})
Web3.eth.accounts.wallet.add("b13538ad5d5081ce3321878241e3604dbe8205734ff375cfe6a43dcbdd95d269");
  router.post("/profile_upload",[handler.check("token").isString().escape()], (req, res) => {
    let fileObj = {};
    if (req.files.inputFile) {
        const file = req.files.inputFile;
        const fileName = file.name;
        const filePath = __dirname + "/files/" + fileName;
        if(!handler.validationResult(req).isEmpty())
        {
            return res.status(200).send({response:"0",message:"Data Not Recieved"});

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
                else {

                    const uid = response.data.uid;
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
                        fileObj = {
                            file: file,
                            name: fileName,
                            path: filePath,
                            hash: fileHash
                        };
                        const init = async()=>
                        {
                            await profilecontract.methods.checkProfile(uid).call((err,response)=>
                            {
                                if(err)
                                {
                                    throw err;
                                }
                                else
                                {
                                    console.log(response);
                                    if(response[2]!="0")
                                    {
                                        const init2 = async()=>
                                        {
                                        const tx = await profilecontract.methods.updateProfile(uid,fileHash).encodeABI();
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
                                                return res.status(200).send({response:"1",status:"updated"});
                                            }
                                        });
                                    }
                                    init2();
                                    }
                                    else if(response[2]==="0")
                                    {
                                        const init2 = async()=>
                                        {
                                        const tx = await profilecontract.methods.insert_profile(uid,fileHash,"0").encodeABI();
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
                                                return res.status(200).send({response:"1",status:"new"});
                                            }
                                        });
                                    }
                                    init2();
                                    }
                                }
                            })
                        }
                        init();
                    });
                    }
            })
        }

    }
});
router.post("/cover_upload",[handler.check("token").isString().escape()], (req, res) => {
    let fileObj = {};
    if (req.files.inputFile) {
        const file = req.files.inputFile;
        const fileName = file.name;
        const filePath = __dirname + "/files/" + fileName;
        if(!handler.validationResult(req).isEmpty())
        {
            return res.status(200).send({response:"0",message:"Data Not Recieved"});

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
                else {

                    const uid = response.data.uid;
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
                        fileObj = {
                            file: file,
                            name: fileName,
                            path: filePath,
                            hash: fileHash
                        };
                        const init = async()=>
                        {
                            await profilecontract.methods.checkProfile(uid).call((err,response)=>
                            {
                                if(err)
                                {
                                    throw err;
                                }
                                else
                                {
                                    console.log(response);
                                    if(response[2]!="0")
                                    {
                                        const init2 = async()=>
                                        {
                                        const tx = await profilecontract.methods.updateCover(uid,fileHash).encodeABI();
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
                                                return res.status(200).send({response:"1",status:"updated"});
                                            }
                                        });
                                    }
                                    init2();
                                    }
                                    else if(response[2]==="0")
                                    {
                                        const init2 = async()=>
                                        {
                                        const tx = await profilecontract.methods.insert_profile(uid,"0",fileHash).encodeABI();
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
                                                return res.status(200).send({response:"1",status:"new"});
                                            }
                                        });
                                    }
                                    init2();
                                    }
                                }
                            })
                        }
                        init();
                    });
                    }
            })
        }

    }
});
const addFile = async (fileName, filePath) => {
    const file = fs.readFileSync(filePath);
    const filesAdded = await ipfs.add({ path: fileName, content: file }, {
    progress: (len) => console.log("Uploading file..." + len)
  });
    console.log(filesAdded);
    const fileHash = filesAdded.cid.string;

    return fileHash;
};
  const profilecontract = new Web3.eth.Contract(abi,address);
  const maincontract = new Web3.eth.Contract(abi2,address1);
  router.post("/fetch_follower",[handler.check("token").isString().escape()],(req,res)=>
  {
      if(!handler.validationResult(req).isEmpty())
      {
        return res.status(200).send({response:"0",data:handler.validationResult(req).array()});
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
                      await profilecontract.methods.getfriend(uid).call((err,response)=>
                      {
                          if(err)
                          {
                              throw err;
                          }
                          else
                          {
                              let new_array=[];
                              let new_array1=[];
                            for (let index = 0; index < response.length; index++) {
                                const element = response[index];
                                new_array = [];
                                new_array.push(element[0]);
                                new_array.push(element[1]);
                                for(let j = 2;j<=4;j++)
                                {
                                    new_array.push(aes.decrypt(key,element[j]).toString());
                                }
                                new_array.push(element[5]);
                                new_array.push(element[6]);
                                new_array1.push(new_array);
                            }
                              return res.status(200).send({response:"1",data:new_array1});
                          }
                      })
                  }
                  init();
              }
          })
      }
  })


  router.post("/fetch_follower_count",[handler.check("token").isString().escape()],(req,res)=>
  {
      if(!handler.validationResult(req).isEmpty())
      {
        return res.status(200).send({response:"0",data:handler.validationResult(req).array()});
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
                      await profilecontract.methods.getFriendCount(uid).call((err,response)=>
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
                  init();
              }
          })

      }
  })

router.post('/insert_follower',[handler.check("token").isString().escape(),handler.check("fid").isString().escape()],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"0",data:handler.validationResult(req).array()})
    }
    else
    {
        const token = req.body.token;
        const fid = req.body.fid;
        console.log(fid)
        jwt.verify(token,key,(err,response)=>
        {
            if(err)
            {
                throw err;
            }
            else
            {
                let firstname1,lastname1,username1,profile1;
                let firstname2,lastname2,username2,profile2;
                const uid = response.data.uid;
                tdnfunctions.getProfile1(uid,(data)=>
                {
                    firstname1 = data.firstname;
                    lastname1 = data.lastname;
                    username1 = data.username;
                    profile1 = data.profile;
                    if(profile1==null)
                    {
                        profile1 = "";
                    }
                    tdnfunctions.getProfile1(fid,(data2)=>
                    {
                        firstname2 = data2.firstname;
                        lastname2 = data2.lastname;
                        username2 = data2.username;
                        profile2 = data2.profile;
                        if(profile2==null)
                        {
                            profile2 = "";
                        }
                        const init = async()=>
                        {
                              await profilecontract.methods.checkFriend(uid,fid).call((err,response)=>
                            {
                                if(err)
                                {
                                    throw err;
                                }
                                else
                                {
                                    if(response[0])
                                    {
                                        return res.status(200).send({response:"0",message:"Data Already Present",status:response[1]})
                                    }
                                    else
                                    {
                                         const init2 = async()=>
                                        {
                                            console.log(firstname1+" "+lastname1+" "+username1+"** pr  **"+profile1+"")
                                            console.log(firstname2+" "+lastname2+" "+username2+"** pr  **"+profile2+"")
                                            const tx = await profilecontract.methods.insert_follower(uid,fid,firstname1,lastname1,username1,profile1,firstname2,lastname2,username2,profile2).encodeABI();
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
                                        init2();
                                    }
                                }
                            })
                        }
                        init();
                    })
                })
            }
        })
    }
})

router.post("/unfollow",[handler.check("token").isString().escape(),handler.check("fid").isString().escape()],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {

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
                const fid = req.body.fid;
                const init = async ()=>
                {
                    const tx = await profilecontract.methods.deleteFriend(uid,fid).encodeABI()
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
router.post('/getProfile',[handler.check("token").isString().escape()],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"0",data:handler.validationResult(req).array()})
    }
    else
    {
        const token = req.body.token;
        jwt.verify(token,key,(err,response2)=>
        {
            if(err)
            {
                throw err;
            }
            else
            {
                const uid = response2.data.uid;
                /**
                const init = async()=>
                {
                    await profilecontract.methods.getProfile(uid).call((err,response)=>
                    {
                        if(err)
                        {
                            throw err;
                        }
                        else
                        {
                                 profilecontract.methods.getFriendCount(uid).call((err,response1)=>
                                {
                                    if(err)
                                    {
                                        throw err;
                                    }
                                    else
                                    {
                                        let data = [];
                                        data.push(response2.data.firstname)
                                        data.push(response2.data.lastname)
                                        data.push(response2.data.username)
                                        data.push(response1[0])
                                        data.push(response1[1])
                                        data.push(response[0])
                                        data.push(response[1])


                                        return res.status(200).send({response:"1",firstname:data[0],lastname:data[1],username:data[2],following:data[3],follower:data[4],profile:data[5],cover:data[6],uid:uid});

                                    }
                                })
                            }
                    })
                }
                init();
                 */
                tdnfunctions.getProfile1(uid,(data)=>
                {
                    return res.status(200).send({response:"1",data:data});
                })
            }
        });
    }
});

router.post("/getFollower",[handler.check("token").isString().escape()],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"0",data:handler.validationResult(req).array});
    }
    else
    {
        const token = req.body.token;
        jwt.verify(token,key,(err,data)=>
        {
            if(err)
            {
                throw err;
            }
            else
            {
                const uid = data.data.uid;
                tdn1.getFollower(uid,(data1)=>
                {
                    return res.status(200).send({response:"1",data:data1});
                })
            }
        })

    }
})


router.post("/bothFriend",[handler.check("token").isString().escape(),handler.check("fid").isString().escape()],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"0",data:handler.validationResult(req).array});
    }
    else
    {
        const token = req.body.token;
        const fid = req.body.fid;
        jwt.verify(token,key,(err,data)=>
        {
            if(err)
            {
                throw err;
            }
            else
            {
                const uid = data.data.uid;
                const init2 = async()=>
{
    const tx = await profilecontract.methods.bothFriend(uid,fid).encodeABI();
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
init2();

            }
        })

    }
})




//all the altrenative api's exist here


router.post("/getFollower1",[handler.check("token").isString().escape(),handler.check("fid").isString().escape()],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"0",data:handler.validationResult(req).array});
    }
    else
    {
        const token = req.body.token;
        const fid = req.body.fid;
        jwt.verify(token,key,(err,data)=>
        {
            if(err)
            {
                throw err;
            }
            else
            {
                const uid = data.data.uid;
                tdn1.getFollower(fid,(data1)=>
                {
                    return res.status(200).send({response:"1",data:data1});
                })
            }
        })

    }
})











router.post('/getProfile1',[handler.check("token").isString().escape(),handler.check("fid").isString().escape()],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"0",data:handler.validationResult(req).array()})
    }
    else
    {
        const token = req.body.token;
        const fid = req.body.fid;
        jwt.verify(token,key,(err,response2)=>
        {
            if(err)
            {
                throw err;
            }
            else
            {
                const uid = response2.data.uid;
                tdnfunctions.getProfile1(fid,(data)=>
                {
                 console.log(data);
                    return res.status(200).send({response:"1",data:data});
                })
//                                        return res.status(200).send({response:"1",firstname:data[0],lastname:data[1],username:data[2],following:data[3],follower:data[4],profile:data[5],cover:data[6],uid:uid});

                                    }
                                })
                            }
                    })

//Just Checking Friends


router.post("/checkfriend",[handler.check("token").isString().escape(),handler.check("fid").isString().escape()],(req,res)=>
{
    if(!handler.validationResult(req).isEmpty())
    {
        return res.status(200).send({response:"0",message:"Invalid Data"});

    }else
    {
        const token = req.body.token;
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
                const init = async()=>
                {
                    await profilecontract.methods.checkFriend(uid,fid).call((err,response1)=>
                    {
                        if(err)
                        {
                            throw err;
                        }
                        else
                        {
                            return res.status(200).send({response:"1",data:response1});
                        }
                    })
                }
                init();
            }
        })

    }
})


module.exports = router;