import AppError from '@shared/errors/AppError';
import { compare, hash } from 'bcryptjs';
import { getCustomRepository } from 'typeorm';
import UsersRepository from '../typeorm/repositories/UsersRepository';

interface IRequest {
    user_id: string;
    password: string;
    email: string;
    name: string;
    old_password: string;
}

class UpdateProfileService {
    public async execute({
        user_id,
        name,
        email,
        password,
        old_password,
    }: IRequest): Promise<void> {
        const userRepository = getCustomRepository(UsersRepository);

        const user = await userRepository.findById(user_id);

        if (!user) {
            throw new AppError('User not found.');
        }

        const userWithUpdatedEmail = await userRepository.findByEmail(email);

        if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
            throw new AppError('E-mail already in use.');
        } else {
            user.email = email;
        }

        if (password && !old_password) {
            throw new AppError(
                'Old password is required to set a new password.',
            );
        }

        if (password && old_password) {
            const checkOldPassword = await compare(old_password, user.password);

            if (!checkOldPassword) {
                throw new AppError('Old password does not match.');
            }

            user.password = await hash(password, 8);
        }

        user.name = name;
        user.email = email;

        await userRepository.save(user);
    }
}

export default UpdateProfileService;
