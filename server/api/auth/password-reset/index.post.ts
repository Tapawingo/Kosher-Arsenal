import { string } from "yup";
import { DatabaseUser } from "~/server/utils/db";
import mailer from 'nodemailer';
import { config } from "dotenv";

interface IBody {
  email: unknown
}

export default defineEventHandler(async (event) => {
  const db = event.context.db;
	const { email } = await readBody<IBody>(event);

  
	try {
    if (!await string().email().isValid(email)) {
      throw createError({ status: 400, message: "Invalid email" });
    }
    
    const user = await db.prepare(`SELECT * FROM user WHERE email = ?1`).bind(email).first<DatabaseUser>();
		if (!user) {
			throw createError({ status: 400, message: "User does not exist" });
		}

		const token = await generatePasswordResetToken(db, user.id);
		await sendPasswordResetLink(user, token);

		return {};
	} catch (e) {
    console.error(e);
		throw createError({
			message: "An unknown error occurred",
			statusCode: 500
		});
	}
});

const sendPasswordResetLink = async (user: DatabaseUser, token: string) => {
  config();

  const transporter = mailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_ADDRESS,
      pass: process.env.MAIL_PASSWORD
    }
  });

  let mail = {
    from: process.env.MAIL_ADDRESS,
    to: user.email,
    subject: 'Account password reset',
    html: emailContent(token, user)
  };

  transporter.sendMail(mail, (error, info) => {
    if (error) {
      console.error(error);
      throw createError({
        message: "Failed to send mail",
        statusCode: 500
      });
    } else {
      console.log(`Email sent: ${ info.response }`);
    }
  });
}

const emailContent = (token: string, user: DatabaseUser): string => {
  return `
    <img src="https://kosher-arsenal.nuxt.dev/logo.svg" style="height: 100px" />
    <div style="margin-left: 20px">
    <h2>Hello, ${ user.username }</h2>
    <p>Follow this link to reset your account password at <a href="kosher-arsenal.com">kosher-arsenal.com</a>.<br/><br/>
    </p>
    <a href="kosher-arsenal.com/password-reset/${ token }" 
    style="padding: 12px; border-radius: 5px; background-color: black; color: white; text-decoration: none;"
    >Reset your password</a><br/><br/>
    <p>If you didn't send us the password change request, ignore this email.<br/><br/>
    If the button doesn't work, copy this link and paste it into your browser.<br>
    <a href="/password-reset/${ token }">https://www.kosher-arsenal.com/password-reset/${ token }</a>
    </p>
    <p>
    Best Wishes, <br/>
    Kosher Arsenal Team
    </p>

    <div style="border-bottom: 1px solid rgb(164, 164, 164); border-top: 1px solid rgb(164, 164, 164); padding: 15px 0px">
    This email has been generated automatically. <b>Please do not reply to it.</b>
    </div>
    <p style="color: rgb(128, 128, 128)">&#169 Kosher Arsenal (Tapawingo) 2020 - 2024</p>
    </div>
  `;
}