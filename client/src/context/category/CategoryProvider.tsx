import { CategoryContext } from "./CategoryContext";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { Category } from "../../components/admin/CategoryListTable";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

const CategoryProvider: FC<PropsWithChildren> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAllCategories = async (): Promise<Category[] | null> => {
    try {
      setPending(true);
      setError(null);

      const response = await fetch(`${BASE_URL}/category`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to fetch categories: ${response.statusText}`
        );
      }

      const result = await response.json();

      setCategories(result.data);

      return result.data;
    } catch (error) {
      console.log((error as Error).message);
      setError((error as Error).message);
      return null;
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <CategoryContext.Provider
      value={{ categories, setCategories, getAllCategories, pending, error }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export default CategoryProvider;
