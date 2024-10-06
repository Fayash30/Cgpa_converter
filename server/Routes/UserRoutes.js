const User = require("../Models/UserModel");
const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const verifyToken = require("../Middlewares/Auth");

const router = express.Router();
const usernameRegex = /^[a-zA-Z0-9_.-@#$%^&*]+$/;

const Dept = require("../Models/DeptModel");  // Import Dept model

router.post('/register', async (req, res) => {
    try {
        const { name, roll_no, password, dept } = req.body;  // Include dept in the request body

        if (!roll_no) {
            throw new Error("Enter your Roll number.");
        }

        if (!name) {
            throw new Error("Enter your name.");
        }

        // Check if the department is provided
        if (!dept) {
            throw new Error("Please select a department.");
        }

        // Validate if the dept exists in the Dept collection
        const department = await Dept.findById(dept);
        if (!department) {
            throw new Error("Invalid department.");
        }

        // Existing user check
        const existingUser = await User.findOne({ roll_no });
        if (existingUser) {
            throw new Error("Roll number already exists!");
        }

        // Password validation and hashing
        if (!password) {
            throw new Error("Enter your password.");
        } else if (!usernameRegex.test(password)) {
            throw new Error("Your password is weak. It must be 6-30 characters long and can contain letters, numbers, and symbols.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the user with dept
        await User.create({
            roll_no,
            name,
            password: hashedPassword,
            dept  // Save the department ID
        });

        res.send({ status: 'ok', data: req.body, message: "Signup Successful" });
    } catch (err) {
        res.json({ status: 'error', error: err.message });
    }
});


router.post('/login' , async (req , res)=>{
    const {roll_no , password } = req.body;

    if (!roll_no) {
        return res.json({ status : 'error' ,user:false , message : 'Enter your Roll number.'})
      }

    const user = await User.findOne({roll_no:roll_no});
    
    if(!user)
    {
        return res.json({ status : 'error' ,user:false , message : 'User does not exist'})
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