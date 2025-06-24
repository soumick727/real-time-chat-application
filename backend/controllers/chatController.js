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
    try {
    const {chatName, members} = req.body;
    if(!chatName || !members || members.length <2){
        return res.status(404).json({
            message: "Chat name and at least two members are required",
            success: false
        })
    }
    // check if same member is added multiple times
    const uniqueMembers = [...new Set([...members, req.user._id.toString()])];
    if(!uniqueMembers || uniqueMembers.length < 2){
        return res.status(400).json({
            message: "At least two unique members are required",
            success: false
        })
    }
    // add the current user to the member list
    members.push(req.user._id);

    // create a new group chat
     const groupChat = new Chat({
        chatName,
        isGroupChat: true,
        members: uniqueMembers,
        groupAdmin: req.user._id
     })

     const savedGroupChat = await groupChat.save();

     res.status(201).json({
        message: "group chat created successfully",
        success: true,
        data: savedGroupChat
     })
    
    } catch (error) {
        res.status(500).json({
            message: "Error creating group chat",
            success: false,
            error: error.message
        })
    }
    
}
exports.renameGroup = async (req, res) => {
   try {
        const {chatId, newChatName} = req.body;
        if(!chatId || !newChatName){
            return res.status(400).json({
                message: "Chat ID and new chat name are required",
                success: false
            })
        }

        //find the group chat by id
        const chat = await Chat.findById(chatId);
        if(!chat || !chat.isGroupChat){
            return res.status(404).json({
                message: "Group chat not found",
                success: false
            });
        }
        //check if the user is the group admin
        if(chat.groupAdmin.toString() !== req.user._id.toString()){
            return res.status(403).json({
                message: "You are not authorized to rename this group",
                success: false
            });
        }

        // rename the group chat
        chat.chatName = newChatName;
        const updatedChatName = await chat.save();
        res.status(200).json({
            message: "Group chat renamed successfully",
            success: true,
            data: updatedChatName
        });
   } catch (error) {
       res.status(500).json({
           message: "Error renaming group",
           success: false,
           error: error.message
       });
   }
}
exports.addToGroup = async (req, res) => {
    try {
        const {chatId, userIdToAdd} =  req.body;
        if(!chatId || !userIdToAdd){
            return res.status(400).json({
                message: "Chat Id and user id to add are required",
                success:false
            })
        }
        //find the group chat
        const chat = await Chat.findById(chatId);
        if(!chat || !chat.isGroupChat){
            return res.status(404).json({
                message: "Group chat not found",
                success: false
            });
        }

        // check if the user is the group admin or not
        if(chat.groupAdmin.toString() !== req.user._id.toString()){
            return res.status(400).json({
                message: "you are not authorized to add members to this group",
                success: false
            })
        }

        // check if the user is already a member of the group
        if(chat.members.includes(userIdToAdd)){
            return res.status(400).json({
                message: "user id is already present in the group",
                success: false
            })
        }

        // add the user to the group
        chat.members.push(userIdToAdd)
        const updatedChat = await chat.save();

        res.status(200).json({
            message: "User added to group successfully",
            success: true,
            data: updatedChat
        })
    } catch (error) {
        res.status(500).json({
            message: "Error adding to group",
            success: false,
            error: error.message
        });
        
    }
}
exports.removeFromGroup = async (req, res) => {
    try {
        const {chatId, userIdToRemove} = req.body;
        if(!chatId || !userIdToRemove){
            return res.status(400).json({
                message: "Chat Id and user id to remove are required",
                success: false
            })
        }
        //find the group chat
        const chat = await Chat.findById(chatId);
        if(!chat || !chat.isGroupChat){
            return res.status(404).json({
                message: "Group chat not found",
                success: false
            });
        }

        // check if the user is the group admin or not
        if(chat.groupAdmin.toString() !== req.user._id.toString()){
            return res.status(400).json({
                message: "you are not authorized to remove members from this group",
                success: false
            })
        }

        // check if the user is a member of the group
        if(!chat.members.includes(userIdToRemove)){
            return res.status(400).json({
                message: "user id is not present in the group",
                success: false
            })
        }

        // remove the user from the group
        chat.members = chat.members.filter(member => member.toString() !== userIdToRemove);
        const updatedChat = await chat.save();

        res.status(200).json({
            message: "User removed from group successfully",
            success: true,
            data: updatedChat
        })
    } catch (error) {
        res.status(500).json({
            message: "Error removing from group",
            success: false,
            error: error.message
        });
        
    }
}