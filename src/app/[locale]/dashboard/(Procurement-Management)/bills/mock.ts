import { AddressType, BillItemType, BillType, TermsType } from '@/types/bills.type';
import { faker } from '@faker-js/faker';

// Generate a random address
const generateRandomAddress = (): AddressType => {
  return {
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    zipCode: faker.location.zipCode(),
    country: faker.location.country(),
  };
};

// Generate random bill items
const generateRandomBillItems = (count: number): BillItemType[] => {
  const items: BillItemType[] = [];
  
  for (let i = 0; i < count; i++) {
    const quantity = faker.number.int({ min: 1, max: 20 });
    const unitPrice = parseFloat(faker.commerce.price({ min: 10, max: 1000 }));
    const total = quantity * unitPrice;
    
    items.push({
      productId: faker.string.uuid(),
      productName: faker.commerce.productName(),
      quantity,
      unitPrice,
      total,
    });
  }
  
  return items;
};

// Generate a random bill
const generateRandomBill = (): BillType => {
  // Generate between 1 and 5 items
  const items = generateRandomBillItems(faker.number.int({ min: 1, max: 5 }));
  
  // Calculate subtotal
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  
  // Calculate tax (random percentage between 5% and 15%)
  const taxRate = faker.number.float({ min: 0.05, max: 0.15, fractionDigits: 2 });
  const salesTax = parseFloat((subtotal * taxRate).toFixed(2));
  
  // Calculate discount (random percentage between 0% and 10%)
  const discountRate = faker.number.float({ min: 0, max: 0.1, fractionDigits: 2 });
  const discount = parseFloat((subtotal * discountRate).toFixed(2));
  
  // Calculate grand total
  const grandTotal = parseFloat((subtotal + salesTax - discount).toFixed(2));
  
  // Generate random dates
  const billDate = faker.date.recent({ days: 30 }).toISOString();
  
  // Expected shipment date usually after purchase date
  const expectedShipmentDate = faker.date.soon({ days: 14, refDate: new Date(billDate) }).toISOString();
  
  // Random terms
  const terms: TermsType[] = ['due_on_receipt', 'net_15', 'net_30', 'net_60'];
  
  return {
    id: faker.string.uuid(),
    supplierId: faker.string.uuid(),
    supplierEmail: faker.internet.email(),
    terms: faker.helpers.arrayElement(terms),
    billDate,
    expectedShipmentDate,
    billingAddress: generateRandomAddress(),
    shippingAddress: generateRandomAddress(),
    items,
    subtotal,
    salesTax,
    discount,
    grandTotal,
    notes: faker.datatype.boolean(0.7) ? faker.lorem.paragraph() : undefined,
    status: faker.helpers.arrayElement(['pending', 'shipped', 'delivered', 'cancelled']),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  };
};

// Generate multiple mock Bills
export const generateMockBills = (count: number): BillType[] => {
  const bills: BillType[] = [];
  
  for (let i = 0; i < count; i++) {
    bills.push(generateRandomBill());
  }
  
  return bills;
}; 