const createError = require("http-errors");
const User = require("../models/userModel");

const findUsers = async (search, limit, page) => {
    try {
        const searchRegExp = new RegExp(".*" + search + ".*", "i");
    const filter = {
        isAdmin: { $ne: true },
        $or: [
            { name: { $regex: searchRegExp } },
            { email: { $regex: searchRegExp } },
            { phone: { $regex: searchRegExp } },
        ],
    };

    const options = { password: 0 };

    const users = await User.find(filter, options)
        .limit(limit)
        .skip((page - 1) * limit);

    const count = await User.find(filter).countDocuments();

    if (!users || users.length === 0) throw createError(404, "no users found");
   
    return {
        users,
        pagination: {
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            previousPage: page - 1 > 0 ? page - 1 : null,
            nextPage:
                page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        },
    }
    
    
    } catch (error) {
        throw error;
    }
};

const findUserById = async (id,options={})=>{
    try {
        const user = await User.findById(id,options)
        if(!user) throw createError(404,'user is not found')
        return user;
    } catch (error) {
        
    }
}
const handleUserAction = async (action, userId) => {
    try {
        let update;
        let successMessage;
        if (action === "ban") {
            update = { isBanned: true };
            successMessage = "User was banned";
        } else if (action === "unban") {
            update = { isBanned: false };
            successMessage = "User was unbanned";
        } else {
            throw createError(400, 'Invalid Action, use "ban" or "unban"');
        }

        const updateOptions = {
            new: true,
            runValidators: true,
            context: "query",
        };

        // delete.updates.email;

        const updateUser = await User.findByIdAndUpdate(
            userId,
            update, //{isBanned:true}
            updateOptions
        ).select("-password");

        if (!updateUser) {
            throw createError(400, "user was not banned successfully");
        }
        return successMessage;
    } catch (error) {
        throw error;
    }
};

module.exports = { handleUserAction, findUsers,findUserById };
