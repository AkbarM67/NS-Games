import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Check, X, ChevronRight, Wallet, AlertTriangle } from "lucide-react";

export function RightSidebar() {
  return (
    <div className="w-80 p-6 space-y-6">
      {/* Saldo Provider */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Saldo Provider
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
              </div>
              <div>
                <p className="font-medium">Digiflazz</p>
                <p className="text-sm text-gray-600">Rp 0</p>
              </div>
            </div>
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
              </div>
              <div>
                <p className="font-medium">VIP Reseller</p>
                <p className="text-sm text-gray-600">Rp 0</p>
              </div>
            </div>
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
              </div>
              <div>
                <p className="font-medium">Apigames</p>
                <p className="text-sm text-gray-600">Rp 0</p>
              </div>
            </div>
            <X className="h-5 w-5 text-gray-400" />
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">System Status</p>
            
            {/* Circular Progress */}
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#E5E7EB"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#EF4444"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={351.8}
                  strokeDashoffset={316.62}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-red-600">10%</span>
              </div>
            </div>
            
            <div>
              <p className="font-medium">System Health</p>
              <p className="text-sm text-gray-600">Provider saldo perlu diisi untuk operasional</p>
            </div>
            
            <Button variant="ghost" className="text-gray-600 p-0 h-auto">
              <span>Settings</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">0</span>
              <span className="text-gray-600">transaksi hari ini</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Sukses</span>
                </div>
                <span className="text-sm font-medium">0</span>
              </div>
              <Progress value={0} className="h-2" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Pending</span>
                </div>
                <span className="text-sm font-medium">0</span>
              </div>
              <Progress value={0} className="h-2" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Gagal</span>
                </div>
                <span className="text-sm font-medium">0</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}