const Chat = require('../models/Chat');
const User = require('../models/User');

exports.createChat = async (req, res) => {
    try{
        const {userId} = req.body;
        if(!userId){
            return res.status(400).json({
                message: "User Id is required",
                success: false
            });
        }

        //check if a chat already exist between the users

        let existingChat = await Chat.findOne({
            members: { $all: [req.user._id, userId]}
        })
        if(existingChat){
            return res.status(200).json({
                message: "chat already exists",
                success: true,
                data: existingChat                                                                                                           
            })
        }
        //create a new chat
        const chat = new Chat({
            chatName: "sender",
            isGroupChat: false,
            members: [req.user._id, userId]
        });
        
        const savedChat = await chat.save();

        res.status(201).json({
            message: "Chat created successfully",
            success: true,
            data: savedChat
        })
    } catch (error) {
        res.status(500).json({
            message: "Error creating chat",
            success: false,
            error: error.message
        })
    }
}

exports.fetchChats = async (req, res) => {
    const userId = req.user._id;
    try{
        const allChats = await Chat.find({
            members: {$in: [userId]},
        }) 
        res.status(200).json({
            message: "Chats fetched successfully",
            success: true,
            data: allChats
        })
    }catch(error){
        res.status(500).json({
            message: "Error fetching chats",
            success: false,
            error: error.message
        })
    }
}

exports.createGroupChat = async (req, res) => {

}
exports.renameGroup = async (req, res) => {
    
}
exports.addToGroup = async (req, res) => {
    
}
exports.removeFromGroup = async (req, res) => {
    
}