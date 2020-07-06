import * as nodemailer from 'nodemailer';
import logger from '../config/winston_config';

interface MailContent {
  index: number;
  name: string;
  email: string;
  phone?: number;
  content: string;
  subscription: boolean;
}

const toEmail = 'gogle.gallery@gmail.com';

export default function sendEmail(fromEmail: string, content: MailContent) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: process.env.MAILER_EMAIL,
      clientId: process.env.MAILER_CLIENT_ID,
      clientSecret: process.env.MAILER_CLIENT_SECRET,
      refreshToken: process.env.MAILER_REFRESH_TOKEN,
      accessToken: process.env.MAILER_ACCESS_TOKEN,
      expires: 1484314697598,
    },
  } as nodemailer.TransportOptions);

  const mailOptions = {
    from: process.env.MAILER_EMAIL,
    to: toEmail,
    subject: 'Contact from onDisplay.co.kr',
    text: `    index: ${content.index}\n
    name: ${content.name}\n
    email: ${content.email}\n
    phtone: ${content.phone || 'None'}\n
    content: ${content.content}\n
    subscription: ${content.subscription}`,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      logger.error(`[MAILER] ${error}`);
    } else {
      logger.info('[MAIL SENT]');
    }
  });
}
