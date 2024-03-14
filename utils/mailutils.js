import nodemailer from 'nodemailer';
import { userRoles } from './helper.js';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  sendMail: true,
  host: process.env.SMTP_HOST,
  secure: true,
  port: process.env.SMTP_PORT,
  auth: {
    user: `${process.env.SMTP_MAIL}`,
    pass: `${process.env.SMTP_PASSWORD}`,
  },
});

const sendMail = async (mailObject) => {
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: mailObject.to,
    subject: mailObject.subject,
    text: mailObject.text,
    html: mailObject.html,
  };

  try {
    await transporter.sendMail(mailOptions, (err, res) => res);
  } catch (err) {
    console.log('Error ::', err?.message);
    return err;
  }
};

export const wrapedAsyncSendMail = (mailOptions) =>
  new Promise((resolve) => {
    transporter.sendMail(mailOptions, (error, info) => {


      console.log(process.env.SMTP_HOST);
      console.log(process.env.SMTP_PORT);
      console.log(process.env.SMTP_MAIL);
      console.log(process.env.SMTP_PASSWORD);

      if (error) {
        console.log(`error is ${error}`);
        resolve(false);
      } else {
        console.log(`Email sent: ${info.response}`);
        resolve(true);
      }
    });
  });

export const emailOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: 'Your Verification OTP to Business-Tally',
    text: 'This is a test message, Thanks for Registering on Business-Tally.',
    html: `
     <!DOCTYPE html>
      <html lang="en">

      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Email Template with SVG</title>
        <style>
          /* Styles for the email content */
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }

          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px;
            background-color: #fff;
            border-radius: 10px;
          }

          .header-Text {
            margin: 0% 20px;
            color: #333;
          }

          p {
            color: #666;
          }

          .welcome-text {
            padding-top: 20px;
            display: flex;
            justify-content: center;
          }

          .main-container {
            padding: 5% 3%;
          }

          .header {
            display: flex;
            justify-content: center;
          }

          /* Additional styles for the SVG image */
          .svg-image {
            display: flex;
            justify-content: center;
            justify-items: center;
            height: 100%;
          }
        </style>
      </head>

      <body>
        <div class="container">
          <div class="header">
            <div class="svg-image">
            <img width="30" height="30" src='https://cdn.pixabay.com/photo/2014/04/02/10/47/red-304573_1280.png' />
            </div>
            <h2 class="header-Text">DATA DRIVEN DECISION</h2>
          </div>
          <h3 class="welcome-text">Welcome to our DATA DRIVEN DECISION! 👋🏻</h3>

          <div class="main-container">
            <!-- OTP message -->
            <h4>Thank you for registering with Business-Tally!</h4>
            <h2>OTP: ${otp}</h2>
            <!-- end OTP message -->
          </div>

        </div>
        </div>
      </body>

      </html>`,
  };
  const resp = await wrapedAsyncSendMail(mailOptions);
  return resp;
};

export const mailUserForgotPasswordOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: 'Your Forgot Password Request Verification OTP to Business-Tally ',
    text: 'This is a test message,Please enter the given otp to reset your user password.',
    html: `
      <!DOCTYPE html>
      <html lang="en">

      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Email Template with SVG</title>
        <style>
          /* Styles for the email content */
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }

          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px;
            background-color: #ddf4f9;
            border-radius: 10px;
          }

          .header-Text {
            margin: 0% 20px;
            color: #333;
          }

          p {
            color: #666;
          }

          .welcome-text {
            padding-top: 20px;
            display: flex;
            justify-content: center;
          }

          .main-container {
            padding: 1% 0%;
          }

          .header {
            display: flex;
            justify-content: center;
          }

          /* Additional styles for the SVG image */
          .svg-image {
            display: flex;
            justify-content: center;
            justify-items: center;
            height: 100%;
          }
        </style>
      </head>

      <body>
        <div class="container">
          <div class="header">
            <div class="svg-image">
            <div>
            <img width="30" height="30" src='https://cdn.pixabay.com/photo/2014/04/02/10/47/red-304573_1280.png' />
            </div>
            </div>
            <h2 class="header-Text">DATA DRIVEN DECISION</h2>
          </div>
          <h3 class="welcome-text">Welcome to our DATA DRIVEN DECISION! 👋🏻</h3>

          <div class="main-container">
            <!-- OTP message -->
            <h4>This is a test message,Please enter the given OTP to reset your user password.</h4>
            <h2>Your Otp is: ${otp}</h2>
            <!-- end OTP message -->
          </div>

        </div>
        </div>
      </body>

      </html>`,
  };

  const resp = await wrapedAsyncSendMail(mailOptions);
  return resp;
};

