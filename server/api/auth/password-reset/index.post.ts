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

	if (!await string().email().isValid(email)) {
		throw createError({ status: 400, message: "Invalid email" });
	}

	try {
    const user = await db.prepare(`SELECT * FROM user WHERE email = ?1`).bind(email).first<DatabaseUser>();
		if (!user) {
			throw createError({ status: 400, message: "User does not exist" });
		}

		const token = await generatePasswordResetToken(db, user.id);
		await sendPasswordResetLink(user.email, token);

		return {};
	} catch (e) {
    console.error(e);
		throw createError({
			message: "An unknown error occurred",
			statusCode: 500
		});
	}
});

const sendPasswordResetLink = async (email: string, token: string) => {
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
    to: email,
    subject: 'Account password reset',
    html: [
      `<h1>Reset your password</h1>`,
      `<p>Follow this link to reset your account password at <a href="kosher-arsenal.nuxt.dev">kosher-arsenal.com</a>.`,
      `If you didn't request a new password, you can safely delete this email.<br/><br/>`,
      `<a href="kosher-arsenal.nuxt.dev/password-reset/${ token }" style="
      padding: 7px 10px; border-radius: 5px; background-color: black; color: white; text-decoration: none;
      ">Reset your password</a>`
    ].join('')
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