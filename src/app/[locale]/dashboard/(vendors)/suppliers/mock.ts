import { faker } from '@faker-js/faker';
import { SupplierType } from '@/types/suppliers.type';

// Generate a random supplier
const generateRandomSupplier = (): SupplierType => {
  return {
    id: faker.string.uuid(),
    name: faker.company.name(),
    contact: faker.phone.number(),
    email: faker.internet.email(),
    gstNumber: faker.string.alphanumeric(15).toUpperCase(),
    taxNumber: faker.string.numeric(10),
    openingBalance: parseFloat(faker.finance.amount({ min: 0, max: 10000, dec: 2 })),
    outstandingBalance: parseFloat(faker.finance.amount({ min: 0, max: 10000, dec: 2 })),
    address: faker.location.streetAddress(),
    postCode: faker.location.zipCode(),
    country: faker.location.country(),
    state: faker.location.state(),
    city: faker.location.city(),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  };
};

// Generate multiple mock suppliers
export const generateMockSuppliers = (count: number): SupplierType[] => {
  const suppliers: SupplierType[] = [];
  
  for (let i = 0; i < count; i++) {
    suppliers.push(generateRandomSupplier());
  }
  
  return suppliers;
}; 