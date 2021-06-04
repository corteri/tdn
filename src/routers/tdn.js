const aes256 = require('aes256');
const { response } = require('express');
const { JsonWebTokenError } = require('jsonwebtoken');
const { unwatchFile } = require('node:fs');
const redis = require('redis');
const client = redis.createClient(63799);


exports.getMentionUid = function getMentionUid(arr,callback)
{
    let data = []
    client.get("users",(err,response)=>
    {
        if(err)
        {
            throw err
        }
        else
        {
            response = JSON.parse(response);
            response = response.data;
            for(let i = 0;i<arr.length;i++)
            {
                for (let index = 0; index < response.length; index++) {
                    const element = response[index];
                    if(arr[i]===element[2])
                    {
                        data.push(element[5]);
                    }
                }
            }
            return callback(data);
        }
    })
}


exports.sendMentions = function sendMentions(uid,callback)
{
    let data = []
    let data1 = []
    client.get("mentions",(err,response)=>
    {
        if(err)
        {
         throw err;
        }
        client.get("users",(err1,response1)=>
        {
            if(err1)
            {
                throw err1;
            }
            response = JSON.parse(response);
            response1 = JSON.parse(response1);
            response = response.data;
            response1 = response1.data;
            for(let i=0;i<response.length;i++)
            {
                let element = response[i];
                let newdata = element[4];
                for(let j=0;j<newdata.length;j++)
                {
                    if(newdata[j]===uid)
                    {
                        for(let k=0;k<response1.length;k++)
                        {
                            let element1 = response1[k];
                          if(element1[5]===element[3])
                          {
                              data1.push(element[0])
                              data1.push(element[1])
                              data1.push(element[2])
                              data1.push(element[3])
                              data1.push(element[5])
                              data1.push(element[6])
                              data1.push(element[7])
                              data1.push(element[8])
                              data1.push(element[9])
                              data1.push(element1[0]+" "+element1[1]);
                              data1.push(element1[2])
                              data1.push(element1[3]);
                              data1.push(element1[4]);
                              data1.push(element1[5]);
                              data.push(data1);
                              data1 = [];
                          }
                        }
                    }
                }
            }
            return callback(data);
        })
    })
}







exports.sendNotification = function sendNotification(uid,callback)
{
    let data = []
    let data1 = []
    client.get("notifications",(err,response)=>
    {
        if(err)
        {
         throw err;
        }
        client.get("users",(err1,response1)=>
        {
            if(err1)
            {
                throw err1;
            }
            response = JSON.parse(response);
            response1 = JSON.parse(response1);
            response = response.data;
            response1 = response1.data;
            for(let i=0;i<response.length;i++)
            {
                let element = response[i];
                let newdata = element[4];
                for(let j=0;j<newdata.length;j++)
                {
                    if(newdata[j]===uid)
                    {
                        for(let k=0;k<response1.length;k++)
                        {
                            let element1 = response1[k];
                          if(element1[5]===element[3])
                          {
                              data1.push(element[0])
                              data1.push(element[1])
                              data1.push(element[2])
                              data1.push(element[3])
                              data1.push(element[5])
                              data1.push(element[6])
                              data1.push(element[7])
                              data1.push(element[8])
                              data1.push(element[9])
                              data1.push(element1[0]+" "+element1[1]);
                              data1.push(element1[2])
                              data1.push(element1[3]);
                              data1.push(element1[4]);
                              data1.push(element1[5]);
                              data.push(data1);
                              data1 = [];
                          }
                        }
                    }
                }
            }
            return callback(data);
        })
    })
}


function getData(tid,callback)
{
    client.get("model",(err,response)=>
    {
        client.get("likes",(err1,response1)=>
        {
            response = JSON.parse(response);
            response1 = JSON.parse(response1);
            if(err)
            {
                throw err;
            }
            if(err1)
            {
                throw err1
            }
            let obj = {};
            let c1 =0;
            let c2 =0;
            let c3 =0;
            for (let index = 0; index < response.data.length; index++) {
                const element = response.data[index];
                if(element[6]!="0"&&element[7]==="0"&&element[4]===tid)
                {
                    c1++;
                }
                if(element[7]!="0"&&element[6]!="0"&&element[4]===tid)
                {
                    c2++;
                }
            }
            for (let index = 0; index < response2.data.length; index++) {
                const element = response2.data[index];
                if(element[2]===tid)
                {
                    c3++;
                }
            }


        })
    })
}


