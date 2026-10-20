import { env } from '$env/dynamic/private';
import { fail } from '@sveltejs/kit';
import nodemailer from 'nodemailer';

const fallbackRecipient = 'job.johnson@jwkfit.org';

function cleanEnvValue(value) {
  return String(value || '')
    .trim()
    .replace(/^['"]|['"]$/g, '');
}

function getEmailConfig() {
  return {
    user: cleanEnvValue(env.EMAIL_USER || env.GMAIL_USER),
    pass: cleanEnvValue(env.EMAIL_PASS || env.GMAIL_APP_PASSWORD).replace(/\s/g, ''),
    to: cleanEnvValue(env.TO_EMAIL || env.CONTACT_TO_EMAIL || fallbackRecipient)
  };
}

function getMailErrorMessage(error) {
  const diagnostic = error?.responseCode || error?.code || error?.command;

  if (error?.code === 'EAUTH') {
    return `Gmail rejected the production login. Confirm Azure has the same Gmail App Password that worked locally. Diagnostic: ${diagnostic}.`;
  }

  if (error?.code === 'ETIMEDOUT' || error?.code === 'ESOCKET' || error?.command === 'CONN') {
    return `Azure could not reach Gmail SMTP. Check Azure runtime/network logs. Diagnostic: ${diagnostic}.`;
  }

  return `Sorry, the inquiry could not be sent. Please email job.johnson@jwkfit.org directly. Diagnostic: ${diagnostic || 'unknown'}.`;
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
        error: 'Email service is not configured yet. Please email job.johnson@jwkfit.org directly.'
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
