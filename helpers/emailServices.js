import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Ensure this line is present to load environment variables

// Create a transporter
let transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send a welcome email
export const sendWelcomeEmail = (to, name, password) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: 'Welcome to TechOptima AI Hiring!',
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
        }
        .header {
          text-align: center;
          padding: 20px;
          background-color: #054CA6;
          color: #ffffff;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 20px;
        }
        .content h2 {
          font-size: 20px;
          color: #333333;
        }
        .content p {
          font-size: 16px;
          line-height: 1.6;
          color: #666666;
        }
        .content .credentials {
          background-color: #f9f9f9;
          padding: 10px;
          border-radius: 4px;
          margin-top: 10px;
        }
        .content .credentials p {
          margin: 5px 0;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 14px;
          color: #aaaaaa;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to TechOptima AI Hiring!</h1>
        </div>
        <div class="content">
          <h2>Hi ${name},</h2>
          <p>
            We're excited to have you on board. Here are your login credentials:
          </p>
          <div class="credentials">
            <p><strong>Email:</strong> ${to}</p>
            <p><strong>Password:</strong> ${password}</p>
          </div>
          <p>
            Please log in to your account and update your password. If you have any questions, feel free to reach out to our support team.
          </p>
          <p>
            Best regards,<br/>
            The TechOptima AI Hiring Team
          </p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} TechOptima. All rights reserved.
        </div>
      </div>
    </body>
    </html>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};