exports.getTweet = function getTweet(uid,callback)
{
    let data = [];
    let data1 = [];
    const init = async()=>
    {

  await   client.get("model",(err,response)=>
    {
        client.get("likes",(err1,response1)=>
        {
            response1 = JSON.parse(response1);
            client.get("data",(err3,response3)=>{
                let clientdata = false;
                if(err3||response3==null)
                {
                    clientdata = true;
                }
                response3 = JSON.parse(response3);

        if(err1||response1==null)
        {
            response = JSON.parse(response);
            const init2 = async()=>
            {
        await response.data.forEach(element => {
            if(element[5]===uid&&element[6]==="0"&&element[7]==="0")
            {
                let data92 = [];
                let datacheck = false;
                if(!clientdata)
                {
                for(let at = 0;at<response3.data.length;at++){
                    let atelement = response3.data[at];
                    if(atelement[0]===element[4])
                    {
                        data92.push(atelement[0]);
                        data92.push(atelement[1]);
                        data92.push(atelement[2]);
                        datacheck = true;
                        break;
                    }
                }
               }
               if(!datacheck || clientdata)
               {
                   data92[0] = "";
                   data92[1] = "";
                   data92[2] = "";
               }
                data.push(element[0]);
                data.push(element[1]);
                data.push(element[2]);
                data.push(element[3]);
                data.push(element[4]);
                data.push(element[5]);
                data.push(element[6]);
                data.push(element[7]);
                data.push(element[8]);
                data.push(element[9]);
                data.push(element[10]);
                data.push(element[11]);
                data.push(false);
                data.push(data92[0]);
                data.push(data92[1]);
                data.push(data92[2]);

            }
            });
        }
        init2();
        return callback(data);
        }
        else
        {
            response = JSON.parse(response);
            let checking = false;
        for(let i = 0;i<response.data.length;i++)
        {
            element = response.data[i];
            if(element[5]===uid&&element[6]==="0"&&element[7]==="0")
            {
                for(let im="0";im<response1.data.length;im++)
                {
                    let imelement = response1.data[im];
                    if(imelement[2]===element[4]&&imelement[1]===uid)
                    {
                        checking=true;
                        break;
                    }
                }
                let data92 = [];
                let datacheck = false;
                if(!clientdata)
                {
                for(let at = 0;at<response3.data.length;at++){
                    let atelement = response3.data[at];
                    if(atelement[0]===element[4])
                    {
                        data92.push(atelement[0]);
                        data92.push(atelement[1]);
                        data92.push(atelement[2]);
                        datacheck = true;
                        break;
                    }
                }
               }
               if(!datacheck || clientdata)
               {
                   data92[0] = "";
                   data92[1] = "";
                   data92[2] = "";
               }
                data1.push(element[0]);
                data1.push(element[1]);
                data1.push(element[2]);
                data1.push(element[3]);
                data1.push(element[4]);
                data1.push(element[5]);
                data1.push(element[6]);
                data1.push(element[7]);
                data1.push(element[8]);
                data1.push(element[9]);
                data1.push(element[10]);
                data1.push(element[11]);
                data1.push(checking);
                data1.push(data92[0]);
                data1.push(data92[1]);
                data1.push(data92[2]);
                data.push(data1);
                data1 = [];
                checking = false;
            }
        }
        return callback(data);
        }
    })
});
});
}
init();
}
exports.getRepeek = function getRepeek(uid,callback)
{
    const init = async()=>
    {

  await   client.get("model",(err,response)=>
    {
        if(err)
        {
            throw err;
        }
        else
        {
            const data = [];
            console.log(response)
            response = JSON.parse(response);
            const init2 = async()=>
            {
        await response.data.forEach(element => {
            if(element[6]===uid&&element[7]==="0")
            {
                data.push(element);
            }
            });
        }
        init2();
            return callback(data);
        }
    })
}
init();
}

exports.getRetweet = function getRetweet(tid,callback)
{
    const init = async()=>
    {

  await  client.get("model",(err,response)=>
    {
        if(err)
        {
            throw err;
        }
        else
        {
            const data = [];
            console.log(response)
            response = JSON.parse(response);
            const init2 = async()=>
            {
        await response.data.forEach(element => {
            if(element[4]===tid&&element[6]!="0"&&element[7]==="0")
            {
                data.push(element);
            }
            });
        }
        init2();
            return callback(data);
        }
    })
}
init();
}

exports.getReply = function getReply(_uid,tid,callback)
{
    let data = [];
            let data1 = [];
    const init = async()=>
    {

  await  client.get("model",(err,response)=>
    {
        client.get("users",(err1,response2)=>
        {
            if(err1)
            {
                throw err1;
            }
            client.get("likes",(err2,response1)=>
            {

                client.get("data",(err3,response3)=>
                {
                    clientdata = false;
                    if(err3||response3===null){
                        clientdata = true;
                    }
                    console.log(clientdata);

            response2 = JSON.parse(response2);
            response1 = JSON.parse(response1);
            response = JSON.parse(response);
            response3 = JSON.parse(response3);
     if(!err2||response1!=null)
        {
        if(err)
        {
            throw err;
        }
        else
        {
            let checking = false
            const init2 = async()=>
            {
        await response.data.forEach(element => {
            console.log(`${element[8]}===${tid}&&${element[6]}!=0&&${element[7]}!=0`);
            if(element[8]===tid&&element[6]!="0"&&element[7]!="0")
            {
                for (let index = 0; index < response2.data.length; index++) {
                    const element2 = response2.data[index];
                    console.log(`${element2[5]}===${element[5]}`);
                    if(element2[5]===element[5])
                    {
                                                 for(let im="0";im<response1.data.length;im++)
                                                {
                                                    let imelement = response1.data[im];
                                                    if(imelement[2]===element[4]&&imelement[1]===_uid)
                                                    {
                                                        checking=true;
                                                        break;
                                                    }
                                                }
                                                let data92 = [];
                                                let datacheck = false;
                                                if(!clientdata)
                                                {
                                                    console.log("working");
                                                for(let at = 0;at<response3.data.length;at++){
                                                    let atelement = response3.data[at];
                                                    if(atelement[0]===element[4])
                                                    {
                                                        console.log(atelement);
                                                        data92.push(atelement[0]);
                                                        data92.push(atelement[1]);
                                                        data92.push(atelement[2]);
                                                        datacheck = true;
                                                        break;
                                                    }
                                                }
                                               }
                                               if(!datacheck || clientdata)
                                               {
                                                   data92[0] = "";
                                                   data92[1] = "";
                                                   data92[2] = "";
                                               }
                        data1.push(element[0]);
                        data1.push(element[1]);
                        data1.push(element[2]);
                        data1.push(element[3]);
                        data1.push(element[4]);
                        data1.push(element[5]);
                        data1.push(element[6]);
                        data1.push(element[7]);
                        data1.push(element[8]);
                        data1.push(element[9]);
                        data1.push(element[10]);
                        data1.push(element[11]);
                        data1.push(element2[0]);
                        data1.push(element2[1]);
                        data1.push(element2[2]);
                        data1.push(element2[3]);
                        data1.push(element2[4]);
                        data1.push(element2[5]);
                        data1.push(checking);
                        data1.push(data92[0]);
                        data1.push(data92[1]);
                        data1.push(data92[2]);
                    }
                }

                data.push(data1);
                checking=false
                data1 = [];
            }
            });
        }
        init2();
        }
    }
    else
    {
        const init2 = async()=>
            {
        await response.data.forEach(element => {
            console.log(`${element[8]}===${tid}&&${element[6]}!=0&&${element[7]}!=0`);
            if(element[8]===tid&&element[6]!="0"&&element[7]!="0")
            {
                for (let index = 0; index < response2.data.length; index++) {
                    const element2 = response2.data[index];
                    console.log(`${element2[5]}===${element[5]}`);
                    if(element2[5]===element[5])
                    {
                        let data92 = [];
                        let datacheck = false;
                        if(!clientdata)
                        {
                        for(let at = 0;at<response3.data.length;at++){
                            let atelement = response3.data[at];
                            if(atelement[0]===element[4])
                            {
                                console.log(atelement);
                                data92.push(atelement[0]);
                                data92.push(atelement[1]);
                                data92.push(atelement[2]);
                                datacheck = true;
                                break;
                            }
                        }
                       }
                       if(!datacheck || clientdata)
                       {
                           data92[0] = "";
                           data92[1] = "";
                           data92[2] = "";
                       }


                        data1.push(element[0]);
                        data1.push(element[1]);
                        data1.push(element[2]);
                        data1.push(element[3]);
                        data1.push(element[4]);
                        data1.push(element[5]);
                        data1.push(element[6]);
                        data1.push(element[7]);
                        data1.push(element[8]);
                        data1.push(element[9]);
                        data1.push(element[10]);
                        data1.push(element[11]);
                        data1.push(element2[0]);
                        data1.push(element2[1]);
                        data1.push(element2[2]);
                        data1.push(element2[3]);
                        data1.push(element2[4]);
                        data1.push(element2[5]);
                        data1.push(false);
                    }
                }

                data.push(data1);
                data1 = [];
            }
            });
        }
        init2();

    }
    return callback(data);
    });
    });
});
    });
}
init();
}


exports.getProfile = function getProfile(uid,callback){
    let data = [];
    let newarray = [];
    client.get("users",(err,response)=>
    {
        if(err)
        {
            throw err;
        }
            client.get("follower",(err1,response1)=>
            {
                if(err1)
                {
                    throw err1;
                }
                    response = JSON.parse(response)
                    response1 = JSON.parse(response1)
                    let c = 0;
                    for (let index = 0; index < response.data.length; index++) {
                        const element = response.data[index];
                        if(element[5]===uid)
                        {
                        for (let index1 = 0; index1 < response1.data.length; index++) {
                            const element1 = response1.data[index1];
                            if(element1[0]===uid||element[1]===uid)
                            {
                                c++;
                                newarray.push(element1[0]);
                                newarray.push(element1[1]);
                                newarray.push(element1[2]);
                                newarray.push(element1[3]);
                                newarray.push(element1[4]);
                                newarray.push(element1[5]);
                                newarray.push(element1[6]);
                                newarray.push(element[0]);
                                newarray.push(element[1]);
                                newarray.push(element[2]);
                                newarray.push(element[3]);
                                newarray.push(element[4]);
                                newarray.push(element[5]);

                            }
                        }
                        if(c<1)
                        {
                        newarray.push(null);
                        newarray.push(null);
                        newarray.push(null);
                        newarray.push(null);
                        newarray.push(null);
                        newarray.push(null);
                        newarray.push(null);
                        newarray.push(element[0]);
                        newarray.push(element[1]);
                        newarray.push(element[2]);
                        newarray.push(element[3]);
                        newarray.push(element[4]);
                        newarray.push(element[5]);
                        }
                        data.push(newarray);
                        newarray = [];
                    }
                    }
                    return callback(data);
            })
    })
}

