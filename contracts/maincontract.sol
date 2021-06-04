// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
contract maincontract
{
    struct Users {
        string firstname;
        string lastname;
        string uid;
        string phone;
        string email;
        string username;
        string password;
        string e1;
        uint id;
    }
    struct userdata{
        string firstname;
        string lastname;
        string username;
        string uid;
    }
    uint new_id = 1;
    Users[] public users;
    function register(string memory _firstname,string memory _lastname,string memory _uid,string memory _phone ,string memory _email,string memory _username,string memory  _password)  public
    {
        users.push(Users(_firstname,_lastname,_uid,_phone,_email,_username,_password,"0",new_id));
        new_id++;
    }
    function getAllData(string memory _uid) view public returns(string memory,string memory,string memory)
    {
        for(uint i =0;i<users.length;i++)
        {
            if(keccak256(bytes(users[i].uid)) == keccak256(bytes(_uid)))
            {
                return(users[i].firstname,users[i].lastname,users[i].username);
            }
        }
    }
  function getData(string memory _uid) view public returns(userdata[] memory)
    {
        uint c = 0;
        for(uint i =0;i<users.length;i++)
        {
            if(keccak256(bytes(users[i].uid)) != keccak256(bytes(_uid)))
            {
                c++;
            }
        }
        userdata[] memory hello = new userdata[](c);
          c=0;
          for(uint i =0;i<users.length;i++)
        {
            if(keccak256(bytes(users[i].uid)) != keccak256(bytes(_uid)))
            {
                hello[c] = userdata(users[i].firstname,users[i].lastname,users[i].username,users[i].uid);
                c++;
            }
        }
        return(hello);
    }
    function check_data(string memory _phone,string memory _email) view public returns(bool,bool)
    {
        bool nm = false;
        bool em = false;
        for(uint i = 0;i<users.length;i++)
        {
            if(keccak256(bytes(users[i].phone))==keccak256(bytes(_phone)))
            {
                nm = true;
            }
             if(keccak256(bytes(users[i].email))==keccak256(bytes(_email)))
            {
                em = true;
            }
        }
        return (nm,em);
    }

    function send_user() view public returns(string[] memory)
    {
        string[] memory usernames = new string[](users.length);
        for(uint i =0;i<users.length;i++)
        {
         usernames[i] = users[i].username;
        }
        return usernames;


    }
    function login(string memory _phone,string memory _password) view public returns(bool,string memory,string memory,string memory,string memory) 
    {
        bool hello = false;
        string memory firstname;
        string memory lastname;
        string memory uid;
        string memory username;
         for(uint i =0;i<users.length;i++)
         {
             if(keccak256(bytes(_phone))==keccak256(bytes(users[i].phone))&&keccak256(bytes(_password))==keccak256(bytes(users[i].password)))
             {
                 hello = true;
                 firstname = users[i].firstname;
                 lastname = users[i].lastname;
                 uid = users[i].uid;
                 username = users[i].username;
             }
         }
         return(hello,uid,firstname,lastname,username);
    }
}