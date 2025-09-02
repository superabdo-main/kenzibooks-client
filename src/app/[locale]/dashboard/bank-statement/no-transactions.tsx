import React from "react";
import { FileX, AlertCircle, RefreshCw, Download } from "lucide-react";

export default function NoTransactionsFound() {

  const handleTryAgain = () => {
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-lg p-8 max-w-3xl w-full mx-auto">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
              <FileX className="w-10 h-10 text-gray-400" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Main Message */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No Transactions Found
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            We couldn't find any transactions in the PDF file. Please make sure
            the PDF follows the correct bank statement format.
          </p>
        </div>

        {/* Schema Requirements */}
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
                  <td className="p-2 border-t border-border">PAYROLL DEPOSIT - ABC CORP</td>
                  <td className="p-2 border-t border-border">revenue</td>
                  <td className="p-2 border-t border-border">income</td>
                  <td className="p-2 border-t border-border">salary</td>
                </tr>
                <tr>
                  <td className="p-2 border-t border-border">01/02/2023</td>
                  <td className="p-2 border-t border-border">-75.00</td>
                  <td className="p-2 border-t border-border">DUKE ENERGY - ELECTRIC BILL</td>
                  <td className="p-2 border-t border-border">expense</td>
                  <td className="p-2 border-t border-border">utilities</td>
                  <td className="p-2 border-t border-border">electricity</td>
                </tr>
                <tr>
                  <td className="p-2 border-t border-border">01/03/2023</td>
                  <td className="p-2 border-t border-border">-45.50</td>
                  <td className="p-2 border-t border-border">COMCAST - INTERNET BILL</td>
                  <td className="p-2 border-t border-border">expense</td>
                  <td className="p-2 border-t border-border">utilities</td>
                  <td className="p-2 border-t border-border">internet</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Download Example Button */}
        <a
          href="/Banking transactions.pdf"
          download
          className="block w-full mb-4 text-center bg-muted hover:bg-muted/80 text-sm text-foreground font-medium py-2 px-4 rounded-lg border border-border transition-colors duration-200 flex items-center justify-center gap-2"
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

        {/* Try Again Button */}
        <button
          onClick={handleTryAgain}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>

        {/* Helper Text */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          Need help? Make sure your PDF follows the format shown above exactly.
        </p>
      </div>
    </div>
  );
}