exports.getProfile1 = function getProfile(uid,callback)
{
    let obj = {};
    let c1 = 0;
    let c2 = 0;
    client.get("users",(err,response)=>
    {
        if(err)
        {
            throw err;
        }
        else
        {
            client.get("follower",(err2,response2)=>
            {
                if(err2)
                {
                    throw err2;
                }
                else
                {
                        response = JSON.parse(response);
                        response2 = JSON.parse(response2);
                        let firstname = "";
                        let lastname = "";
                        let username = "";
                        let profile = "";
                        let cover = "";
                        let uid1 = "";
                        for(let i = 0;i<response.data.length;i++)
                        {
                            let element = response.data[i];
                            if(element[5]===uid)
                            {
                                firstname = element[0];
                                lastname = element[1];
                                username = element[2];
                                profile = element[3];
                                cover = element[4];
                                uid1 = element[5];
                            }
                        }
                        for(let j = 0;j<response2.data.length;j++)
                        {
                            let element = response2.data[j];
                            console.log(`${element[0]}==${uid}`)
                            if(element[0]===uid)
                            {
                                if(element[5]==="1")
                                {
                                    c1++;
                                }
                                if(element[5]==="2")
                                {
                                    c2++;
                                }
                                if(element[5]==="3")
                                {
                                    c1++;c2++;
                                }
                            }
                        }
                        obj = {firstname,lastname,username,profile,cover,following:c1,follower:c2,uid:uid1}
                        return callback(obj);
                }
            })
        }

    })
}



