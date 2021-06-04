// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./maincontract.sol";
contract profilecontract is maincontract
{
    struct follower{
        string uid;
        string fid;
        string firstname;
        string lastname;
        string username;
        string status;
        string profile;
        }
    struct profile{
        string uid;
        string profile;
        string cover;
    }
    follower[]  public _follower;
    profile[] public  _profile;
    function getProfile(string memory _uid) view public returns(string memory,string memory)
    {
        for(uint i = 0;i<_profile.length;i++)
        {
            if(keccak256(bytes(_uid))==keccak256(bytes(_profile[i].uid)))
            {
                return(_profile[i].profile,_profile[i].cover);
            }
        }
    }

    function sendAllFollowerData() view public returns(follower[] memory)
    {
        return(_follower);
    }
    function sendAllProfile() view public returns(profile[] memory)
    {
        return(_profile);
    }

   function updateProfile(string memory _uid,string memory _e12)  public
    {
        for(uint i = 0;i<_profile.length;i++)
        {
            if(keccak256(bytes(_uid))==keccak256(bytes(_profile[i].uid)))
            {
                _profile[i].profile = _e12;
            }
        }
    }
 function updateCover(string memory _uid,string memory _e12)  public
    {
        for(uint i = 0;i<_profile.length;i++)
        {
            if(keccak256(bytes(_uid))==keccak256(bytes(_profile[i].uid)))
            {
                _profile[i].cover = _e12;
            }
        }
    }

      function checkProfile(string memory _uid) view public returns(bool,bool,uint)
    {
        bool hello1 = false;
        bool hello2 = false;
        uint c = 0;
        for(uint i = 0;i<_profile.length;i++)
        {
            if(keccak256(bytes(_uid))==keccak256(bytes(_profile[i].uid)))
            {
                 c++;
                if(keccak256(bytes(_profile[i].profile))==keccak256(bytes("0")))
                {
                    hello1 = true;
                }

                 if(keccak256(bytes(_profile[i].cover))==keccak256(bytes("0")))
                {
                    hello2 = true;
                }

            }
        }
        return (hello1,hello2,c);
    }




    function checkFriend(string memory _uid,string memory _fid) view public returns(bool,string memory)
    {
        bool hello = false;
        string memory status;
        for(uint i = 0 ; i<_follower.length;i++)
        {
            if(keccak256(bytes(_follower[i].uid))==keccak256(bytes(_uid))&&keccak256(bytes(_follower[i].fid))==keccak256(bytes(_fid)))
            {
                hello = true;
                status = _follower[i].status;
            }
        }
        return (hello,status);
    }

function deleteFriend(string memory _uid,string memory _fid)  public
{
    for(uint i =0;i<_follower.length;i++)
    {
        if(keccak256(bytes(_follower[i].uid))==keccak256(bytes(_uid))&&keccak256(bytes(_follower[i].fid))==keccak256(bytes(_fid))||keccak256(bytes(_follower[i].uid))==keccak256(bytes(_fid))&&keccak256(bytes(_follower[i].fid))==keccak256(bytes(_uid)))
        {
            delete _follower[i];
        }
    }

}

function bothFriend(string memory _uid,string memory _fid)  public
{
    for(uint i =0;i<_follower.length;i++)
    {
        if(keccak256(bytes(_follower[i].uid))==keccak256(bytes(_uid))&&keccak256(bytes(_follower[i].fid))==keccak256(bytes(_fid))||keccak256(bytes(_follower[i].uid))==keccak256(bytes(_fid))&&keccak256(bytes(_follower[i].fid))==keccak256(bytes(_uid)))
        {
            _follower[i].status = "3";
        }
    }

}




    function insert_follower(string  memory _uid, string memory _fid,string memory firstname1,string memory lastname1,string memory username1,string memory profile1,string memory firstname2,string memory lastname2,string memory username2,string memory profile2) public
    {

        _follower.push(follower(_uid,_fid,firstname2,lastname2,username2,"1",profile2));
        _follower.push(follower(_fid,_uid,firstname1,lastname1,username1,"2",profile1));
    }

    function insert_profile(string memory _uid,string memory _profile1,string memory _cover) public
    {
        _profile.push(profile(_uid,_profile1,_cover));
    }

    function getFriendCount(string memory _uid) view public returns(uint , uint)
    {
        uint c= 0;
        uint c1 = 0;
        for(uint i =0;i<_follower.length;i++)
        {
            if(keccak256(bytes(_uid))==keccak256(bytes(_follower[i].uid))&&keccak256(bytes("1"))==keccak256(bytes(_follower[i].status))||keccak256(bytes("3"))==keccak256(bytes(_follower[i].status)))
            {
                c++;
            }
            if(keccak256(bytes(_uid))==keccak256(bytes(_follower[i].uid))&&keccak256(bytes("2"))==keccak256(bytes(_follower[i].status))||keccak256(bytes("3"))==keccak256(bytes(_follower[i].status)))
            {
                c1++;
            }
        }
        return (c,c1);
    }


      function getfriend(string memory _uid) view public returns(follower[] memory)
    {
        uint c = 0;
        for(uint i = 0;i<_follower.length;i++)
        {
            if(keccak256(bytes(_uid))==keccak256(bytes(_follower[i].uid)))
            {
                c++;
            }
        }
        if(c>0)
        {
         follower[] memory new_follower = new follower[](c);
         uint c1 = 0;
           for(uint i = 0;i<_follower.length;i++)
        {
            if(keccak256(bytes(_uid))==keccak256(bytes(_follower[i].uid)))
            {
                new_follower[c1] = follower(_follower[i].uid,_follower[i].fid,_follower[i].firstname,_follower[i].lastname,_follower[i].username,_follower[i].status,_follower[i].profile);
            c1++;
            }
        }
        return (new_follower);
        }
        else
        {
            follower[] memory new_follower = new follower[](0);
            return (new_follower);
        }
    }

}