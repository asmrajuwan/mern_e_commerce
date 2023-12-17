const express = require("express");
const { router } = require("../app");
const {
    getUsers,
    getUserById,
    deleteUserById,
    processRegister,
    activateUserAccount,
    updateUserById,

    handleUpdatePassword,
    handleForgetPassword,
    handleResetPassword,
    handleManageUserstatusUserById,
} = require("../controllers/userController");

const uploadUserImage = require("../middlewares/uploadFile");
const {
    validateUserRegistration,
    validateUserPasswordUpdate,
    validateUserForgetPassword,
    validateUserResetPassword,
} = require("../vaidators/auth");
const runValidation = require("../vaidators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");

const userRouter = express.Router();

userRouter.post(
    "/process-register",
    uploadUserImage.single("image"),
    isLoggedOut,
    validateUserRegistration,
    runValidation,
    processRegister
);
userRouter.post("/activate", isLoggedOut, activateUserAccount);

userRouter.get("/", isLoggedIn, isAdmin, getUsers);
userRouter.get("/:id([0-9a-fA-F]{24})", isLoggedIn, getUserById);
userRouter.delete("/:id([0-9a-fA-F]{24})", isLoggedIn, deleteUserById);
userRouter.put(
    "/reset-password/",
    validateUserResetPassword,
    runValidation,
    handleResetPassword
);
userRouter.put(
    "/:id([0-9a-fA-F]{24})",
    isLoggedIn,
    uploadUserImage.single("image"),
    isLoggedIn,
    updateUserById
);
userRouter.put(
    "/manage-user/:id([0-9a-fA-F]{24})",
    isLoggedIn,
    isAdmin,
    handleManageUserstatusUserById
);

userRouter.put(
    "/update-password/:id([0-9a-fA-F]{24})",
    validateUserPasswordUpdate,
    runValidation,
    isLoggedIn,
    handleUpdatePassword
);
userRouter.post(
    "/forget-password/",
    validateUserForgetPassword,
    runValidation,
    handleForgetPassword
);

module.exports = userRouter;
