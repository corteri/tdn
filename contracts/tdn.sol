// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
contract tdn
{
  struct extraData{
    string tid;
    string[] attachment;
    string[] link;
  }
    //struct mention{
     //string mid;
     //string uid;
    // string tid;
  //   string timestamp;
//    }

    struct image{
      string tid;
      string hash1;
      string type1;
      string uid;
      string mid;
    }
    struct model{
        string txt;
        string data;
        string image;
        string type1;
        string tid;
        string uid;
        string rid;
        string mid;
        string extra;
        uint ln;
        uint rt;
        uint rp;
    }
    struct likes{
        string lid;
        string uid;
        string tid;
        string rid;
        string e1;
        string mid;
        string timestamp;
    }
    struct hashtags{
        uint hid;
        string uid;
        string tid;
        string hashtag;
        string timestamp;
    }
    struct hashtagf
    {
        uint hid;
        string hashtag;
        uint freq;
    }
    uint256 public count  = 0;
    uint256 public count1  = 0;

    model[] public data2;
    likes[] public like;
    hashtags[] public Hashtags;
    hashtagf[] public Hashtagf;
    //mention[] public people1;
    image[] public image1;
    extraData[] public attachment;
    function insertData(string[] memory _attachment,string[] memory _link,string memory  _tid) public
    {
      attachment.push(extraData(_tid,_attachment,_link));
    }
    function getData() view public returns(extraData[] memory)
    {
      return(attachment);
    }
    function insertHash(string memory tid,string memory hash1,string memory type1,string memory uid,string memory mid) public
    {
      image1.push(image(tid,hash1,type1,uid,mid));
    }
    function getAllImages() public view returns(image[] memory)
    {
      return (image1);
    }
    function getAllModel() public view returns(model[] memory)
 {
     return(data2);
 }
  function getAllLikes() public view returns(likes[] memory)
{
     return(like);
}
  function getAllHashtags() public view returns(hashtags[] memory)
{
     return(Hashtags);
}
  function getAllHashtagf() public view returns(hashtagf[] memory)
{
     return(Hashtagf);
}
//  function getAllMention() public view returns(mention[] memory)
//{
   //  return(people1);
//}

     //function setPeople(string[] memory _people,string memory timestamp,string memory uid,string memory tid) public
    //{
       // for(uint i =0;i<_people.length;i++)
      //  {
     //     people1.push(mention(_people[i],uid,tid,timestamp));
    //    }
    //}

    function setHastagf(string[] memory _hashtag) public
    {
        uint c  = 0;
        uint c1 = 5;
        if(Hashtagf.length>0)
        {
        for(uint i = 0;i<_hashtag.length;i++)
        {
            for(uint j = 0;j<Hashtagf.length;j++)
            {
                if(keccak256(bytes(Hashtagf[j].hashtag))==keccak256(bytes(_hashtag[i])))
                { c1 = 1;
                    c = Hashtagf[j].freq+1;
                    Hashtagf[j].freq = c;
                    c=0;
                }
            }
            if(c1==5)
            {
                Hashtagf.push(hashtagf(count,_hashtag[i],1));
                    count++;
                    c1 = 0;
            }
        }
        }
        else
        {
              for(uint i = 0;i<_hashtag.length;i++)
        {
            Hashtagf.push(hashtagf(count,_hashtag[i],1));
                    count++;
        }
        }
    }

    function setHashtag(string[] memory _hashtag,string memory timestamp,string memory uid,string memory tid) public
    {
        for(uint i =0;i<_hashtag.length;i++)
        {
          Hashtags.push(hashtags(count1,uid,tid,_hashtag[i],timestamp));
        }
    }
    function dotdn(string memory _txt,string memory _data,string memory _image,string memory _type1,string memory _tid,string memory _uid,string memory _rid,string memory _mid,string memory timestamp) public
    {
        data2.push(model(_txt,_data,_image,_type1,_tid,_uid,_rid,_mid,timestamp,0,0,0));
    }
    function doLike(string memory _lid,string memory _uid,string memory _tid,string memory _rid,string memory _e1,string memory _mid,string memory timestamp) public
    {
        like.push(likes(_lid,_uid,_tid,_rid,_e1,_mid,timestamp));
        uint c1 = 0;
        for(uint i = 0;i<data2.length;i++)
        {
            if(keccak256(bytes(_tid))==keccak256(bytes(data2[i].tid)))
            {
                c1 = data2[i].ln+1;
                data2[i].ln = c1;
            }
        }
    }
    function unlike(string memory _uid,string memory _tid) public
    {
           for(uint i = 0;i<like.length;i++)
            {
                if(keccak256(bytes(like[i].tid))==keccak256(bytes(_tid))&&keccak256((bytes(like[i].uid)))==keccak256(bytes(_uid)))
                {
                    delete like[i];
                }
            }
          uint c1 = 0;
        for(uint i = 0;i<data2.length;i++)
        {
            if(keccak256(bytes(_tid))==keccak256(bytes(data2[i].tid)))
            {
                c1 = data2[i].ln-1;
                data2[i].ln = c1;
            }
        }
    }
     function sendRetweet(string memory _uid,string memory _fid,string  memory _tid,string memory timestamp,string memory _comment) public
    {
        model memory m1;
        for(uint i = 0;i<data2.length;i++)
        {
           if(keccak256(bytes(data2[i].uid))==keccak256(bytes(_fid))&&keccak256(bytes(data2[i].tid))==keccak256(bytes(_tid)))
           {
             data2[i].rt = data2[i].rt+1;
               m1 = model(_comment,"0","0","0",_tid,_fid,_uid,"0",timestamp,data2[i].ln,data2[i].rt+1,data2[i].rp);
               break;
           }
        }
        data2.push(m1);
    }
 function sendReply(string memory _txt,string memory _data,string memory _image,string memory _type1,string memory _tid,string memory _uid,string memory _mid,string memory extra,string memory timestamp) public
    {
      for(uint i = 0;i<data2.length;i++)
      {
       // if(keccak256(bytes(data2[i].tid))==keccak256(bytes(extra))&&keccak256(bytes(data2[i].rid))==keccak256(bytes("0"))&&keccak256(bytes(data2[i].mid))==keccak256(bytes("0")))
        if(keccak256(bytes(data2[i].tid))==keccak256(bytes(extra)))
        {
          data2[i].rp = data2[i].rp+1;
          break;
        }
      }
        data2.push(model(_txt,_data,_image,_type1,_tid,_uid,timestamp,_mid,extra,0,0,0));
    }
    //function getTweet(string memory _uid) view public returns(model[] memory)
    //{
      //  uint c = 0;
        //for(uint i=0;i<data2.length;i++)
        //{
          //  if(keccak256(bytes(data2[i].uid))==keccak256(bytes(_uid))&&keccak256(bytes(data2[i].mid))==keccak256(bytes("0"))&&keccak256(bytes(data2[i].rid))==keccak256(bytes("0")))
           // {
             //   c++;
            //}
        //}
        //model[] memory hello = new model[](c);
        //uint c1 = 0;
          //for(uint i=0;i<data2.length;i++)
        //{
          //    if(keccak256(bytes(data2[i].uid))==keccak256(bytes(_uid))&&keccak256(bytes(data2[i].mid))==keccak256(bytes("0"))&&keccak256(bytes(data2[i].rid))==keccak256(bytes("0")))
            //  {
              //    hello[c1] = data2[i];
               //   c1++;
              //}
        //}
        //return hello;
    //}
    //function getRetweet(string memory _tid) view public returns(model[] memory)
    //{
       // uint c = 0;
        //for(uint i=0;i<data2.length;i++)
        //{
          //  if(keccak256(bytes(data2[i].tid))==keccak256(bytes(_tid))&&keccak256(bytes(data2[i].mid))==keccak256(bytes("0"))&&keccak256(bytes(data2[i].rid))!=keccak256(bytes("0")))
           // {
             //   c++;
            //}
        //}
        //model[] memory hello = new model[](c);
        //uint c1 = 0;

          //for(uint i=0;i<data2.length;i++)
        //{
          //     if(keccak256(bytes(data2[i].tid))==keccak256(bytes(_tid))&&keccak256(bytes(data2[i].mid))==keccak256(bytes("0"))&&keccak256(bytes(data2[i].rid))!=keccak256(bytes("0")))
           // {
             //     hello[c1] = data2[i];
              //    c1++;
              //}
        //}
        //return hello;
    //}
   // function getReply(string memory _tid , string memory _uid) view  public returns(model[] memory){
     // uint c = 0;
       // for(uint i=0;i<data2.length;i++)
        //{
          //  if(keccak256(bytes(data2[i].tid))==keccak256(bytes(_tid))&&keccak256(bytes(data2[i].mid))==keccak256(bytes(_uid))&&keccak256(bytes(data2[i].rid))==keccak256(bytes("0")))
           // {
             //   c++;
            //}
        //}
        //model[] memory hello = new model[](c);
        //c=0;
          //for(uint i=0;i<data2.length;i++)
        //{
          //        if(keccak256(bytes(data2[i].tid))==keccak256(bytes(_tid))&&keccak256(bytes(data2[i].mid))==keccak256(bytes(_uid))&&keccak256(bytes(data2[i].rid))==keccak256(bytes("0")))
           // {
             //     hello[c] = data2[i];
               //   c++;
              //}
        //}
        //return hello;
    //}
   // function getFeed(string memory _uid,string[] memory ar,string memory _timestamp) view public returns(model[] memory)
    //{
      //  uint c=0;
       // for(uint i = 0;i<data2.length;i++)
        //{
          //  for(uint j=0;j<ar.length;j++)
            //{
              //  if(keccak256(bytes(ar[j]))==keccak256(bytes(data2[i].uid))&&keccak256(bytes(data2[i].mid))==keccak256(bytes("0"))&&keccak256(bytes(data2[i].rid))==keccak256(bytes("0"))&&stringToUint(_timestamp)<=stringToUint(data2[i].extra))
               // {
                 //   c++;
                //}
            //}
        //}
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
//function trendingTweet(string memory  timestamp,string memory _uid) public view returns(model[] memory)
  //  {
    //    uint c  = 0;
      //  for(uint i =0;i<data2.length;i++)
        //{
         //   if(stringToUint(data2[i].extra)>=stringToUint(timestamp))
           // {
             //   c++;

            //}
        //}
        //model[] memory  hello = new model[](c);
        //c=0;
        //for(uint i=0;i<data2.length;i++)
        //{
          //  if(stringToUint(data2[i].extra)>=stringToUint(timestamp))
            //{
              //   for(uint k=0;k<like.length;k++)
                //    {
                  //      if(keccak256(bytes(data2[i].tid))==keccak256(bytes(like[k].tid))&&keccak256(bytes(like[k].uid))==keccak256(bytes(_uid)))
                    //    {
                     //       hello[c] = model(data2[i].txt,data2[i].data,data2[i].image,data2[i].type1,data2[i].tid,data2[i].uid,data2[i].rid,"1",data2[i].extra,data2[i].ln,data2[i].rt,data2[i].rp);
                       //     c++;
                        //}
                        //else
                        //{
                          //  hello[c] = model(data2[i].txt,data2[i].data,data2[i].image,data2[i].type1,data2[i].tid,data2[i].uid,data2[i].rid,"0",data2[i].extra,data2[i].ln,data2[i].rt,data2[i].rp);
                            //c++;
                        //}
                    //}
            //}
        //}
        //return(hello);
     //}
 //    function trendingHashtags(string memory timestamp) view public returns (hashtagf[] memory) 
    // {
       //  uint c = 0;
         //string memory lastweet;
         //for(uint i = 0;i<Hashtagf.length;i++)
         //{
            // lastweet = Hashtags[Hashtags.length-1].timestamp;
             //if(stringToUint(lastweet)>=stringToUint(timestamp))
             //{
               //  c++;
            // }
         //}
         //hashtagf[] memory hello = new hashtagf[](c);
         //c=0;
           // for(uint i = 0;i<Hashtagf.length;i++)
         //{
          //   lastweet = Hashtags[Hashtags.length-1].timestamp;
            // if(stringToUint(lastweet)>=stringToUint(timestamp))
             //{
                // hello[c] = Hashtagf[i];
                 //c++;
             //}
         //}
         //return(hello);
     //}
     //function getHashtagsData(string memory hashtag,string memory uid) view public returns(model[] memory)
     //{
       //  uint c=0;
         //for(uint i = 0;i<Hashtags.length;i++)
         //{
            // if(keccak256(bytes(Hashtags[i].hashtag))==keccak256(bytes(Hashtagf[i].hashtag)))
             //{
                // for(uint j=0;j<data2.length;j++)
                 //{
                   //  if(keccak256(bytes(""))==keccak256(bytes("")))
                     //{
                       //  c++;
                     //}
                 //}
             //}
         //}
         //model[] memory hello = new model[](c);
         //c=0;
         //for(uint i = 0;i<Hashtags.length;i++)
         //{
           //  if(keccak256(bytes(Hashtags[i].hashtag))==keccak256(bytes(Hashtagf[i].hashtag)))
             //{
               //  for(uint j=0;j<data2.length;j++)
                 //{
                   //  if(keccak256(bytes(""))==keccak256(bytes("")))
                     //{
                       //   for(uint k=0;k<like.length;k++)
                        //{
                        //if(keccak256(bytes(data2[i].tid))==keccak256(bytes(like[k].tid))&&keccak256(bytes(like[k].uid))==keccak256(bytes(uid)))
                        //{
                          //  hello[c] = model(data2[i].txt,data2[i].data,data2[i].image,data2[i].type1,data2[i].tid,data2[i].uid,data2[i].rid,"1",data2[i].extra,data2[i].ln,data2[i].rt,data2[i].rp);
                           // c++;
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
          //return(hello);
     //}
  // function stringToUint(string memory s) pure internal returns (uint result) {
    //    bytes memory b = bytes(s);
      //  uint i;
       // result = 0;
        //for (i = 0; i < b.length; i++) {
          //  uint c = uint(uint8(b[i]));
           // if (c >= 48 && c <= 57) {
             //   result = result * 10 + (c - 48);
            //}
        //}
        //return result;/
//}
}