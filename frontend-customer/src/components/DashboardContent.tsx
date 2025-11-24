import { Card, CardContent } from "./SimpleUI";
import { Button } from "./SimpleUI";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Monitor, Calendar, Globe, Clock } from "lucide-react";

const chartData = [
  { month: 'Feb', value: 40 },
  { month: 'Mar', value: 50 },
  { month: 'Apr', value: 35 },
  { month: 'May', value: 45 },
  { month: 'Jun', value: 55 },
  { month: 'Jul', value: 25 },
  { month: 'Aug', value: 70 },
  { month: 'Sep', value: 45 },
  { month: 'Oct', value: 65 },
  { month: 'Nov', value: 60 },
  { month: 'Dec', value: 45 },
  { month: 'Jan', value: 40 },
];

export function DashboardContent() {
  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Monitor className="h-8 w-8" />
              <div>
                <p className="text-purple-100 text-sm">Local Name</p>
                <p className="font-semibold">WINPQR-24</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-400 to-teal-500 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8" />
              <div>
                <p className="text-teal-100 text-sm">Registered On</p>
                <p className="font-semibold">2023-01-02 2:00 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-400 to-orange-500 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Globe className="h-8 w-8" />
              <div>
                <p className="text-orange-100 text-sm">Scheduled Scans</p>
                <p className="font-semibold">131 (Subdomain - 6)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-400 to-green-500 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8" />
              <div>
                <p className="text-green-100 text-sm">Agent</p>
                <p className="font-semibold">v1.0.0.8</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bonus Section */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm mb-2">Bonus of the month</p>
              <h3 className="text-2xl font-bold mb-1">You have Bonus $100</h3>
              <p className="text-xl">10 Free Spins</p>
              <Button className="mt-4 bg-white text-purple-600 hover:bg-gray-100">
                Claim Bonus
              </Button>
            </div>
            <div className="text-6xl">🎁</div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Section */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-8">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">9.5k</p>
                    <p className="text-gray-600">Total Files</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">8k</p>
                    <p className="text-gray-600">Scanned Files</p>
                  </div>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Nov 2023
                </Button>
              </div>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis 
                      dataKey="month" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                      domain={[0, 80]}
                      ticks={[0, 20, 40, 60, 80]}
                    />
                    <Bar 
                      dataKey="value" 
                      radius={[4, 4, 0, 0]}
                      fill="#8B5CF6"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
