"use strict";
const nodemailer = require("nodemailer");
const config = require("config");
const jwt = require('jsonwebtoken');

const { getTemplateEmail } = require('../models/template_email');
const { getTemplateEmailOTP } = require('../models/template_email_otp');
const { getTemplateEmailPO } = require('../models/template_email_po');

// async..await is not allowed in global scope, must use a wrapper
async function sendEmail(dataBody) {

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: config.get(`emailSMTP`),
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.get(`emailAdd`), // generated ethereal user
      pass: config.get(`emailPas`), // generated ethereal password
    },
  });

  let strToken = jwt.sign({ kode_customer: dataBody.kode_customer, email: dataBody.email }, config.get('jwtPrivateKey'));
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `no-reply <${config.get("emailAdd")}>`, // sender address
    to: `${dataBody.email}`, // list of receivers
    subject: `Verify email address`, // Subject line
    html: getTemplateEmail({
      nama_lkp: dataBody.nama_lkp,
      link_verifikasi: config.get("emailUrl") + strToken
    }), // html body
  });
  // console.log("Message sent: %s", info.messageId);
  // // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // // Preview only available when sending through an Ethereal account
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

// async..await is not allowed in global scope, must use a wrapper
async function sendEmailOTP(dataBody) {

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: config.get(`emailSMTP`),
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.get(`emailAdd`), // generated ethereal user
      pass: config.get(`emailPas`), // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `no-reply <${config.get("emailAdd")}>`, // sender address
    to: `${dataBody.email}`, // list of receivers
    subject: `Code OTP Login.`, // Subject line
    html: getTemplateEmailOTP({
      nama_lkp: dataBody.nama_lkp,
      kode_otp: dataBody.kode_otp
    }), // html body
  });
  // console.log("Message sent: %s", info.messageId);
  // // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // // Preview only available when sending through an Ethereal account
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

async function sendEmailPO(dataBody) {

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: config.get(`emailSMTP`),
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.get(`emailAdd`), // generated ethereal user
      pass: config.get(`emailPas`), // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `no-reply <${config.get("emailAdd")}>`, // sender address
    to: `${dataBody.email}`, // list of receivers
    subject: `Cancel PO.`, // Subject line
    html: getTemplateEmailPO({
      nama_lkp: dataBody.nama_lkp,
      no_po: dataBody.no_po
    }), // html body
  });
  
}

exports.sendEmail = sendEmail;
exports.sendEmailOTP = sendEmailOTP;
exports.sendEmailPO = sendEmailPO;