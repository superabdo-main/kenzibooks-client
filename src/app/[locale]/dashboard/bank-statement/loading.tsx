import { FileText, CheckCircle } from 'lucide-react';

export default function BankStatementLoader() {

  return (
    <div>
      <div className=" flex items-center justify-center p-4 transition-colors duration-300">
        {/* Loading Component */}
        <div className=" bg-card rounded-2xl shadow-2xl p-8 max-w-md w-full mx-auto transition-all duration-300">
          {/* Animated Icon Container */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              {/* Spinning Border */}
              <div className="w-20 h-20 border-4 border-blue-900 rounded-full animate-spin border-t-blue-400"></div>
              
              {/* Center Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-blue-400 rounded-full p-3 animate-pulse">
                  <FileText className="w-6 h-6 " />
                </div>
              </div>
            </div>
          </div>

          {/* Main Text */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Processing Document
            </h3>
            <p className="text-muted-foreground  text-sm leading-relaxed">
              Please wait while we process the<br />
              <span className="font-medium  text-muted-foreground">Bank Statement PDF File</span>
            </p>
          </div>

          {/* Progress Steps */}
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
              <span className=" text-foreground">File uploaded successfully</span>
            </div>
            
            <div className="flex items-center text-sm">
              <div className="w-4 h-4 mr-3 flex-shrink-0">
                <div className="w-3 h-3 light:bg-blue-500 bg-blue-400 rounded-full animate-ping"></div>
              </div>
              <span className=" text-foreground">Analyzing document structure</span>
            </div>
            
            <div className="flex items-center text-sm opacity-50">
              <div className="w-4 h-4 border-2 border-foreground border-gray-600 rounded-full mr-3 flex-shrink-0"></div>
              <span className="text-foreground">Extracting transaction data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}