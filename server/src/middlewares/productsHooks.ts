import Product from '../models/product';
import Category from '../models/category';


export const updateCategoryProductCount = async (categoryId: string) => {
  const count = await Product.countDocuments({ categoryId });
  await Category.findByIdAndUpdate(categoryId, { numberOfProducts: count });
};