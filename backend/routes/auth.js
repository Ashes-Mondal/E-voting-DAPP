const express = require("express");
const router = express.Router();

router.post("/login",(req,res)=>{
	res.json({msg:"/login route hit"});
});

router.post("/logout",(req,res)=>{
	res.json({msg:"/login route hit"});
});

// Exporting routes
module.exports = router;