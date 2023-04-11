const nodemailer = require('nodemailer');
const pug = require('pug');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const { convert } = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.url = url;
    this.from = `<${process.env.EMAIL_FROM}>`;
  }

  // eslint-disable-next-line class-methods-use-this
  _initTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async _send(template, subject) {
    const html = pug.renderFile(path.join(__dirname, '..', 'views', 'emails', `${template}.pug`), {
      url: this.url,
      subject,
    });

    const emailConfig = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    await this._initTransport().sendMail(emailConfig);
  }

  async sendHello() {
    await this._send('hello', 'Welcome to our super service!!');
  }

  async sendPasswordReset() {
    await this._send('passreset', 'Password reset instructions..');
  }
};
