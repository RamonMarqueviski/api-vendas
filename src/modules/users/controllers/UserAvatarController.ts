import { Request, Response } from 'express';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

class UserAvatarController {
    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const updateAvatar = new UpdateUserAvatarService();

        const user = updateAvatar.execute({
            userId: request.user.id,
            avatarFilename: request.file.filename,
        });

        return response.json(user);
    }
}

export default UserAvatarController;
