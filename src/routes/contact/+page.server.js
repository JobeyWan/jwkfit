import { env } from '$env/dynamic/private';
import { fail } from '@sveltejs/kit';
import nodemailer from 'nodemailer';

const fallbackRecipient = 'Jobeywankenobifitness@gmail.com';

function getEmailConfig() {
  return {
    user: (env.EMAIL_USER || env.GMAIL_USER || '').trim(),
    pass: (env.EMAIL_PASS || env.GMAIL_APP_PASSWORD || '').replace(/\s/g, ''),
    to: (env.TO_EMAIL || env.CONTACT_TO_EMAIL || fallbackRecipient).trim()
  };
}

function getMailErrorMessage(error) {
  if (error?.code === 'EAUTH') {
    return 'Gmail rejected the login. Confirm 2-Step Verification is enabled and use a Gmail App Password without spaces.';
  }

  if (error?.code === 'ETIMEDOUT' || error?.code === 'ESOCKET' || error?.command === 'CONN') {
    return 'The email server could not be reached. Check your network or Azure outbound connection settings.';
  }

  return 'Sorry, the inquiry could not be sent. Please email Jobeywankenobifitness@gmail.com directly.';
}

export const actions = {
  sendEmail: async ({ request }) => {
    const data = await request.formData();
    const values = {
      name: String(data.get('name') || '').trim(),
      email: String(data.get('email') || '').trim(),
      goal: String(data.get('goal') || '').trim(),
      message: String(data.get('message') || '').trim()
    };

    if (!values.name || !values.email || !values.goal) {
      return fail(400, {
        values,
        error: 'Please include your name, email, and training goal.'
      });
    }

    const emailConfig = getEmailConfig();

    if (!emailConfig.user || !emailConfig.pass) {
      console.error('Missing email environment variables.');
      return fail(500, {
        values,
        error: 'Email service is not configured yet. Please email Jobeywankenobifitness@gmail.com directly.'
      });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
      },
      connectionTimeout: 10000
    });

    try {
      await transporter.sendMail({
        from: `"Jobey Wan Kenobi Fitness" <${emailConfig.user}>`,
        to: emailConfig.to,
        replyTo: values.email,
        subject: `New Training Inquiry from ${values.name}`,
        text: [
          `Name: ${values.name}`,
          `Email: ${values.email}`,
          `Training Goal: ${values.goal}`,
          '',
          'Message:',
          values.message || 'No additional message provided.'
        ].join('\n')
      });

      return { success: true };
    } catch (error) {
      console.error('Failed to send contact email.', {
        code: error?.code,
        command: error?.command,
        response: error?.response,
        responseCode: error?.responseCode
      });
      return fail(500, {
        values,
        error: getMailErrorMessage(error)
      });
    }
  }
};
