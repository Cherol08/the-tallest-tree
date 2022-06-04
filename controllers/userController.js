const userDB = require('../models/User');
const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
dotenv.config();

const getUsers = async (req, res) => {
  try {
    const submissions = await userDB.find({},{username:1, height: 1, _id:0});
    res.status(200).json(submissions);
  } catch (error) {
    res.status(400).json({error : error.message})
  } 
}

const createUser = async (req, res) => {
    const {username, height, email} = req.body;
    
    // create transport for mail 
    const contactEmail = new nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass:process.env.EMAIL_PWD, 
      }
    });
    if (!email) return res.status(400).JSON({'message': 'Email required'})
    try {
      
        const newUser = userDB.create({
            "username": username,
            "height": height,
            "email": email 
        })
        
        // find sumitted heights by email, return username + height
        const foundSubmissions = await userDB.find({email:email},{username:1, height: 1, _id:0});
        let avg = await userDB.aggregate([{$group:{_id:req.body.email, average:{$avg:"$height"}}}]);

        contactEmail.verify((error) => {
          if (error) {
            console.log(error);
          } else {
            console.log("Ready to Send");
          }
        });

        const mail = {
            from:'"Tall tress" leelo.cherol@gmail.com',
            to: email,
            subject: "Height Submission",
            html: `Hello, ${username}.</p>
                    <p>Your latest height submission (${height}cm) was added submitted to The Tallest Tree Website.</p>
                    <p> Previously logged heights:\n${foundSubmissions.toString()}\n</p>
                    <p> Average of logged heights:\n ${JSON.stringify(avg)}</p>`,
          };
          contactEmail.sendMail(mail, (error) => {
            if (error) {
              res.json({ status: "ERROR" });
            } else {
              res.json({ status: "Email Sent" });
            }});
            
        console.log('success',`new user ${username} created`);
      }catch (error) {
      res.status(400).json({message: error.message});
    }
}


module.exports = { getUsers, createUser };