import { Product } from "@/types/products.type";

// Fixed mock data for products to prevent hydration issues
const mockProducts: Product[] = [
  {
    id: "prod-1000",
    uuid: "abc123-def456",
    name: "Product 1",
    sku: "SKU-1001",
    barcode: "1234567890123",
    category: "Electronics",
    warehouses: [
      {
        id: "wh-1",
        name: "Warehouse 1",
        quantity: 2,
      },
      {
        id: "wh-2",
        name: "Warehouse 2",
        quantity: 5,
      },
    ],
    description:
      "This is a detailed description for product 1. It includes all relevant information about the product.",
    purchasePrice: 45.99,
    salePrice: 89.99,
    tax: 10,
  },
  {
    id: "prod-1001",
    uuid: "ghi789-jkl012",
    name: "Product 2",
    sku: "SKU-1002",
    barcode: "2345678901234",
    category: "Electronics",
    warehouses: [
      {
        id: "wh-1",
        name: "Warehouse 1",
        quantity: 0,
      },
    ],
    description:
      "This is a detailed description for product 2. It includes all relevant information about the product.",
    purchasePrice: 29.99,
    salePrice: 59.99,
    tax: 5,
  },
  {
    id: "prod-1002",
    uuid: "mno345-pqr678",
    name: "Product 3",
    sku: "SKU-1003",
    barcode: "3456789012345",
    category: "Electronics",
    warehouses: [
      {
        id: "wh-1",
        name: "Warehouse 1",
        quantity: 20,
      },
    ],
    description:
      "This is a detailed description for product 3. It includes all relevant information about the product.",
    purchasePrice: 79.99,
    salePrice: 149.99,
    tax: 15,
  },
];

// Generate mock products in a deterministic way
export const generateMockProducts = (count: number): Product[] => {
  if (count <= mockProducts.length) {
    return mockProducts.slice(0, count);
  }

  const result = [...mockProducts];

  for (let i = mockProducts.length; i < count; i++) {
    const index = i + 1000;
    result.push({
      id: `prod-${index}`,
      uuid: `uuid-${index}-ab-${index * 2}`,
      name: `Product ${i + 1}`,
      sku: `SKU-${index}`,
      barcode: `${index}000000000000`.slice(0, 13),
      category: `Category ${i + 1}`,
      warehouses: [
        {
          id: `wh-${i + 1}`,
          name: `Warehouse ${i + 1}`,
          quantity: 50,
        },
      ],
      description: `This is a detailed description for product ${i + 1}. It includes all relevant information about the product.`,
      purchasePrice: parseFloat(((i % 10) * 10 + 10).toFixed(2)),
      salePrice: parseFloat(((i % 10) * 20 + 20).toFixed(2)),
      tax: i % 20,
    });
  }
  return result;
};