exports.getHashtagData = function getHashtagData(hashtag,callback)
{
    let data = [];
    client.get("Hashtags",(err,response)=>
    {
        if(err)
        {
            throw err;
        }
        client.get("model",(err1,response1)=>
        {
            if(err1)
            {
                throw err1
            }
            client.get("users",(err2,response2)=>
            {
                if(err2)
                {
                    throw err2;
                }
                response = JSON.parse(response);
                response1 = JSON.parse(response1);
                response2 = JSON.parse(response2);
                let arr = [];
                let arr2 = [];
                for (let index = 0; index < response.data.length; index++) {
                    const element = response.data[index];
                    console.log(`${element[3]}==${hashtag}`)
                    if(element[3]==hashtag)
                    {
                        arr.push(element[2]);
                    }
                }
                console.log(arr)
                for(let h = 0;h<arr.length;h++)
                {
                for (let index = 0; index < response1.data.length; index++) {
                    const element = response1.data[index];
                    if(arr[h]===element[4])
                    {
                        for (let index1 = 0; index1 < response2.data.length; index1++) {
                            const element1 = response2.data[index1];
                            if(element1[5]===element[5])
                            {
                                arr2.push(element[0]);
                                arr2.push(element[1]);
                                arr2.push(element[2]);
                                arr2.push(element[3]);
                                arr2.push(element[4]);
                                arr2.push(element[5]);
                                arr2.push(element[6]);
                                arr2.push(element[7]);
                                arr2.push(element[8]);
                                arr2.push(element[9]);
                                arr2.push(element[10]);
                                arr2.push(element[11]);
                                arr2.push(element1[0]);
                                arr2.push(element1[1]);
                                arr2.push(element1[2]);
                                arr2.push(element1[3]);
                                arr2.push(element1[4]);
                                arr2.push(element1[5]);
                            }
                        }
                        //got the tweet
                    }
                }
                data.push(arr2);
                arr2 = [];
            }
            return callback(data);
            })

        })
    })
}
exports.getFeed = function getFeed( _uid,ar, _timestamp,callback)
    {
        let data = [];
        client.get("model",(err,response)=>
        {
            if(err)
            {
                throw err;
            }
            else
            {
        response = JSON.parse(response);
                client.get("likes",(err1,response1)=>
                {

                    client.get("users",(err2,response2)=>
                    {
                        client.get("data",(err3,response3)=>
                        {
                            let clientdata = false;
                            if(err3||response3===null){
                                clientdata = true;
                            }


                        if(err2)
                        {
                            throw err2;
                        }
                        response2 = JSON.parse(response2);
                        let arr2 = [];
                        response3 = JSON.parse(response3);
                    response1 = JSON.parse(response1);
                    if(err1||response1===null)
                    {
                        for(let i = 0;i<response.data.length;i++)
                        {
                                let element = response.data[i];
                                for(let k = 0;k<ar.length;k++)
                                {
                                    if(ar[k]===element[5]&&element[7]==="0"&&element[6]==="0"&&parseInt(_timestamp)<=parseInt(element[8]))
                                    {
                                        for(let l = 0;l<response2.data.length;l++)
                                        {
                                            let element3 = response2.data[l];
                                            if(element3[5]===ar[k])
                                            {
                                                let data92 = [];
                                                let datacheck = false;
                                                if(!clientdata)
                                                {
                                                for(let at = 0;at<response3.data.length;at++){
                                                    let atelement = response3.data[at];
                                                    if(atelement[0]===element[4])
                                                    {
                                                        data92.push(atelement[0]);
                                                        data92.push(atelement[1]);
                                                        data92.push(atelement[2]);
                                                        datacheck = true;
                                                        break;
                                                    }
                                                }
                                               }
                                               if(!datacheck || clientdata)
                                               {
                                                   data92[0] = "";
                                                   data92[1] = "";
                                                   data92[2] = "";
                                               }
                                                       arr2.push(element[0]);
                                                       arr2.push(element[1]);
                                                       arr2.push(element[2]);
                                                       arr2.push(element[3]);
                                                       arr2.push(element[4]);
                                                       arr2.push(element[5]);
                                                       arr2.push(element[6]);
                                                       arr2.push(element[7]);
                                                       arr2.push(element[8]);
                                                       arr2.push(element[9]);
                                                       arr2.push(element[10]);
                                                       arr2.push(element[11]);
                                                       arr2.push(element3[0]);
                                                       arr2.push(element3[1]);
                                                       arr2.push(element3[2]);
                                                       arr2.push(element3[3]);
                                                       arr2.push(element3[4]);
                                                       arr2.push(element3[5]);
                                                       arr2.push(data91[0]);
                                                       arr2.push(data91[1]);
                                                       arr2.push(data91[1]);

                                            }
                                        }
                                                   data.push(arr2);
                                                   arr2=[];
                                    }
                                }
                        }
                    }
                    else
                    {
                        let checking = false;
                        for(let i = 0;i<response.data.length;i++)
                        {
                                let element = response.data[i];
                                for(let k = 0;k<ar.length;k++)
                                {
                                    if(ar[k]===element[5]&&element[7]==="0"&&element[6]==="0"&&parseInt(_timestamp)<=parseInt(element[8]))
                                    {
                                        for(let l = 0;l<response2.data.length;l++)
                                        {
                                            let element3 = response2.data[l];
                                            if(element3[5]===ar[k])
                                            {
                                                for(let im="0";im<response1.data.length;im++)
                                                {
                                                    let imelement = response1.data[im];
                                                    if(imelement[2]===element[4]&&imelement[1]===_uid)
                                                    {
                                                        checking=true;
                                                        break;
                                                    }
                                                }
                                                let data92 = [];
                                                let datacheck = false;
                                                if(!clientdata)
                                                {
                                                for(let at = 0;at<response3.data.length;at++){
                                                    let atelement = response3.data[at];
                                                    if(atelement[0]===element[4])
                                                    {
                                                        data92.push(atelement[0]);
                                                        data92.push(atelement[1]);
                                                        data92.push(atelement[2]);
                                                        datacheck = true;
                                                        break;
                                                    }
                                                }
                                               }
                                               if(!datacheck || clientdata)
                                               {
                                                   data92[0] = "";
                                                   data92[1] = "";
                                                   data92[2] = "";
                                               }
                                                       arr2.push(element[0]);
                                                       arr2.push(element[1]);
                                                       arr2.push(element[2]);
                                                       arr2.push(element[3]);
                                                       arr2.push(element[4]);
                                                       arr2.push(element[5]);
                                                       arr2.push(element[6]);
                                                       arr2.push(element[7]);
                                                       arr2.push(element[8]);
                                                       arr2.push(element[9]);
                                                       arr2.push(element[10]);
                                                       arr2.push(element[11]);
                                                       arr2.push(element3[0]);
                                                       arr2.push(element3[1]);
                                                       arr2.push(element3[2]);
                                                       arr2.push(element3[3]);
                                                       arr2.push(element3[4]);
                                                       arr2.push(element3[5]);
                                                       arr2.push(checking);
                                                       arr2.push(data92[0]);
                                                       arr2.push(data92[1]);
                                                       arr2.push(data92[2]);

                                            }
                                        }
                                                   data.push(arr2);
                                                   arr2=[];
                                                   checking = false;
                                    }
                                }
                        }

                    }
                    return callback(data);
                })
            })
        });
                }
            });
}
exports.trendingHashtags = function trendingHashtags(timestamp,callback)
{
    client.get("Hashtagf",(err,response)=>
    {
        if(err)
        {
            throw err;
        }
        else
        {
            //client.get("Hashtags",(err1,response1)=>
            //{
              //  if(err1)
               // {
                 //   throw err1;
                //}else
                //{
                  //  let  t;
                   // response1 = JSON.parse(response1);
                    //response2 = response1.data;
                    //for (let index = 0; index < response2.length; index++) {
                      //  for(let j = 0;j<response2.length-index-1;j++)
                       // {
                         //   let element1 = response2[j];
                          //  let element2 = response2[j+1];
                           // if(element1[1]>element2[1])
                            //{
                              //  t = element1;
                                //element1 = element2;
                                //element2 = t;
                            //}

                        //}
                    //}
                    response = JSON.parse(response);
                    let arr = response.data;
                    let arr1 = []
                    let arr2 = []
                    for (let index = 0; index<arr.length; index++) {
                        const element = arr[index];
                        arr2.push(element[2]);
                                }
                                 arr2 = arr2.sort();
                                 console.log(arr2)

                                 for (let index = 0; index<arr2.length; index++) {
                                    for(let j = 0;j<arr.length;j++)
                                    {
                                        let element = arr[j];
                                        if(arr2[index]===element[2])
                                        {
                                            arr1.push(element);
                                        }
                                    }
                                 }
                                 let arr3 = []
                                 for(let index=0;index<arr2.length;index++)
                                 {
                                     let element = arr1[index];
                                     arr3.push(element);
                                 }

                                /**  for (let index = 0; index < arr.length; index++) {
                                    const element = arr[index];
                                    for(let j = 0;j<arr2.length;j++)
                                    {
                                        if(element[2]===arr2[j])
                                        {
                                            arr1.push(element);
                                            break;
                                        }
                                    }
                                //}*/
                    return callback(arr3);
                }
            })
        }
    //        })
      //  }
    //})
