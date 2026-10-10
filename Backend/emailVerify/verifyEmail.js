import nodemailer from "nodemailer";
import "dotenv/config";

const verifyEmail = async (token, email) => {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    throw new Error("MAIL_USER or MAIL_PASS is missing");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const verificationLink = `https://e-commercs-project-nbgp.vercel.app/verify/${token}`;

  const mailConfigurations = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Verify Your Email",
    text: `Hi ${email},

Please verify your email by clicking this link:

${verificationLink}

If you did not create an account, you can ignore this email.`,
  };

  const info = await transporter.sendMail(mailConfigurations);

  console.log("Verification email sent:", info.messageId);

  return info;
};

export default verifyEmail;

// export const verifyEmail = (token, email)=>{
//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth:{
//             user: process.env.MAIL_USER,
//             pass: process.env.MAIL_PASS,
//         }
//     })
//     const mailConfigurations = {
//         from: process.env.MAIL_USER,
//         to: email,

//         subject: "Email Veryfication",

//         text: `Hi! There, you have recently visited
//         our website and entered your email.
//         Please follow the given link to verify your email
//         https://e-commercs-project-nbgp.vercel.app/verify/${token} Thanks`
//     };

//     transporter.sendMail(mailConfigurations, function (error,info){
//         if(error) throw Error(error)
//             console.log("Email Sent Successfully");
//             console.log(info);
//     })
// }
