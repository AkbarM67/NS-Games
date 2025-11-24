export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('id-ID');
};

export const getAnnouncementColor = (type: string): string => {
  const colors = {
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    success: 'bg-green-500',
    info: 'bg-blue-500'
  };
  return colors[type as keyof typeof colors] || 'bg-blue-500';
};

export const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};