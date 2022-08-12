import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import User from '../typeorm/entities/User';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';

interface IRequest {
    email: string;
    password: string;
}
interface IResponse {
    user: User;
    token: string;
}

class CreateSessionService {
    public async execute({ email, password }: IRequest): Promise<IResponse> {
        const userRepository = getCustomRepository(UsersRepository);
        const user = await userRepository.findByEmail(email);

        if (!user) {
            throw new AppError('Not exists user with this email', 401);
        }

        const passwordMatched = await compare(password, user.password);

        if (!passwordMatched) {
            throw new AppError('Incorrect password.', 401);
        }

        const token = sign({}, authConfig.jwt.secret, {
            subject: user.id,
            expiresIn: authConfig.jwt.expiresIn,
        });

        return {
            user,
            token,
        };
    }
}

export default CreateSessionService;
