// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
contract notification
{
    struct notification1{
        string uid;
        string type1;
        string status;
        string sid;
        string[] rid;
        string notification2;
        string attachment;
        string e1;
        string timestamp;
        uint extra;
    }
    struct mention{
        string uid;
        string type1;
        string status;
        string sid;
        string[] rid;
        string notification2;
        string attachment;
        string e1;
        string timestamp;
        uint extra;
    }
    notification1[] public pushnotification;
    mention[] public pushmention;

    function insertNotification(string[] memory ar,string[] memory rid) public
    {
        pushnotification.push(notification1(ar[0],ar[1],ar[2],ar[3],rid,ar[5],ar[6],ar[7],ar[8],0));
    }
    function insertMention(string[] memory ar,string[] memory mid) public
    {
        pushmention.push(mention(ar[0],ar[1],ar[2],ar[3],mid,ar[5],ar[6],ar[7],ar[8],0));
    }
    function getAllNotification() public  view returns(notification1[] memory)
    {
        return(pushnotification);
    }
    function getAllMentions() public view returns(mention[] memory)
    {
        return(pushmention);
    }
    function getNotification(string memory uid) view  public returns(notification1[] memory)
    {
        uint c = 0;
        for(uint i = 0;i<pushnotification.length;i++)
        {
            if(keccak256(bytes(pushnotification[i].status))==keccak256(bytes("0")))
            {
                for(uint j = 0;j<pushnotification[i].rid.length;j++)
                {
                    if(keccak256(bytes(uid))==keccak256(bytes(pushnotification[i].rid[j])))
                    {
                        c++;
                    }
                }
            }
        }
        notification1[] memory  a =  new notification1[](c);
          for(uint i = 0;i<pushnotification.length;i++)
        {
            if(keccak256(bytes(pushnotification[i].status))==keccak256(bytes("0")))
            {
                for(uint j = 0;j<pushnotification[i].rid.length;j++)
                {
                    if(keccak256(bytes(uid))==keccak256(bytes(pushnotification[i].rid[j])))
                    {
                            a[i] = pushnotification[i];
                    }
                }
            }
        }
           return(a);
    }

    function getMention(string memory username) view  public returns(mention[] memory)
    {
        uint c = 0;
        for(uint i = 0;i<pushmention.length;i++)
        {
            if(keccak256(bytes(pushmention[i].status))==keccak256(bytes("0")))
            {
                for(uint j = 0;j<pushnotification[i].rid.length;j++)
                {
                    if(keccak256(bytes(username))==keccak256(bytes(pushnotification[i].rid[j])))
                    {
                        c++;
                    }
                }
            }
        }
        mention[] memory  a =  new mention[](c);
          for(uint i = 0;i<pushmention.length;i++)
        {
            if(keccak256(bytes(pushmention[i].status))==keccak256(bytes("0")))
            {
                for(uint j = 0;j<pushmention[i].rid.length;j++)
                {
                    if(keccak256(bytes(username))==keccak256(bytes(pushmention[i].rid[j])))
                    {
                            a[i] = pushmention[i];
                    }
                }
            }
        }
           return(a);
    }
}