//}
exports.getFollower = function getFollower(uid,callback)
{
    let data = []
    let newdata = []
    client.get("follower",(err,response)=>
    {
        client.get("users",(err1,response1)=>
        {

        if(err1)
        {
            throw err1;
        }
        if(err)
        {
            throw err;
        }
        else
        {
            response = JSON.parse(response);
            response = response.data;
            response1 = JSON.parse(response1)
            response1 = response1.data;
            for(let i = 0;i<response.length;i++)
            {
                newdata = [];
                let element =  response[i];
                if(element[0]===uid)
                {
                    let firstname = element[2]
                    let lastname =element[3]
                    let username = element[4];
                    for(let j=0;j<response1.length;j++)
                    {

                    let likelement = response1[j]
                    if(likelement[5]===element[1])
                    {
                   // let firstname = aes256.decrypt("hello",element[2]).toString();
//                    let profile = aes256.decrypt("hello",element[5]).toString();
                    newdata.push(element[0],element[1],firstname,lastname,username,element[5],likelement[3]);
                    data.push(newdata);
                    }
                }
                }
            }
            return callback(data);
        }
    })
})
}

exports.singleFeed = function singleFeed(tid,uid,callback)
{
    let arr2 = [];
    client.get("model",(err,response)=>
    {
        if(err)
        {
            throw err;
        }
        client.get("users",(err1,response1)=>
        {
            if(err1)
            {
                throw err1
            }
            client.get("likes",(err2,response2)=>
            {
                response = JSON.parse(response)
                response1 = JSON.parse(response1)
                response2 = JSON.parse(response2)
                client.get("data",(err3,response3)=>
                {
                    let clientdata = false;
                    console.log(response3);
                    if(err3||response3===null)
                    {
                        clientdata = true;

                    }
                    console.log(clientdata,"checking client")
                    response3 = JSON.parse(response3);
                if(err2||response2==null)
                {
                    for (let index = 0; index < response.data.length; index++) {
                        const element = response.data[index];
                        if(element[4]===tid)
                        {
                            for (let index1 = 0; index1 < response1.data.length; index1++) {
                                const element1 = response1.data[index1];
                                if(element1[5]===element[5])
                                {
                                    let data92 = [];
                                    let datacheck = false;
                                    if(!clientdata)
                                    {
                                    for(let at = 0;at<response3.data.length;at++){
                                        let atelement = response3.data[at];
                                        console.log(`${atelement[2]}===${element[4]}`);
                                        if(atelement[0]===element[4])
                                        {
                                            data92.push(atelement[0]);
                                            data92.push(atelement[1]);
                                            data92.push(atelement[2]);
                                            datacheck = true;
                                            break;
                                        }
                                    }
                                   }
                                   if(!datacheck || clientdata)
                                   {
                                       data92[0] = "";
                                       data92[1] = "";
                                       data92[2] = "";
                                   }
                                    arr2.push(element[0]);
                                    arr2.push(element[1]);
                                    arr2.push(element[2]);
                                    arr2.push(element[3]);
                                    arr2.push(element[4]);
                                    arr2.push(element[5]);
                                    arr2.push(element[6]);
                                    arr2.push(element[7]);
                                    arr2.push(element[8]);
                                    arr2.push(element[9]);
                                    arr2.push(element[10]);
                                    arr2.push(element[11]);
                                    arr2.push(element1[0]);
                                    arr2.push(element1[1]);
                                    arr2.push(element1[2]);
                                    arr2.push(element1[3]);
                                    arr2.push(element1[4]);
                                    arr2.push(element1[5]);
                                    arr2.push(data92[0]);
                                    arr2.push(data92[1]);
                                    arr2.push(data92[2]);
                                    arr2.push(false);
                                }
                            }
                        }
                    }

                }
                else
                {
                    let checking = false;
                    for (let index = 0; index < response.data.length; index++) {
                        const element = response.data[index];
                        if(element[4]===tid)
                        {
                            for (let index1 = 0; index1 < response1.data.length; index1++) {
                                const element1 = response1.data[index1];
                                if(element1[5]===element[5])
                                {
                                    for(let im="0";im<response2.data.length;im++)
                                    {
                                        let imelement = response2.data[im];
                                        if(imelement[2]===element[4]&&imelement[1]===uid)
                                        {
                                            checking=true;
                                            break;
                                        }
                                    }
                                    let data92 = [];
                                    let datacheck = false;
                                    if(!clientdata)
                                    {
                                    for(let at = 0;at<response3.data.length;at++){
                                        let atelement = response3.data[at];
                                        console.log(`${atelement[2]}===${element[4]}`);

                                        if(atelement[0]===element[4])
                                        {
                                            data92.push(atelement[0]);
                                            data92.push(atelement[1]);
                                            data92.push(atelement[2]);
                                            datacheck = true;
                                            break;
                                        }
                                    }
                                   }
                                   if(!datacheck || clientdata)
                                   {
                                       data92[0] = "";
                                       data92[1] = "";
                                       data92[2] = "";
                                   }
                                    arr2.push(element[0]);
                                    arr2.push(element[1]);
                                    arr2.push(element[2]);
                                    arr2.push(element[3]);
                                    arr2.push(element[4]);
                                    arr2.push(element[5]);
                                    arr2.push(element[6]);
                                    arr2.push(element[7]);
                                    arr2.push(element[8]);
                                    arr2.push(element[9]);
                                    arr2.push(element[10]);
                                    arr2.push(element[11]);
                                    arr2.push(element1[0]);
                                    arr2.push(element1[1]);
                                    arr2.push(element1[2]);
                                    arr2.push(element1[3]);
                                    arr2.push(element1[4]);
                                    arr2.push(element1[5]);
                                    arr2.push(checking);
                                    arr2.push(data92[0]);
                                    arr2.push(data92[1]);
                                    arr2.push(data92[2]);
                                }
                            }
                        }
                    }
                }
                return callback(arr2);
            })
        })
    })
});
}








