import EtherealMail from '@config/mail/EtherealMail';
import AppError from '@shared/errors/AppError';
import path from 'path';
import { getCustomRepository } from 'typeorm';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import UserTokensRepository from '../typeorm/repositories/UserTokensRepository';

interface IRequest {
    email: string;
}

class SendForgotPasswordEmailService {
    public async execute({ email }: IRequest): Promise<void> {
        const userRepository = getCustomRepository(UsersRepository);
        const userTokensRepository = getCustomRepository(UserTokensRepository);
        // Find user by email
        const user = await userRepository.findByEmail(email);

        if (!user) {
            throw new AppError('User does not exists.', 401);
        }
        // Generate a token
        const token = await userTokensRepository.generate(user.id);

        const forgotPasswordTemplate = path.resolve(
            __dirname,
            '..',
            'views',
            'forgot_password.hbs',
        );

        await EtherealMail.sendMail({
            to: {
                name: user.name,
                email: user.email,
            },
            from: {
                name: 'Equipe API Vendas',
                email: 'equipevendasApi@apivendas.com.br',
            },
            subject: '[API Vendas] Recuperação de senha',
            templateData: {
                file: forgotPasswordTemplate,
                variables: {
                    name: user.name,
                    link: `${process.env.APP_WEB_URL}/reset-password?token=${token.token}`,
                    equipe_name: 'Equipe API Vendas',
                },
            },
        });
    }
}

export default SendForgotPasswordEmailService;
