const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const PORT = 3000;
const dirName = "./contacts.json";
const app = express();

//Middleware
app.use(bodyParser.json());

function findIndex(arr, cName) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].name == cName) return i;
  }
  return -1;
}
 
function removeAtIndex(arr, index) {
  let newArray = [];
  for (let i = 0; i < arr.length; i++) {
    if (i !== index) newArray.push(arr[i]);
  }
  return newArray;
}

function update(arr,name,num,address,idx){
    arr[idx].name = name;
    arr[idx].address = address;
    arr[idx].num = num;
    return arr;
}

function searchContact(arr,sName){
  let result = [];
  for(let i=0;i<arr.length;i++){
    if(arr[i].name.includes(sName)){
      result.push(arr[i]);
    }
  }
  return result; 
}

//API For getting all the contacts
app.get("/AllContacts", (req, res) => {
  fs.readFile(dirName,"utf-8", (err, data) =>{
    res.send(JSON.parse(data));
  });
});

//API for specific contact
app.get("/AllContacts/:name", (req, res) => {
  let Name = String(req.params.name);
  fs.readFile(dirName,"utf-8", (err, data) =>{
      let allContacts = JSON.parse(data);
      result = searchContact(allContacts,Name);
      res.send(result);
  });
});


// API For creating New Contact
app.post("/NewContact", (req, res) => {
  let contact = {
    name: req.body.name,
    address: req.body.address,
    phoneNum: req.body.phoneNum,
  };
  fs.readFile(dirName, (err, data) => {
    let Data = JSON.parse(data);
    Data.push(contact);
    fs.writeFile(dirName, JSON.stringify(Data), (err) => {
      if (err) {
        console.log("error Writing To a file");
        res.status(404).send();
      } else {
        res.status(200).json({ message: "New Contact Added" });
      }
    });
  });
});

//API for deleting a Contact
app.delete("/DeleteContact", (req, res) => {
  let tempName = req.body.name;
  fs.readFile(dirName, "utf-8", (err, data) => {
    var contacts = JSON.parse(data);
    const deleteIdx = findIndex(contacts, tempName);
    if (deleteIdx === -1) {
      res.status(404).send();
    } else {
      contacts = removeAtIndex(contacts, deleteIdx);
      fs.writeFile(dirName, JSON.stringify(contacts), (err) => {
        if (err) {
          res.status(404).send();
        } else {
          res.json({ message: "User Deleted" });
        }
      });
    }
  });
});

//API for updating a contact
app.put("/UpdateContact",(req,res)=>{
    const Name = req.body.name;
    const Num = req.body.num;
    const address = req.body.address;

    fs.readFile(dirName,(err,data)=>{
        const Contacts = JSON.parse(data);
        let deleteIdx = findIndex(Contacts,Name);
        Contacts = update(Contacts,Name,Num,address);
        res.json(Contacts);
    })
})

app.listen(PORT, () => {
  console.log("Server Running!");
});
