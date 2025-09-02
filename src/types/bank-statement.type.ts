export type BankStatmentType = {
    id: string;
    amount: number;
    date: Date;
    description: string;
    type: 'revenue' | 'expense';
    category: string;
    subcategory: string;
}