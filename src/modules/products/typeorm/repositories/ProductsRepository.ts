import { EntityRepository, Repository } from 'typeorm';
import Product from '../entities/Product';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
    public async findByName(name: string): Promise<Product | undefined> {
        const product = await this.findOne({
            where: { name: name },
        });

        return product;
    }
    public async findById(id: string): Promise<Product | undefined> {
        const product = await this.findOne({
            where: { id: id },
        });

        return product;
    }
}