export const mailSuccessfullyRegisterUser = (userDetails) => {
  const mailObject = {
    email: userDetails.email,
    subject: `Welcome ${userDetails.firstname}  ${userDetails.lastname} to Business-Tally`,
    text: 'Thanks for Registering on Business-Tally.',
    html: `<!--  -->

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Template with SVG</title>
  <style>
    /* Styles for the email content */
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px;
      background-color: #fff;
      border-radius: 10px;
    }

    .header-Text {
      margin: 0% 20px;
      color: #333;
    }

    p {
      color: #666;
    }

    .welcome-text {
      padding-top: 20px;
      display: flex;
      justify-content: center;
    }

    .main-container {
      padding: 5% 3%;
    }

    .header {
      display: flex;
      justify-content: center;
    }

    /* Additional styles for the SVG image */
    .svg-image {
      display: flex;
      justify-content: center;
      justify-items: center;
      height: 100%;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      <div class="svg-image">
         <img width="30" height="30" src='https://cdn.pixabay.com/photo/2014/04/02/10/47/red-304573_1280.png' />
      </div>
      <h2 class="header-Text">DATA DRIVEN DECISION</h2>
    </div>
    <h3 class="welcome-text">Welcome to our DATA DRIVEN DECISION! 👋🏻</h3>
    Thanks for Registering, ${userDetails.firstname} ${userDetails.lastname}!<h5 style="color:green">Your Process is
      under Approval. We will notify you soon.</h5>
  </div>
  </div>
</body>

</html>`,
  };

  sendMail(mailObject);
};

