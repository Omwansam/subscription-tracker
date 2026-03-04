const User = require('../models/user.model');

/*
|--------------------------------------------------------------------------
| @desc    Get Current Logged In User
| @route   GET /api/users/profile
| @access  Private
|--------------------------------------------------------------------------
*/
const getProfile = async (req, res, next) => {
    try{
        res.status(200).json({
            success: true,
            message: "User profile retrieved successfully",
            data: req.user, // Assuming req.user is populated by auth middleware
        });

    }catch(error){
        next(error);
    }    
}

/*
|--------------------------------------------------------------------------
| @desc    Update User Profile
| @route   PUT /api/users/profile
| @access  Private
|--------------------------------------------------------------------------
*/

const updateProfile = async (req, res, next) => {
    try{
        const { fullName, email } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }

        user.fullName = fullName || user.fullName;
        user.email = email || user.email;

        await user.save();

        res.status(200).json({
            success: true,
            message: "User profile updated successfully",
            data: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            },
        });

    }catch(error){
        next(error);
    }    
};

/*
|--------------------------------------------------------------------------
| @desc    Change Password
| @route   PUT /api/users/change-password
| @access  Private
|--------------------------------------------------------------------------
*/

const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            res.status(400);
            throw new Error(" Both current password and new password are required");
        }

        const user = await User.findById(req.user._id);

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            res.status(401);
            throw new Error("Current password is incorrect");
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });

    }catch (error) {
        next(error);
    }
};

/*
|--------------------------------------------------------------------------
| @desc    Delete Own Account
| @route   DELETE /api/users/profile
| @access  Private
|--------------------------------------------------------------------------
*/

const deleteAccount = async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.user._id);
        
        res.status(200).json({
            success: true,
            message: "User account deleted successfully",
        });

    }catch (error) {
        next(error);
    }    
};
/*
|--------------------------------------------------------------------------
| @desc    Admin: Get All Users
| @route   GET /api/users
| @access  Admin
|--------------------------------------------------------------------------
*/
const getAllUsers = async (req, res, next) => {
    try{
        const users = await User.find().select("-password");
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: users,
        });

    }catch(error){
        next(error);
    }
};

/*
|--------------------------------------------------------------------------
| @desc    Admin: Get Single User
| @route   GET /api/users/:id
| @access  Admin
|--------------------------------------------------------------------------
*/

const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user){
            res.status(404);
            throw new Error("User not found");
        }

        res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            data: user,
        });

    }catch(error){
        next(error);
    }
};

/*
|--------------------------------------------------------------------------
| @desc    Admin: Update User Role
| @route   PUT /api/users/:id/role
| @access  Admin
|--------------------------------------------------------------------------
*/

const updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;

        const user = await User.findById(req.params.id);
        
        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }

        user.role = role || user.role;

        await user.save();

        res.status(200).json({
            success: true,
            message: "User role updated successfully",
            data: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            },
        });

    }catch (error) {
        next(error);
    }    
};

/*
|--------------------------------------------------------------------------
| @desc    Admin: Delete User
| @route   DELETE /api/users/:id
| @access  Admin
|--------------------------------------------------------------------------
*/

const deleteUserByAdmin = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProfile,
    updateProfile,
    changePassword,
    deleteAccount,
    updateUserRole,
    deleteUserByAdmin,
    getAllUsers,
    getUserById,
};