require('dotenv').config();

const serverPort = process.env.SERVER_PORT || 5001;
const mongoDbUrl = process.env.MONGODB_URL || "mongodb://localhost:27017/eCommerceMernDB";

const defaultImagePath =process.env.DEFAULT_USER_IMAGE_PATH ||'public/images/users/default.png'

const jwtActivationKey = process.env.JWT_ACTIVATION_KEY ||'ASDASDASSFEFDFDFGF';
const jwtAccessKey = process.env.JWT_ACCESS_KEY ||'ASDASDASSFEFDFDFGF';
const jwtResetPasswordKey = process.env.JWT_RESET_PASSWORD_KEY ||'ASDASDASSFEFDFDFGF';



const smtpUsername =process.env.SMTP_USERNAME || '';
const smtpPassword = process.env.SMTP_PASSWORD || '';

const clientUrl = process.env.CLIENT_URL;

module.exports ={serverPort,mongoDbUrl,defaultImagePath,jwtActivationKey,
    smtpPassword,smtpUsername,clientUrl,jwtAccessKey,jwtResetPasswordKey};