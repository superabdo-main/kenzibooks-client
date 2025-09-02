import { Warehouse } from "@/stores/warehouses.store";

// Fixed mock data for warehouses to prevent hydration issues
const mockWarehouses: Warehouse[] = [
  {
    id: "wh-1000",
    name: "Main Warehouse",
    numberOfProducts: 120,
  },
  {
    id: "wh-1001",
    name: "East Wing Storage",
    numberOfProducts: 85,
  },
  {
    id: "wh-1002",
    name: "West Distribution Center",
    numberOfProducts: 210,
  },
  {
    id: "wh-1003",
    name: "North Facility",
    numberOfProducts: 45,
  },
  {
    id: "wh-1004",
    name: "South Depot",
    numberOfProducts: 68,
  },
];

// Generate mock warehouses in a deterministic way
export const generateMockWarehouses = (count: number): Warehouse[] => {
  if (count <= mockWarehouses.length) {
    return mockWarehouses.slice(0, count);
  }

  const result = [...mockWarehouses];

  for (let i = mockWarehouses.length; i < count; i++) {
    const index = i + 1000;
    result.push({
      id: `wh-${index}`,
      name: `Warehouse ${i + 1}`,
      numberOfProducts: Math.floor(Math.random() * 150) + 10,
    });
  }
  return result;
};
