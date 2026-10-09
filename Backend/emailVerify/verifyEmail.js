import nodemailer from 'nodemailer';
import 'dotenv/config'

// export const verifyEmail = async (token, email) => { // Email bhejne ka result caller ko return karta hai.
//   const transporter = nodemailer.createTransport({ // Gmail SMTP transporter banata hai.
//     service: "gmail", // Gmail ko email service ke roop mein use karta hai.
//     auth: { // SMTP login credentials set karta hai.
//       user: process.env.MAIL_USER, // Sender ka Gmail address leta hai.
//       pass: process.env.MAIL_PASS, // Gmail App Password leta hai, normal password nahi.
//     }, // Authentication settings band karta hai.
//   }); // Transporter configuration band karta hai.

//   return await transporter.sendMail({ // Email send hone ya fail hone ka wait karta hai.
//     from: process.env.MAIL_USER, // Sender address set karta hai.
//     to: email, // Registered user ka email set karta hai.
//     subject: "Email Verification", // Email ka subject set karta hai.
//     text: `Verify your email: https://e-commers-project-nbgp.vercel.app/verify/${token}`, // Verification link bhejta hai.
//   }); // Email configuration band karta hai.

//     const info = await transporter.sendMail(mailOptions); // Gmail ke response ka wait karta hai.
//     console.log("Verification email sent:", info.messageId, info.accepted); // Accepted recipient log karta hai.
//     return info; // Result controller ko deta hai.
//   } catch (error) { // Email bhejne mein aayi error pakadta hai.
//     console.error("Verification email failed:", error); // Backend logs mein exact cause dikhata hai.
//     throw error; // Controller ko failure handle karne deta hai.
//   }
  

// }; // Function band karta hai.


export const verifyEmail = (token, email)=>{
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

        subject: "Email Veryfication",

        text: `Hi! There, you have recently visited 
        our website and entered your email.
        Please follow the given link to verify your email
        https://e-commercs-project-nbgp.vercel.app/verify/${token} Thanks`
    };

    transporter.sendMail(mailConfigurations, function (error,info){
        if(error) throw Error(error)
            console.log("Email Sent Successfully");
            console.log(info);
    })
}