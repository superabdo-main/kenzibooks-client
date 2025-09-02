import { BankStatmentType } from "@/types/bank-statement.type";
import { faker } from "@faker-js/faker";

// Generate random bill items
export const generateTransactiions = (count: number): BankStatmentType[] => {
  const items: BankStatmentType[] = [];

  for (let i = 0; i < count; i++) {
    items.push({
      id: faker.string.uuid(),
      date: faker.date.recent({ days: 30 }),
      description: faker.lorem.sentence(),
      amount: faker.number.float({ min: -1000, max: 1000, fractionDigits: 2 }),
      type: faker.helpers.arrayElement(["revenue", "expense"]),
      category: faker.airline.airline().name,
      subcategory: faker.airline.airline().name,
    });
  }

  return items;
};
