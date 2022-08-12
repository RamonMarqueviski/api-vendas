import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import User from '../typeorm/entities/User';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import path from 'path';
import uploadConfig from '@config/upload';
import fs from 'fs';

interface IRequest {
    userId: string;
    avatarFilename: string;
}

class UpdateUserAvatarService {
    public async execute({ userId, avatarFilename }: IRequest): Promise<User> {
        const userRepository = getCustomRepository(UsersRepository);
        //verifica se o usuario existe
        const user = await userRepository.findById(userId);

        if (!user) {
            throw new AppError('User not found', 400);
        }

        if (user.avatar) {
            const userAvatarFilePath = path.join(
                uploadConfig.directory,
                user.avatar,
            );
            //verifica se o arquivo existe
            const userAvatarFileExists = await fs.promises.stat(
                userAvatarFilePath,
            );

            if (userAvatarFileExists) {
                //remove avatar file
                await fs.promises.unlink(userAvatarFilePath);
            }
        }
        user.avatar = avatarFilename;

        await userRepository.save(user);

        return user;
    }
}

export default UpdateUserAvatarService;
