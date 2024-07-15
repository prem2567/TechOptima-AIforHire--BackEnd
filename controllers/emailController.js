// emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // You can use any email service provider
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password
  },
});

const sendWelcomeEmail = (email, username, password) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to Our Service',
    html: `
      <html>
        <body>
          <h1>Welcome, ${username}!</h1>
          <p>Thank you for joining our service. We are excited to have you on board.</p>
          <p>Your credentials are as follows:</p>
          <table>
            <tr>
              <td><strong>Username:</strong></td>
              <td>${username}</td>
            </tr>
            <tr>
              <td><strong>Password:</strong></td>
              <td>${password}</td>
            </tr>
          </table>
          <p>Please keep these credentials safe and do not share them with anyone.</p>
          <p>Best regards,<br/>The Team</p>
        </body>
      </html>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendWelcomeEmail };
