import { Download } from "lucide-react";
import React from "react";

const PDFRequirments = () => {
  return (
    <div className="bg-muted rounded-lg p-4 mb-6">
      <h4 className="font-medium text-foreground mb-3 text-sm">
        PDF File Format Example:
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-muted-foreground border border-border rounded-md">
          <thead>
            <tr className="bg-accent text-foreground text-left">
              <th className="p-2 border-b border-border">Date</th>
              <th className="p-2 border-b border-border">Amount</th>
              <th className="p-2 border-b border-border">Description</th>
              <th className="p-2 border-b border-border">Type</th>
              <th className="p-2 border-b border-border">Category</th>
              <th className="p-2 border-b border-border">Subcategory</th>
            </tr>
          </thead>
          <tbody className="bg-background">
            <tr>
              <td className="p-2 border-t border-border">01/01/2023</td>
              <td className="p-2 border-t border-border">2500.00</td>
              <td className="p-2 border-t border-border">
                PAYROLL DEPOSIT - ABC CORP
              </td>
              <td className="p-2 border-t border-border">revenue</td>
              <td className="p-2 border-t border-border">income</td>
              <td className="p-2 border-t border-border">salary</td>
            </tr>
            <tr>
              <td className="p-2 border-t border-border">01/02/2023</td>
              <td className="p-2 border-t border-border">-75.00</td>
              <td className="p-2 border-t border-border">
                DUKE ENERGY - ELECTRIC BILL
              </td>
              <td className="p-2 border-t border-border">expense</td>
              <td className="p-2 border-t border-border">utilities</td>
              <td className="p-2 border-t border-border">electricity</td>
            </tr>
            <tr>
              <td className="p-2 border-t border-border">01/03/2023</td>
              <td className="p-2 border-t border-border">-45.50</td>
              <td className="p-2 border-t border-border">
                COMCAST - INTERNET BILL
              </td>
              <td className="p-2 border-t border-border">expense</td>
              <td className="p-2 border-t border-border">utilities</td>
              <td className="p-2 border-t border-border">internet</td>
            </tr>
          </tbody>
        </table>
      </div>
      <a
        href="/Banking transactions.pdf"
        target="_blank"
        className="bg-background mt-5 w-full mb-4 text-center text-foreground text-sm font-medium py-2 px-4 rounded-lg border border-border transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <Download className="w-4 h-4" />
        Download Example PDF
      </a>

      {/* Suggestions */}
      <div className="mb-6">
        <h4 className="font-medium text-foreground mb-2 text-sm">
          Please check:
        </h4>
        <ul className="space-y-1 text-xs text-muted-foreground list-disc list-inside">
          <li>The PDF contains transaction data in a table format</li>
          <li>Headers match the required schema exactly</li>
          <li>The file is not corrupted or password protected</li>
          <li>The document is a valid bank statement</li>
        </ul>
      </div>
    </div>
  );
};

export default PDFRequirments;