export const inviteMail = async (inviteDetails) => {
  let YOUR_INVITATION_LINK;
  if (inviteDetails.userType === userRoles.companyAdmin) {
    YOUR_INVITATION_LINK =
      process.env.INVITATION_LINK +
      '/company-invite?' +
      inviteDetails?.inviteToken;
  } else if (
    inviteDetails.userType === userRoles.organizationEmployee ||
    inviteDetails.userType === userRoles.companyEmployee
  ) {
    YOUR_INVITATION_LINK =
      process.env.INVITATION_LINK +
      '/employee-invite?' +
      inviteDetails?.inviteToken;
  }
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: inviteDetails.email,
    subject: `Invitation to Business Tally`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Template with SVG</title>
    <style>
      /* Styles for the email content */
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 40px;
        background-color: #fff;
        border-radius: 10px;
      }
      .header-Text {
        margin: 0% 20px;
        color: #333;
      }
      p {
        color: #666;
      }
      .welcome-text {
        padding-top: 20px;
        display: flex;
        justify-content: center;
      }

      .main-container {
        padding: 5% 3%;
      }

      .header {
        display: flex;
        justify-content: center;
      }

      /* Additional styles for the SVG image */
      .svg-image {
        display: flex;
        justify-content: center;
        justify-items: center;
        height: 100%;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="svg-image">
          <svg
            width="35"
            height="29"
            version="1.1"
            viewBox="0 0 30 23"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <g id="Artboard" transform="translate(-95.000000, -51.000000)">
                <g id="logo" transform="translate(95.000000, 50.000000)">
                  <path
                    id="Combined-Shape"
                    fill="#61C8EA"
                    d="M30,21.3918362 C30,21.7535219 29.9019196,22.1084381 29.7162004,22.4188007 C29.1490236,23.366632 27.9208668,23.6752135 26.9730355,23.1080366 L26.9730355,23.1080366 L23.714971,21.1584295 C23.1114106,20.7972624 22.7419355,20.1455972 22.7419355,19.4422291 L22.7419355,19.4422291 L22.741,12.7425689 L15,17.1774194 L7.258,12.7425689 L7.25806452,19.4422291 C7.25806452,20.1455972 6.88858935,20.7972624 6.28502902,21.1584295 L3.0269645,23.1080366 C2.07913318,23.6752135 0.850976404,23.366632 0.283799571,22.4188007 C0.0980803893,22.1084381 2.0190442e-15,21.7535219 0,21.3918362 L0,3.58469444 L0.00548573643,3.43543209 L0.00548573643,3.43543209 L0,3.5715689 C3.0881846e-16,2.4669994 0.8954305,1.5715689 2,1.5715689 C2.36889529,1.5715689 2.73060353,1.67359571 3.04512412,1.86636639 L15,9.19354839 L26.9548759,1.86636639 C27.2693965,1.67359571 27.6311047,1.5715689 28,1.5715689 C29.1045695,1.5715689 30,2.4669994 30,3.5715689 L30,3.5715689 Z"
                  />
                  <polygon
                    id="Rectangle"
                    opacity="0.077704"
                    fill="#000"
                    points="0 8.58870968 7.25806452 12.7505183 7.25806452 16.8305646"
                  />
                  <polygon
                    id="Rectangle"
                    opacity="0.077704"
                    fill="#000"
                    points="0 8.58870968 7.25806452 12.6445567 7.25806452 15.1370162"
                  />
                  <polygon
                    id="Rectangle"
                    opacity="0.077704"
                    fill="#000"
                    points="22.7419355 8.58870968 30 12.7417372 30 16.9537453"
                    transform="translate(26.370968, 12.771227) scale(-1, 1) translate(-26.370968, -12.771227) "
                  />
                  <polygon
                    id="Rectangle"
                    opacity="0.077704"
                    fill="#000"
                    points="22.7419355 8.58870968 30 12.6409734 30 15.2601969"
                    transform="translate(26.370968, 11.924453) scale(-1, 1) translate(-26.370968, -11.924453) "
                  />
                  <path
                    id="Rectangle"
                    fillOpacity="0.15"
                    fill="#61c8ea"
                    d="M3.04512412,1.86636639 L15,9.19354839 L15,9.19354839 L15,17.1774194 L0,8.58649679 L0,3.5715689 C3.0881846e-16,2.4669994 0.8954305,1.5715689 2,1.5715689 C2.36889529,1.5715689 2.73060353,1.67359571 3.04512412,1.86636639 Z"
                  />
                  <path
                    id="Rectangle"
                    fillOpacity="0.35"
                    fill="#61c8ea"
                    transform="translate(22.500000, 8.588710) scale(-1, 1) translate(-22.500000, -8.588710) "
                    d="M18.0451241,1.86636639 L30,9.19354839 L30,9.19354839 L30,17.1774194 L15,8.58649679 L15,3.5715689 C15,2.4669994 15.8954305,1.5715689 17,1.5715689 C17.3688953,1.5715689 17.7306035,1.67359571 18.0451241,1.86636639 Z"
                  />
                </g>
              </g>
            </g>
          </svg>
        </div>
        <h2 class="header-Text">DATA DRIVEN DECISION</h2>
      </div>
      <h3 class="welcome-text">Welcome to our DATA DRIVEN DECISION! 👋🏻</h3>
      <div class="main-container">
        Dear ${inviteDetails.firstname}  ${inviteDetails.lastname},
        <p>
          You've been invited to join Business Tally from ${inviteDetails.inviterName}. Click
          the button below to accept the invitation!
        </p>
        <div class="invite-Btn">
          <a
            href=${YOUR_INVITATION_LINK}
            style="
              background-color: #007bff;
              color: #ffffff;
              padding: 10px 20px;
              margin-top: 10px;
              text-decoration: none;
              display: inline-block;
              border-radius: 5px;
            "
            >Click here</a
          >
        </div>
      </div>
    </div>
  </body>
</html>
    `,
  };
  const resp = await wrapedAsyncSendMail(mailOptions);
  return resp;
};

export const sendEmailUpdateRequest = async (email, url) => {
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: 'Your Email Update to Business-Tally',
    text: 'This is a test message, Thanks for Update Email on Business-Tally.',
    html: `
          <!--  -->

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Template with SVG</title>
  <style>
    /* Styles for the email content */
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px;
      background-color: #fff;
      border-radius: 10px;
    }

    .header-Text {
      margin: 0% 20px;
      color: #333;
    }

    p {
      color: #666;
    }

    .welcome-text {
      padding-top: 20px;
      display: flex;
      justify-content: center;
    }

    .main-container {
      padding: 5% 3%;
    }

    .header {
      display: flex;
      justify-content: center;
    }

    /* Additional styles for the SVG image */
    .svg-image {
      display: flex;
      justify-content: center;
      justify-items: center;
      height: 100%;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      <div class="svg-image">
                    <img width="30" height="30" src='https://cdn.pixabay.com/photo/2014/04/02/10/47/red-304573_1280.png' />
      </div>
      <h2 class="header-Text">DATA DRIVEN DECISION</h2>
    </div>
    <h3 class="welcome-text">Welcome to our DATA DRIVEN DECISION! 👋🏻</h3>
This is a test message, Thanks for Update Email on Business-Tally.
<div class="invite-Btn">
          <a
            href="${url}"
            style="
              background-color: #007bff;
              color: #ffffff;
              padding: 10px 20px;
              margin-top: 10px;
              text-decoration: none;
              display: inline-block;
              border-radius: 5px;
            "
            >Email Update</a
          >
        </div>
  </div>
  </div>
</body>

</html>`,
  };

  const resp = await wrapedAsyncSendMail(mailOptions);
  return resp;
};
