import { createContext, useContext } from "react";
import { Category } from "../../components/admin/CategoryListTable";

export interface CategoryContextType {
    categories:Category[],
    setCategories:(categories: Category[]) => void;
    getAllCategories:()=> Promise<Category[]|null>;
    pending:boolean;
    error:string | null;
 
}
export const CategoryContext = createContext<CategoryContextType>({
    categories:[],
    setCategories:()=>{},
    getAllCategories:async ()=>null,
    pending:false,
    error:null
})
export const useCategory = ()=> useContext(CategoryContext)