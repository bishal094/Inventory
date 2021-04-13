import { ProductModule } from './product.module';

describe('LayoutModule', () => {
    let productModule: ProductModule;

    beforeEach(() => {
        productModule = new ProductModule();
    });

    it('should create an instance', () => {
        expect(productModule).toBeTruthy();
    });
});
