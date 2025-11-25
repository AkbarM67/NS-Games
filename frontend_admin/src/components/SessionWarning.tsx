import { useState, useEffect } from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { Button } from './ui/button';

interface SessionWarningProps {
  show: boolean;
  remainingTime: number;
  onStayLoggedIn: () => void;
  onLogout: () => void;
}

export function SessionWarning({ show, remainingTime, onStayLoggedIn, onLogout }: SessionWarningProps) {
  const [timeLeft, setTimeLeft] = useState(remainingTime);

  useEffect(() => {
    if (!show) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [show, onLogout]);

  useEffect(() => {
    setTimeLeft(remainingTime);
  }, [remainingTime]);

  if (!show) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Sesi Akan Berakhir</h3>
            <p className="text-sm text-gray-600">Tidak ada aktivitas terdeteksi</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Waktu tersisa:</span>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <p className="text-sm text-gray-500">
              Sesi Anda akan berakhir otomatis untuk keamanan
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onLogout}
            variant="outline"
            className="flex-1"
          >
            Logout Sekarang
          </Button>
          <Button
            onClick={onStayLoggedIn}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Tetap Login
          </Button>
        </div>
      </div>
    </div>
  );
}