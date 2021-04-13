import { SubCategoryModule } from './sub-category.module';

describe('SubCategoryModule', () => {
    let subCategoryModule: SubCategoryModule;

    beforeEach(() => {
        subCategoryModule = new SubCategoryModule();
    });

    it('should create an instance', () => {
        expect(subCategoryModule).toBeTruthy();
    });
});
