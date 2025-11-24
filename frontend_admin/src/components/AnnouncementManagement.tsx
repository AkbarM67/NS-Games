import { useState, useEffect } from "react";
import api from "../lib/api";
import { 
  Megaphone, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Calendar,
  AlertCircle
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";

interface Announcement {
  id: number;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function AnnouncementManagement() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'info' as 'info' | 'warning' | 'success' | 'error',
    is_active: true
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get('/admin/announcements');
      if (response.data.success) {
        setAnnouncements(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await api.put(`/admin/announcements/${editingId}`, formData);
        alert('Pengumuman berhasil diupdate!');
      } else {
        await api.post('/admin/announcements', formData);
        alert('Pengumuman berhasil ditambahkan!');
      }
      
      fetchAnnouncements();
      resetForm();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Failed to save'));
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingId(announcement.id);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      is_active: announcement.is_active
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Yakin ingin menghapus pengumuman ini?')) {
      try {
        await api.delete(`/admin/announcements/${id}`);
        alert('Pengumuman berhasil dihapus!');
        fetchAnnouncements();
      } catch (error) {
        alert('Error: ' + (error.response?.data?.message || 'Failed to delete'));
      }
    }
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await api.patch(`/admin/announcements/${id}/toggle`, {
        is_active: !currentStatus
      });
      fetchAnnouncements();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Failed to toggle status'));
    }
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', type: 'info', is_active: true });
    setEditingId(null);
    setShowModal(false);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info': return 'bg-blue-100 text-blue-700';
      case 'warning': return 'bg-yellow-100 text-yellow-700';
      case 'success': return 'bg-green-100 text-green-700';
      case 'error': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertCircle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <Megaphone className="w-4 h-4" />;
    }
  };

  if (loading) {
    return <div className="p-6">Loading announcements...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-1">Manajemen Pengumuman</h1>
          <p className="text-gray-600">Kelola pengumuman untuk pengguna</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Pengumuman
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Megaphone className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl">{announcements.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Aktif</p>
              <p className="text-2xl">{announcements.filter(a => a.is_active).length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <EyeOff className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Nonaktif</p>
              <p className="text-2xl">{announcements.filter(a => !a.is_active).length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Warning</p>
              <p className="text-2xl">{announcements.filter(a => a.type === 'warning').length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Announcements List */}
      <Card className="p-6">
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className={getTypeColor(announcement.type)}>
                      {getTypeIcon(announcement.type)}
                      <span className="ml-1 capitalize">{announcement.type}</span>
                    </Badge>
                    <Badge variant={announcement.is_active ? "default" : "secondary"}>
                      {announcement.is_active ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2">{announcement.title}</h3>
                  <p className="text-gray-600 mb-3">{announcement.content}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Dibuat: {new Date(announcement.created_at).toLocaleDateString('id-ID')}</span>
                    </div>
                    {announcement.updated_at !== announcement.created_at && (
                      <span>Diupdate: {new Date(announcement.updated_at).toLocaleDateString('id-ID')}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleStatus(announcement.id, announcement.is_active)}
                  >
                    {announcement.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(announcement)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(announcement.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {announcements.length === 0 && (
            <div className="text-center py-12">
              <Megaphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Belum ada pengumuman</p>
            </div>
          )}
        </div>
      </Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full">
            <h3 className="text-lg font-semibold mb-4">
              {editingId ? 'Edit Pengumuman' : 'Tambah Pengumuman'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label>Judul</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Masukkan judul pengumuman"
                />
              </div>
              
              <div>
                <Label>Konten</Label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Masukkan isi pengumuman"
                />
              </div>
              
              <div>
                <Label>Tipe</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                >
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="success">Success</option>
                  <option value="error">Error</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                />
                <Label htmlFor="is_active">Aktifkan pengumuman</Label>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={resetForm}>
                Batal
              </Button>
              <Button className="flex-1" onClick={handleSubmit}>
                {editingId ? 'Update' : 'Simpan'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}