exports.trendingTweets = function trendingTweets(uid,timestamp,callback)
{
    let data = [];
    client.get("model",(err,response)=>
    {
        if(err)
        {
            throw err;
        }
        else
        {
    response = JSON.parse(response);
            client.get("likes",(err1,response1)=>
            {

                client.get("users",(err2,response2)=>
                {

                    if(err2)
                    {
                        throw err2;
                    }
                    client.get("data",(err3,response3)=>
                        {
                            let clientdata = false;
                            if(err3||response3===null)
                            {
                                clientdata = true;
                            }
                    response2 = JSON.parse(response2);
                    response3=JSON.parse(response3);
                    let arr2 = [];
                response1 = JSON.parse(response1);
                if(err1||response1===null)
                {
                    for(let i = 0;i<response.data.length;i++)
                    {
                            let element = response.data[i];
                                if(element[7]==="0"&&element[6]==="0"&&parseInt(timestamp)<=parseInt(element[8]))
                                {
                                    for(let l = 0;l<response2.data.length;l++)
                                    {
                                        let element3 = response2.data[l];
                                        if(element3[5]===element[5])
                                        {
                                            let data92 = [];
                                    let datacheck = false;
                                    if(!clientdata)
                                    {
                                    for(let at = 0;at<response3.data.length;at++){
                                        let atelement = response3.data[at];
                                        console.log(`${atelement[2]}===${element[4]}`);

                                        if(atelement[0]===element[4])
                                        {
                                            data92.push(atelement[0]);
                                            data92.push(atelement[1]);
                                            data92.push(atelement[2]);
                                            datacheck = true;
                                            break;
                                        }
                                    }
                                   }
                                   if(!datacheck || clientdata)
                                   {
                                       data92[0] = "";
                                       data92[1] = "";
                                       data92[2] = "";
                                   }

                                                   arr2.push(element[0]);
                                                   arr2.push(element[1]);
                                                   arr2.push(element[2]);
                                                   arr2.push(element[3]);
                                                   arr2.push(element[4]);
                                                   arr2.push(element[5]);
                                                   arr2.push(element[6]);
                                                   arr2.push(element[7]);
                                                   arr2.push(element[8]);
                                                   arr2.push(element[9]);
                                                   arr2.push(element[10]);
                                                   arr2.push(element[11]);
                                                   arr2.push(element3[0]);
                                                   arr2.push(element3[1]);
                                                   arr2.push(element3[2]);
                                                   arr2.push(element3[3]);
                                                   arr2.push(element3[4]);
                                                   arr2.push(element3[5]);
                                                   arr2.push(false);
                                                   arr2.push(data92[0]);
                                                   arr2.push(data92[1]);
                                                   arr2.push(data92[2])
                                        }
                                        }
                                        data.push(arr2);
                                        arr2=[];
                                    }

                            }
                    }
                else
                {
                    let checking = false;
                    for(let i = 0;i<response.data.length;i++)
                    {
                            let element = response.data[i];
                                if(element[7]==="0"&&element[6]==="0"&&parseInt(timestamp)<=parseInt(element[8]))
                                {
                                    for(let l = 0;l<response2.data.length;l++)
                                    {
                                        let element3 = response2.data[l];
                                        if(element3[5]===element[5])
                                        {
                                            for(let im="0";im<response1.data.length;im++)
                                    {
                                        let imelement = response1.data[im];
                                        if(imelement[2]===element[4]&&imelement[1]===uid)
                                        {
                                            checking=true;
                                            break;
                                        }
                                    }
                                    let data92 = [];
                                    let datacheck = false;
                                    if(!clientdata)
                                    {
                                    for(let at = 0;at<response3.data.length;at++){
                                        let atelement = response3.data[at];
                                        console.log(`${atelement[2]}===${element[4]}`);

                                        if(atelement[0]===element[4])
                                        {
                                            data92.push(atelement[0]);
                                            data92.push(atelement[1]);
                                            data92.push(atelement[2]);
                                            datacheck = true;
                                            break;
                                        }
                                    }
                                   }
                                   if(!datacheck || clientdata)
                                   {
                                       data92[0] = "";
                                       data92[1] = "";
                                       data92[2] = "";
                                   }

                                                   arr2.push(element[0]);
                                                   arr2.push(element[1]);
                                                   arr2.push(element[2]);
                                                   arr2.push(element[3]);
                                                   arr2.push(element[4]);
                                                   arr2.push(element[5]);
                                                   arr2.push(element[6]);
                                                   arr2.push(element[7]);
                                                   arr2.push(element[8]);
                                                   arr2.push(element[9]);
                                                   arr2.push(element[10]);
                                                   arr2.push(element[11]);
                                                   arr2.push(element3[0]);
                                                   arr2.push(element3[1]);
                                                   arr2.push(element3[2]);
                                                   arr2.push(element3[3]);
                                                   arr2.push(element3[4]);
                                                   arr2.push(element3[5]);
                                                   arr2.push(checking);
                                                   arr2.push(data92[0]);
                                                   arr2.push(data92[1]);
                                                   arr2.push(data92[2]);
                                        }
                                        }
                                        data.push(arr2);
                                        arr2=[];
                                        checking = false;
                                    }

                            }


                }
                return callback(data);
            })
        })
    })
}
    })
}

