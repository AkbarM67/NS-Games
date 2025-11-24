import { useState, useEffect } from "react";
import { User, Mail, Phone, Calendar, Shield, Camera } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import api from "../lib/api";

export function AdminProfile({ onProfileUpdate }: { onProfileUpdate?: () => void }) {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    created_at: "",
    avatar_url: null
  });
  const [editData, setEditData] = useState({ name: "", phone: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/admin/user');
      if (response.data.success) {
        const user = response.data.user;
        setUserData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          role: user.role || "",
          created_at: user.created_at || "",
          avatar_url: user.avatar_url
        });
        setEditData({ name: user.name || "", phone: user.phone || "" });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback to localStorage if API fails
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          role: user.role || "",
          created_at: user.created_at || "",
          avatar_url: user.avatar_url
        });
        setEditData({ name: user.name || "", phone: user.phone || "" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        alert('File harus berupa gambar (JPEG, PNG, JPG, atau GIF)');
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2048 * 1024) {
        alert('Ukuran file maksimal 2MB');
        return;
      }
      
      console.log('Selected file:', {
        name: file.name,
        type: file.type,
        size: file.size
      });
      
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append('name', editData.name);
      formData.append('phone', editData.phone);
      if (selectedFile) {
        formData.append('avatar', selectedFile);
      }

      console.log('Updating profile with data:', {
        name: editData.name,
        phone: editData.phone,
        hasAvatar: !!selectedFile
      });

      const response = await api.post('/admin/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Profile update response:', response.data);
      
      if (response.data.success) {
        // Update localStorage with new data
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          const updatedUser = {
            ...user,
            name: editData.name,
            phone: editData.phone,
            avatar_url: response.data.data?.avatar_url || user.avatar_url
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        
        fetchUserProfile(); // Refresh data from API
        onProfileUpdate?.(); // Trigger header refresh
        setShowEditProfile(false);
        setSelectedFile(null);
        setPreviewUrl(null);
        alert('Profile berhasil diupdate!');
      } else {
        alert('Gagal update profile: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response?.data?.message) {
        alert('Error: ' + error.response.data.message);
      } else {
        alert('Terjadi kesalahan saat update profile');
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl mb-1">Profil Admin</h1>
        <p className="text-gray-600">Kelola informasi profil admin</p>
      </div>

      {/* Profile Card */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl overflow-hidden">
              {userData.avatar_url ? (
                <img 
                  src={`http://localhost/NS-topupgames/ns-topup/public${userData.avatar_url}`}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                userData.name.charAt(0)
              )}
            </div>
            <div>
              <h2 className="text-2xl mb-2">{userData.name}</h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
                  <Shield className="w-3 h-3" />
                  {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                </div>
              </div>
            </div>
          </div>
          <Button onClick={() => setShowEditProfile(true)} variant="outline">
            Edit Profil
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p>{userData.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Telepon</p>
                <p>{userData.phone || '-'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Bergabung Sejak</p>
                <p>{new Date(userData.created_at).toLocaleDateString('id-ID')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Role</p>
                <p className="capitalize">{userData.role}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profil Admin</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl overflow-hidden">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : userData.avatar_url ? (
                    <img 
                      src={`http://localhost/NS-topupgames/ns-topup/public${userData.avatar_url}`}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    userData.name.charAt(0)
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
                  <Camera className="w-4 h-4" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-600 mt-2">Klik ikon kamera untuk mengubah foto</p>
            </div>

            <div>
              <Label>Nama Lengkap</Label>
              <Input 
                value={editData.name}
                onChange={(e) => setEditData({...editData, name: e.target.value})}
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input type="email" value={userData.email} disabled />
            </div>

            <div>
              <Label>Nomor Telepon</Label>
              <Input 
                value={editData.phone}
                onChange={(e) => setEditData({...editData, phone: e.target.value})}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowEditProfile(false)}
              >
                Batal
              </Button>
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={handleUpdateProfile}
              >
                Simpan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}