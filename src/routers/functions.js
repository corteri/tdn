const profile = require('C:/Users/aadit/tdn1/build/contracts/profilecontract.json');
const maincontract = require('C:/Users/aadit/tdn1/build/contracts/maincontract.json');
const notification = require('C:/Users/aadit/tdn1/build/contracts/notification.json');
const profileabi = profile.abi;
const profileaddress = "0xae9D6020205BA91fF8d67588f2e044a7be3F38A3";
const mainabi = maincontract.abi;
const mainaddress ="0x854bB10E0fa952e69CBC810E7bD25A460d35c7ba";
const notificationabi = notification.abi;
const notificationaddress = "0x1623CdC9368d0314924eB1244618f374d7Ef4076";
const web3 = require('web3');
const Web3 = new web3("https://ropsten.infura.io/v3/d53201e69f9e4abcb3ff6ddb42ed1c99");
const dojson = require('C:/Users/aadit/tdn1/build/contracts/tdn.json');
const doaddress ="0x31b5887FD725F4a7D589D77cd993452000851A02";
const doabi = dojson.abi;
const tdnfunctions = require('./tdn');
const tdncontract = new Web3.eth.Contract(doabi,doaddress);
const profilecontract = new Web3.eth.Contract(profileabi,profileaddress);
const notificationcontract = new Web3.eth.Contract(notificationabi,notificationaddress);
Web3.eth.accounts.wallet.add("b13538ad5d5081ce3321878241e3604dbe8205734ff375cfe6a43dcbdd95d269");

exports.hashtags = function hashtags(words,callback)
{
let tagslistarr1 = words.match(/(^|\s)#([^ ]*)/g);

if(tagslistarr1===null)
{
    return callback({response:false});
}
else
{
    const count = {}
    const result = []
    tagslistarr1.forEach(item => {
        if (count[item]) {
           count[item] +=1
           return
        }
        count[item] = 1
    })
    for (let prop in count){
        if (count[prop] >=1){
            prop = prop.replace('#','');
            prop = prop.trim();
            result.push(prop)
        }
    }
    if(result.length>0)
    {
    return callback({response:true,data:result});
}
else
{
    return callback({response:false,data:data})
}}
}
exports.mentions = function mentions(words,callback)
{
let tagslistarr1 = words.match(/(^|\s)@([^ ]*)/g);

if(tagslistarr1===null)
{
    return callback({response:false});
}
else
{
    const count = {}
    const result = []
    tagslistarr1.forEach(item => {
        if (count[item]) {
           count[item] +=1
           return
        }
        count[item] = 1
    })
    for (let prop in count){
        if (count[prop] >=1){
            prop = prop.replace('@','');
            prop = prop.trim();
            result.push(prop)
        }
    }
    //performing mentions task
    if(result.length>0)
    {
        tdnfunctions.getMentionUid(result,(data)=>
        {
            return callback({response:true,data:data});
        })

    }
    else
    {
    return callback({response:false,data:result});
}}
}
exports.sendNotification2 = function sendNotification2(tid,uid,type,sid,notification,attachment,e1,callback)
{
    tdnfunctions.getFollower(sid,(data)=>
    {
        let newdata = [];

        for(let i = 0;i<data.length;i++)
        {
            const element = data[i];
            if(element[5]==="1"||element[5]==="3")
            {
            newdata.push(element[1]);
            }
        }
        if(data.length>0)
        {
            const init2 = async()=>
                    {
                        const new_arr = [];
                        new_arr[0] = uid;
                        new_arr[1] = type;
                        new_arr[2] = tid;
                        new_arr[3] = sid;
                        new_arr[4] = "0";
                        new_arr[5] = notification;
                        new_arr[6] = attachment;
                        new_arr[7] = e1;
                        new_arr[8] = Date.now().toString();
                        const tx = await notificationcontract.methods.insertNotification(new_arr,newdata).encodeABI();
                        await Web3.eth.sendTransaction({
                            from: '0x4202e278bbd654994DfbF52DAD471F66f2477741',
                            to:notificationaddress,
                            data:tx,
                            gas:"900000"
                        }, function(error, hash){
                            if(error)
                            {
                                throw error;
                            }
                            else
                            {
                                return callback({response:"1"});
                            }
                        });
                    }
                    init2();
        }
        else
        {
            return callback({response:"1"});
        }
    })
}




exports.sendNotification = function sendNotification(uid,type,sid,notification,attachment,e1,callback)
{
    const init = async()=>
    {
        await profilecontract.methods.getfriend(sid).call((err,response)=>
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
                    console.log(arr);
                }
                if(arr.length>0)
                {
                }
                else
                {
                    return callback({response:"1"});
                }
            }
        })
    }
    init();
}


