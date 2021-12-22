const nodemailer = require("nodemailer");

const sendMailToChangePW = async (email, firstName, lastName, code) => {
  let Transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "hktentertainment123@gmail.com",
      pass: "HKTentertainment@123",
    },
  });
  let mailOptions;
  let sender = "HKT ONLINE LEARNING";
  mailOptions = {
    from: `${sender} <hktentertainment123@gmail.com>`,
    to: email,
    subject: "Code change your password",
    html: `
    <div style="padding:20px 30px; background-color:#dee0e3">
    <p style="font-size:30px;font-weight:bold; color:#f05123">Hi, ${firstName} ${lastName}</p>
    Here your code to change the password
    <span style="font-size:23px;color:#f05123;background-color:#ffffff;">${code}</span>
    </div>
    </div>`,
  };
  Transport.sendMail(mailOptions);
};

const sendMailConfirm = async (email, firstName, lastName, uniqueString) => {
  let Transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "hktentertainment123@gmail.com",
      pass: "HKTentertainment@123",
    },
  });
  let mailOptions;
  let sender = "HKT ONLINE LEARNING";
  mailOptions = {
    from: `${sender} <hktentertainment123@gmail.com>`,
    to: email,
    subject: "Email Confirmation",
    html: `
      <div style="padding:20px 30px; background-color:#dee0e3">
      <p style="font-size:30px;font-weight:bold; color:#f05123">Hi, ${firstName} ${lastName}</p>
      <p style="font-size:27px;">Press <a style="color:#f05123; font-size:27px;" href=${process.env.REAL_SERVER_DOMAIN}/api/ManageUser/verify/${uniqueString}>here</a> to verify your account in our system</p>
      <p style="font-size:30px;font-weight:bold; color:#f05123"">Thanks</p>
      </div>`,
  };
  Transport.sendMail(mailOptions);
};
const sendMailInform = async (email, subject, content) => {
  let Transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: `${process.env.SYSTEM_EMAIL}`,
      pass: `${process.env.SYSTEM_EMAILPW}`,
    },
  });
  let mailOptions;
  let sender = "HKT ONLINE LEARNING";
  mailOptions = {
    from: `${sender} <hktentertainment123@gmail.com>`,
    to: email,
    subject: `${subject}`,
    html: `<p style="font-size:15px;font-weight:bold">${content}</p>`,
  };
  Transport.sendMail(mailOptions);
};
module.exports = { sendMailConfirm, sendMailToChangePW, sendMailInform };
