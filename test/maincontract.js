const maincontract = artifacts.require('maincontract');
contract('maincontract',()=>
{
    it("Testing All The Data One By One",async()=>
    {
        const MainContract = await maincontract.deployed();
       const result =  await MainContract.register("Aditya","Srivastava","12345","8808914747","corteridesign@gmail.com","corteri","password",);

       const result1 = await MainContract.login("8808914747","password");
        console.log(result1);
    })
})