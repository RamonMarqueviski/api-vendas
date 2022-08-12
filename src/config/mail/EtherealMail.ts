import modemailer from 'nodemailer';
import HandlebarsMailTemplate from './HandlebarsMailTemplate';

interface IMailContact {
    name: string;
    email: string;
}

interface ITemplateVariable {
    [key: string]: string | number;
}

interface IParseMailTemplate {
    file: string;
    variables: ITemplateVariable;
}

interface ISendMail {
    to: IMailContact;
    from?: IMailContact;
    subject: string;
    templateData: IParseMailTemplate;
}

class EtherealMail {
    static async sendMail({
        to,
        from,
        subject,
        templateData,
    }: ISendMail): Promise<void> {
        const account = await modemailer.createTestAccount();

        const mailtemplate = new HandlebarsMailTemplate();
        const transporter = modemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
                user: account.user,
                pass: account.pass,
            },
        });

        const message = await transporter.sendMail({
            from: {
                name: from?.name || 'Equipe API Vendas',
                address: from?.email || 'equipevendasApi@apivendas.com.br',
            },
            to: {
                name: to.name,
                address: to.email,
            },
            subject: subject,
            html: await mailtemplate.parse(templateData),
        });

        console.log('Message sent: %s', message.messageId);

        console.log('Preview URL: %s', modemailer.getTestMessageUrl(message));
    }
}

export default EtherealMail;
