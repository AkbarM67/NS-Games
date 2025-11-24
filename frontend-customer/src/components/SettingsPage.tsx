import { useState } from "react";
import { 
  Settings, 
  Bell, 
  Shield, 
  CreditCard, 
  Smartphone,
  Mail,
  Globe,
  Database,
  Key,
  Save
} from "lucide-react";
import { Card } from "./SimpleUI";
import { Button } from "./SimpleUI";
import { Input } from "./SimpleUI";
import { Label } from "./SimpleUI";
import { Switch } from "./SimpleUI";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./SimpleUI";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./SimpleUI";

export function SettingsPage() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [whatsappNotif, setWhatsappNotif] = useState(true);
  const [autoRefund, setAutoRefund] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl mb-1">Pengaturan Sistem</h1>
        <p className="text-gray-600">Konfigurasi aplikasi, payment gateway, dan sistem</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="general">Umum</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="notification">Notifikasi</TabsTrigger>
          <TabsTrigger value="provider">Provider</TabsTrigger>
          <TabsTrigger value="security">Keamanan</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3>Pengaturan Umum</h3>
                <p className="text-sm text-gray-600">Konfigurasi dasar aplikasi</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nama Aplikasi</Label>
                  <Input defaultValue="TopUp Admin Pro" />
                </div>
                <div>
                  <Label>Domain Website</Label>
                  <Input defaultValue="topup.example.com" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email Support</Label>
                  <Input defaultValue="support@topup.com" />
                </div>
                <div>
                  <Label>WhatsApp CS</Label>
                  <Input defaultValue="+62812-3456-7890" />
                </div>
              </div>

              <div>
                <Label>Logo Aplikasi</Label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-xs">Logo</span>
                  </div>
                  <Button variant="outline">Upload Logo</Button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="font-medium">Mode Maintenance</p>
                  <p className="text-sm text-gray-600">Nonaktifkan aplikasi untuk maintenance</p>
                </div>
                <Switch 
                  checked={maintenanceMode}
                  onCheckedChange={setMaintenanceMode}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto Refund</p>
                  <p className="text-sm text-gray-600">Otomatis refund jika transaksi gagal</p>
                </div>
                <Switch 
                  checked={autoRefund}
                  onCheckedChange={setAutoRefund}
                />
              </div>
            </div>

            <div className="pt-6">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Simpan Perubahan
              </Button>
            </div>
          </Card>

          {/* Business Settings */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3>Pengaturan Bisnis</h3>
                <p className="text-sm text-gray-600">Margin, komisi, dan pricing</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Margin Default (%)</Label>
                  <Input type="number" defaultValue="10" />
                </div>
                <div>
                  <Label>Komisi Reseller (%)</Label>
                  <Input type="number" defaultValue="5" />
                </div>
                <div>
                  <Label>Min. Deposit (Rp)</Label>
                  <Input type="number" defaultValue="10000" />
                </div>
              </div>

              <div>
                <Label>Harga Level Member</Label>
                <div className="grid grid-cols-4 gap-4 mt-2">
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Bronze</p>
                    <p className="text-lg">100%</p>
                    <p className="text-xs text-gray-500">harga normal</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Silver</p>
                    <p className="text-lg">98%</p>
                    <p className="text-xs text-gray-500">diskon 2%</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Gold</p>
                    <p className="text-lg">95%</p>
                    <p className="text-xs text-gray-500">diskon 5%</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Platinum</p>
                    <p className="text-lg">92%</p>
                    <p className="text-xs text-gray-500">diskon 8%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Save className="w-4 h-4 mr-2" />
                Simpan Pengaturan
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3>Payment Gateway</h3>
                <p className="text-sm text-gray-600">Konfigurasi metode pembayaran</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* QRIS */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">QRIS</p>
                      <p className="text-sm text-gray-600">Payment via QRIS</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-3">
                  <div>
                    <Label>Provider</Label>
                    <Select defaultValue="midtrans">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="midtrans">Midtrans</SelectItem>
                        <SelectItem value="xendit">Xendit</SelectItem>
                        <SelectItem value="duitku">Duitku</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Biaya Admin (%)</Label>
                    <Input type="number" defaultValue="0.7" />
                  </div>
                </div>
              </div>

              {/* Virtual Account */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Virtual Account</p>
                      <p className="text-sm text-gray-600">BCA, BNI, Mandiri, dll</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-3">
                  <div>
                    <Label>Provider</Label>
                    <Select defaultValue="midtrans">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="midtrans">Midtrans</SelectItem>
                        <SelectItem value="xendit">Xendit</SelectItem>
                        <SelectItem value="duitku">Duitku</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Biaya Admin (Rp)</Label>
                    <Input type="number" defaultValue="4000" />
                  </div>
                </div>
              </div>

              {/* E-Wallet */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">E-Wallet</p>
                      <p className="text-sm text-gray-600">GoPay, OVO, DANA, ShopeePay</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-3">
                  <div>
                    <Label>Provider</Label>
                    <Select defaultValue="midtrans">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="midtrans">Midtrans</SelectItem>
                        <SelectItem value="xendit">Xendit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Biaya Admin (%)</Label>
                    <Input type="number" defaultValue="2" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Simpan Konfigurasi
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notification" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3>Pengaturan Notifikasi</h3>
                <p className="text-sm text-gray-600">Konfigurasi email dan WhatsApp notification</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Email Settings */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <h4>Email Notification</h4>
                </div>
                
                <div className="space-y-4 pl-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Aktifkan Email</p>
                      <p className="text-sm text-gray-600">Kirim notifikasi via email</p>
                    </div>
                    <Switch 
                      checked={emailNotif}
                      onCheckedChange={setEmailNotif}
                    />
                  </div>

                  {emailNotif && (
                    <div className="space-y-3 pt-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>SMTP Host</Label>
                          <Input defaultValue="smtp.gmail.com" />
                        </div>
                        <div>
                          <Label>SMTP Port</Label>
                          <Input defaultValue="587" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>SMTP Username</Label>
                          <Input defaultValue="noreply@topup.com" />
                        </div>
                        <div>
                          <Label>SMTP Password</Label>
                          <Input type="password" defaultValue="********" />
                        </div>
                      </div>
                      <div>
                        <Label>From Email</Label>
                        <Input defaultValue="TopUp Admin <noreply@topup.com>" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* WhatsApp Settings */}
              <div className="border-t pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Smartphone className="w-5 h-5 text-gray-600" />
                  <h4>WhatsApp Notification</h4>
                </div>
                
                <div className="space-y-4 pl-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Aktifkan WhatsApp</p>
                      <p className="text-sm text-gray-600">Kirim notifikasi via WhatsApp</p>
                    </div>
                    <Switch 
                      checked={whatsappNotif}
                      onCheckedChange={setWhatsappNotif}
                    />
                  </div>

                  {whatsappNotif && (
                    <div className="space-y-3 pt-2">
                      <div>
                        <Label>WhatsApp API Provider</Label>
                        <Select defaultValue="fonnte">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fonnte">Fonnte</SelectItem>
                            <SelectItem value="wablas">Wablas</SelectItem>
                            <SelectItem value="woowa">Woowa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>API Key</Label>
                        <Input type="password" defaultValue="********************" />
                      </div>
                      <div>
                        <Label>Nomor Pengirim</Label>
                        <Input defaultValue="+62812-3456-7890" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button className="bg-yellow-600 hover:bg-yellow-700">
                <Save className="w-4 h-4 mr-2" />
                Simpan Notifikasi
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Provider Settings */}
        <TabsContent value="provider" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3>Konfigurasi Provider</h3>
                <p className="text-sm text-gray-600">Setting API provider topup</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Digiflazz */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium">Digiflazz</p>
                    <p className="text-sm text-gray-600">Provider topup game dan pulsa</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-green-600">● Aktif</span>
                    <Switch defaultChecked />
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label>Username</Label>
                    <Input defaultValue="admin@topup.com" />
                  </div>
                  <div>
                    <Label>API Key</Label>
                    <Input type="password" defaultValue="********************" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Saldo</Label>
                      <p className="text-lg">Rp 25.500.000</p>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <p className="text-lg text-green-600">Normal</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">Test Koneksi</Button>
                </div>
              </div>

              {/* VIP Reseller */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium">VIP Reseller</p>
                    <p className="text-sm text-gray-600">Provider topup game</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-green-600">● Aktif</span>
                    <Switch defaultChecked />
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label>API ID</Label>
                    <Input defaultValue="123456" />
                  </div>
                  <div>
                    <Label>API Key</Label>
                    <Input type="password" defaultValue="********************" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Saldo</Label>
                      <p className="text-lg">Rp 19.750.000</p>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <p className="text-lg text-green-600">Normal</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">Test Koneksi</Button>
                </div>
              </div>

              {/* Apigames */}
              <div className="p-4 border rounded-lg opacity-50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium">Apigames</p>
                    <p className="text-sm text-gray-600">Provider topup game</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">● Nonaktif</span>
                    <Switch />
                  </div>
                </div>
                <p className="text-sm text-gray-600">Provider belum dikonfigurasi</p>
              </div>
            </div>

            <div className="pt-6">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Save className="w-4 h-4 mr-2" />
                Simpan Provider
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3>Keamanan & Admin</h3>
                <p className="text-sm text-gray-600">Kelola akses dan keamanan sistem</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Change Password */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Key className="w-5 h-5 text-gray-600" />
                  <h4>Ubah Password</h4>
                </div>
                
                <div className="space-y-3 pl-8">
                  <div>
                    <Label>Password Lama</Label>
                    <Input type="password" />
                  </div>
                  <div>
                    <Label>Password Baru</Label>
                    <Input type="password" />
                  </div>
                  <div>
                    <Label>Konfirmasi Password Baru</Label>
                    <Input type="password" />
                  </div>
                  <Button>Ubah Password</Button>
                </div>
              </div>

              {/* Admin Users */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-gray-600" />
                    <h4>Pengguna Admin</h4>
                  </div>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Admin
                  </Button>
                </div>
                
                <div className="space-y-3 pl-8">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Super Admin</p>
                        <p className="text-sm text-gray-600">admin@topup.com</p>
                      </div>
                      <Badge>Owner</Badge>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">CS Manager</p>
                        <p className="text-sm text-gray-600">cs@topup.com</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">CS</Badge>
                        <Button size="sm" variant="outline">Edit</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Log */}
              <div className="border-t pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Database className="w-5 h-5 text-gray-600" />
                  <h4>Riwayat Aktivitas</h4>
                </div>
                
                <div className="space-y-2 pl-8">
                  <div className="text-sm p-3 bg-gray-50 rounded">
                    <p className="text-gray-600">Admin melakukan login - 2 jam lalu</p>
                  </div>
                  <div className="text-sm p-3 bg-gray-50 rounded">
                    <p className="text-gray-600">Produk "Mobile Legends 86" diubah - 5 jam lalu</p>
                  </div>
                  <div className="text-sm p-3 bg-gray-50 rounded">
                    <p className="text-gray-600">Promo "FLASH20" dibuat - 1 hari lalu</p>
                  </div>
                  <Button variant="outline" className="w-full">Lihat Semua Riwayat</Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
