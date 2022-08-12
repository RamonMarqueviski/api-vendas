import { EntityRepository, Repository } from 'typeorm';
import User from '../entities/User';

@EntityRepository(User)
class UsersRepository extends Repository<User> {
    public async findByEmail(email: string): Promise<User | undefined> {
        const user = await this.findOne({ where: { email } });

        return user;
    }
    //busca por nome
    public async findByName(name: string): Promise<User | undefined> {
        const user = await this.findOne({ where: { name } });

        return user;
    }
    //busca por id
    public async findById(id: string): Promise<User | undefined> {
        const user = await this.findOne({ where: { id } });

        return user;
    }
}

export default UsersRepository;
