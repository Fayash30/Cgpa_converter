const User = require("../Models/UserModel");
const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const verifyToken = require("../Middlewares/Auth");

const router = express.Router();
const usernameRegex = /^[a-zA-Z0-9_.-@#$%^&*]+$/;

router.post('/register', async (req, res) => {
    try 
    {
       
        const { name, user_name, password } = req.body;
        if (!user_name) {
            throw new Error("Enter your username.");
          } else if (!usernameRegex.test(user_name)) {
            throw new Error("Username must be 6-30 characters long and can contain letters, numbers, and symbols");
          }
        
          if(!name) {
            throw new Error("Enter your name.");
          }
          // Existing user check
          const existingUser = await User.findOne({ user_name });
          if (existingUser) {
            throw new Error("Username already exists!");
          }
      
          // Password validation and hashing
          if (!password) {
            throw new Error("Enter your password.");
          } else if (!usernameRegex.test(password)) {
            throw new Error("Your password is weak.It must be 6-30 characters long and can contain letters, numbers, and symbols");
          }
      
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            user_name,
            name,
            password: hashedPassword
        });

        res.send({ status: 'ok', data: req.body, message:"Signup Succesful" });
    } catch (err) {
        res.json({ status: 'error', error: err.message });
    }
});


router.post('/login' , async (req , res)=>{
    const {user_name , password } = req.body;

    if (!user_name) {
        throw new Error("Enter your username.");
      } else if (!usernameRegex.test(user_name)) {
        throw new Error("Username must be 6-30 characters long and can contain letters, numbers, and symbols");
      }

    const user = await User.findOne({user_name:user_name});
    
    if(!user)
    {
        return res.json({ status : 'error' ,user:false , message : 'Email does not exist'})
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
    
      const token = jwt.sign({
        userId: user._id
      }, 'privatesecret321',{ expiresIn: '1h' })

      return res.json({status : 'ok' , token: token});
    }
      else 
      {
        return res.json({ status:'error' , user:false , message:"Password is Wrong" })
      }  

})

router.get('/user', verifyToken, async (req, res) => {
  try {
      const user = await User.findById(req.userId);
      res.json(user);
  } catch (err) {
      res.status(400).json({ error: 'Error fetching user' });
  }
});


module.exports = router;