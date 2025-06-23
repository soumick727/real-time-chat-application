const User = require('../models/User');
exports.getLoggedInUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password -__v");
        console.log(user);
        if(!user){
            return res.status(404).json({
                message: "user not found",
                success: false
            })
        }

        res.status(200).json({
            message: "user fetched successfully",
            success: true,
            data: user 
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Internal server error',
            success: false
        })
    }
}

exports.getAllUsers = async (req, res) => {
    try{
        const users = await User.find({_id: {$ne: req.user.id}}).select("-password -__v");
        res.status(200).json({
            message: "All users fetched successfully",
            success: true,
            data: users
        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            message: 'Internal server error',
            success:false
        })
    }
}