exports.singleNotification = function singleNotification(uid,type,sid,notification,attachment,e1,mid,callback)
{
 const init = async()=>
 {
    const new_arr = [];
    new_arr[0] = uid;
    new_arr[1] = type;
    new_arr[2] = "0";
    new_arr[3] = sid;
    new_arr[4] = mid;
    new_arr[5] = notification;
    new_arr[6] = attachment;
    new_arr[7] = e1;
    new_arr[8] = Date.now().toString();
    const tx = await notificationcontract.methods.insertNotification(new_arr,mid).encodeABI();
    await Web3.eth.sendTransaction({
        from: '0x4202e278bbd654994DfbF52DAD471F66f2477741',
        to:notificationaddress,
        data:tx,
        gas:"900000"
    }, function(error, hash){
        if(error)
        {
            throw error;
        }
        else
        {
            return callback({response:"1"});
        }
    });
 }
   init();
}


exports.sendMentions = function sendMentions(uid,type,sid,notification,attachment,e1,mid,callback)
{
    const init = async()=>
    {
                   const new_arr = [];
                        new_arr[0] = uid;
                        new_arr[1] = type;
                        new_arr[2] = "0";
                        new_arr[3] = sid;
                        new_arr[4] = "0";
                        new_arr[5] = notification;
                        new_arr[6] = attachment;
                        new_arr[7] = e1;
                        new_arr[8] = Date.now().toString();
                        let mid1 = [];
                        mid1 = mid;
                        console.log(mid1);
                        const tx = await notificationcontract.methods.insertMention(new_arr,mid1).encodeABI();
                        await Web3.eth.sendTransaction({
                            from: '0x4202e278bbd654994DfbF52DAD471F66f2477741',
                            to:notificationaddress,
                            data:tx,
                            gas:"900000"
                        }, function(error, hash){
                            if(error)
                            {
                                throw error;
                            }
                            else
                            {
                                return callback({response:"1"});
                            }
                        });
                    }
                    init();
}
exports.feed = function feed(uid,callback)
{
    const init = async ()=>
    {
        await profilecontract.methods.getfriend(sid).call((err,response)=>
        {
            if(err)
            {
                throw err;
            }
            else
            {
                let arr = [];
                for (let index = 0; index < response.length; index++) {
                    const element = array[index];
                    arr.push(element[1]);
                }
                if(arr.length>0)
                {
                    const init2= async ()=>
                    {
                        let new_timestamp = Date.now()-25910000;
                        let timestamp2 = new_timestamp.toString();
                        await tdncontract.methods.getFeed(arr,uid,timestamp2).call((err,response)=>
                        {
                            if(err)
                            {
                                throw err;
                            }
                            else
                            {
                                if(response.length>0)
                                {
                                return callback(response);
                                }
                                else
                                {
                                    //calling hashtag
                                }
                            }
                        })
                    }
                    init2();
                }
                else
                {
                    //calling the trending hashtags and its views on the main feed.
                }
            }

    });
    }
    init();
}
//function find_duplicate_in_array(array1,callback){
  //  const count = {}
    //const result = []
    /** array1.forEach(item => {
        if (count[item]) {
           count[item] +=1
           return
        }
        count[item] = 1
    })
    for (let prop in count){
        if (count[prop] >=1){
            result.push(prop)
        }
    }
    return callback(result);
    } */