import { Category } from "@/stores/categories.store";

// Fixed mock data for categories to prevent hydration issues
const mockCategories: Category[] = [
  {
    id: "cat-1000",
    name: "Electronics",
    numberOfProducts: 25,
  },
  {
    id: "cat-1001",
    name: "Books",
    numberOfProducts: 42,
  },
  {
    id: "cat-1002",
    name: "Clothing",
    numberOfProducts: 18,
  },
  {
    id: "cat-1003",
    name: "Furniture",
    numberOfProducts: 10,
  },
  {
    id: "cat-1004",
    name: "Toys",
    numberOfProducts: 15,
  },
];

// Generate mock categories in a deterministic way
export const generateMockCategories = (count: number): Category[] => {
  if (count <= mockCategories.length) {
    return mockCategories.slice(0, count);
  }

  const result = [...mockCategories];

  for (let i = mockCategories.length; i < count; i++) {
    const index = i + 1000;
    result.push({
      id: `cat-${index}`,
      name: `Category ${i + 1}`,
      numberOfProducts: Math.floor(Math.random() * 50) + 1,
    });
  }
  return result;
}; 