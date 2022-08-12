import AppError from '@shared/errors/AppError';
import { EntityRepository, Repository } from 'typeorm';
import UserToken from '../entities/UserToken';

@EntityRepository(UserToken)
class UserTokensRepository extends Repository<UserToken> {
    //findByToken
    public async findByToken(token: string): Promise<UserToken | undefined> {
        const userToken = await this.findOne({ where: { token } });

        if (!userToken) {
            throw new AppError('User token does not exists');
        }

        return userToken;
    }
    public async generate(user_id: string): Promise<UserToken> {
        const userToken = this.create({
            user_id,
        });

        await this.save(userToken);

        return userToken;
    }
}

export default UserTokensRepository;