exports.checkLike = function checkLike(tid,uid,callback)
{
    client.get("likes",(err,response)=>
    {
        console.log(response)
        if(err)
        {
            throw err;
        }
        else if(response===null)
        {
            return callback({response:false,lid:""});
        }
        else
        {
            console.log("why this")
            response = JSON.parse(response);
            response  = response.data;
            let check = false;
            let lid = "";
            for(let i = 0;i<response.length;i++){
                const element = response[i];
                console.log(`${element[1]}===${uid}&&${element[2]}===${tid}`,"why not");
                if(element[1]===uid&&element[2]===tid)
                {
                 //   console.log("Checking the working")
                    check = true;
                    lid = element[0];
                    break;
                }
            }
            return callback({response:check,lid:lid});
        }
    })
}
        //model[] memory hello = new model[](c);
        //c=0;
        //for(uint i = 0;i<data2.length;i++)
        //{
          //  for(uint j=0;j<ar.length;j++)
            //{
              //  if(keccak256(bytes(ar[j]))==keccak256(bytes(data2[i].uid))&&keccak256(bytes(data2[i].mid))==keccak256(bytes("0"))&&keccak256(bytes(data2[i].rid))==keccak256(bytes("0"))&&stringToUint(_timestamp)<=stringToUint(data2[i].extra))
                //{
                  //  for(uint k=0;k<like.length;k++)
                    //{
                      //  if(keccak256(bytes(data2[i].tid))==keccak256(bytes(like[k].tid))&&keccak256(bytes(like[k].uid))==keccak256(bytes(_uid)))
                        //{
                          //  hello[c] = model(data2[i].txt,data2[i].data,data2[i].image,data2[i].type1,data2[i].tid,data2[i].uid,data2[i].rid,"1",data2[i].extra,data2[i].ln,data2[i].rt,data2[i].rp);
                            //c++;
                        //}
                        //else
                        //{
                          //  hello[c] = model(data2[i].txt,data2[i].data,data2[i].image,data2[i].type1,data2[i].tid,data2[i].uid,data2[i].rid,"0",data2[i].extra,data2[i].ln,data2[i].rt,data2[i].rp);
                            //c++;
                        //}
                    //}

                //}
            //}
        //}
//}