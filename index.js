const { faker } = require('@faker-js/faker');

const mysql =require('mysql2');
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
// Create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'MY_APP',
  password: 'root'
});

let getRandomUser = ()=> {
  return [
     faker.string.uuid(),
    faker.internet.username(),
   faker.internet.email(),
    faker.internet.password(),
  
  ];
};
/*

let q= "INSERT INTO user(id,username,email,password) VALUES ?";

let data=[];
for(let i=1; i<=100;i++){
    data.push(getRandomUser());
}


*/








// app.get("/",(req,res)=>{
//     res.send(" welcome to my app");
// })




app.get("/",(req,res)=>{
    let q=`SELECT count(*)FROM user`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let count =result[0] ["count(*)"];
            res.render("home.ejs",{count});
            
        });
    } catch(err){
        res.send("some error occurred");
    }
});

app.get("/user",(req,res)=>{
    let q=`SELECT * FROM user`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
           let data=result;
        //    console.log(data);
            res.render("users.ejs",{data});
        });
    } catch(err){
        res.send("some error occurred");
    }
});


//  edit route

// app.get("/user/:id/edit",(req,res)=>{
//     let {id}=req.params;
// let q=`SELECT * FROM user WHERE id='${id}'`;

//   try{
//         connection.query(q,(err,result)=>{
//             if(err) throw err;
//         let user=result[0];
//             res.render("edit.ejs",{user});
//         });
//     } catch(err){
//         console.log(err)
//         res.send("some error occurred in DB");
//     }

// });



app.get("/user/:id/edit", (req, res) => {

    let { id } = req.params;

    let q = `SELECT * FROM user WHERE id = ?`;

    connection.query(q, [id], (err, result) => {

        if (err) {
            console.log(err);
            return res.send("Some error occurred in DB");
        }

        if (result.length === 0) {
            return res.send("User not found");
        }

        let user = result[0];

        res.render("edit.ejs", { user });
    });
});

// UPDATAE ROUTE


// app.patch("/user/:id",(req,res)=>{
//    let {password:formPass, username:newUsername}=req.body;
    
// let {id}=req.params;
// let q=`SELECT * FROM user WHERE id='${id}'`;

//   try{
//         connection.query(q,(err,result)=>{
//             if(err) throw err;
//         let user=result[0];
//        if(formPass != user.password){
//         res.send("password is incorrect");
//        }
//             res.render("edit.ejs",{user});
//         });
//     } catch(err){
//         console.log(err)
//         res.send("some error occurred in DB");
//     }


// });





app.patch("/user/:id", (req, res) => {
    let { password: formPass, username: newUsername } = req.body;
    let { id } = req.params;

    let q = `SELECT * FROM user WHERE id = ?`;

    connection.query(q, [id], (err, result) => {

        if (err) {
            console.log(err);
            return res.send("Database error");
        }

        if (result.length === 0) {
            return res.send("User not found");
        }

        let user = result[0];

        if (formPass !== user.password) {
            return res.send("Password is incorrect");
        }

        let updateQuery = `UPDATE user SET username = ? WHERE id = ?`;

        connection.query(
            updateQuery,
            [newUsername, id],
            (err, result) => {

                if (err) {
                    console.log(err);
                    return res.send("Error updating user");
                }

                res.redirect("/user");
            }
        );
    });
});

app.listen(8080,()=>{
    console.log("server is running on port 8080");
});









//   console.log(getRandomUser());



// try{
// connection.query(q,[data],(err,result)=>{
//     if(err) throw err;
//     console.log(result);
// }) ;
// }
// catch (err){
//     console.log(err);
// }


// connection.end();