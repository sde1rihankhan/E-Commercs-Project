import nodemailer from 'nodemailer';
import 'dotenv/config'

export const sendOTPMail = async (otp, email)=>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        }
    })
    const mailConfigurations = {
        from: process.env.MAIL_USER,
        to: email,

        subject: "Password Reset TOP",

        html:`<p>Your OTP for password reset is <b>${otp}</b></p>`

        // text: `Hi! There, you have recently visited 
        // our website and entered your email.
        // Please follow the given link to verify your email
        // http://localhost:5173/verify${otp} Thanks`
    };

    transporter.sendMail(mailConfigurations, function (error,info){
        if(error) throw Error(error)
            console.log("OTP Sent Successfully");
            console.log(info);
    })
}