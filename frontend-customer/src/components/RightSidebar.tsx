import { Card, CardContent, CardHeader, CardTitle } from "./SimpleUI";
import { Badge } from "./SimpleUI";
import { Button } from "./SimpleUI";
import { Progress } from "./SimpleUI";
import { Check, X, ChevronRight } from "lucide-react";

export function RightSidebar() {
  return (
    <div className="w-80 p-6 space-y-6">
      {/* IP Conflicts Report */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">IP Conflicts Report</CardTitle>
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
              </div>
              <div>
                <p className="font-medium">Private IP</p>
                <p className="text-sm text-gray-600">192.168.1.1</p>
              </div>
            </div>
            <Check className="h-5 w-5 text-green-500" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
              </div>
              <div>
                <p className="font-medium">Public IP</p>
                <p className="text-sm text-gray-600">203.0.113.1</p>
              </div>
            </div>
            <Check className="h-5 w-5 text-green-500" />
          </div>
        </CardContent>
      </Card>

      {/* Protection Status */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">Protection Status</p>
            
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
                  stroke="#8B5CF6"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={351.8}
                  strokeDashoffset={70.36}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-purple-600">80%</span>
              </div>
            </div>
            
            <div>
              <p className="font-medium">Average Protection</p>
              <p className="text-sm text-gray-600">Check what you can do to actively protect yourself</p>
            </div>
            
            <Button variant="ghost" className="text-gray-600 p-0 h-auto">
              <span>Overview</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Issues Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">262</span>
              <span className="text-gray-600">issues total</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Simple</span>
                </div>
                <span className="text-sm font-medium">50%</span>
              </div>
              <Progress value={50} className="h-2" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Medium</span>
                </div>
                <span className="text-sm font-medium">25%</span>
              </div>
              <Progress value={25} className="h-2" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-sm">Complex</span>
                </div>
                <span className="text-sm font-medium">10%</span>
              </div>
              <Progress value={10} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
