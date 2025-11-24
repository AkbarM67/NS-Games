# Deployment Guide

## Production Deployment

### Server Requirements
- PHP 8.1+ with extensions: BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML
- MySQL 5.7+ or MariaDB 10.3+
- Node.js 18+
- Nginx or Apache
- SSL Certificate

### Backend Deployment

1. **Upload Files**
```bash
# Upload Laravel files to server
rsync -avz ns-topup/ user@server:/var/www/html/
```

2. **Install Dependencies**
```bash
cd /var/www/html
composer install --optimize-autoloader --no-dev
```

3. **Environment Configuration**
```bash
cp .env.example .env
php artisan key:generate
```

4. **Database Setup**
```bash
php artisan migrate --force
php artisan db:seed --force
```

5. **Permissions**
```bash
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### Frontend Deployment

1. **Build Admin Dashboard**
```bash
cd frontend_admin
npm install
npm run build
```

2. **Build Customer Portal**
```bash
cd frontend-customer
npm install
npm run build
```

3. **Deploy Static Files**
Upload dist/ folders to web server or CDN.

### Web Server Configuration

#### Nginx
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/html/public;
    
    index index.php;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

### Environment Variables

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=ns_topup_prod
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password

MIDTRANS_SERVER_KEY=your_production_server_key
MIDTRANS_CLIENT_KEY=your_production_client_key
MIDTRANS_IS_PRODUCTION=true
```

### SSL Configuration

1. Obtain SSL certificate (Let's Encrypt recommended)
2. Configure HTTPS in web server
3. Update APP_URL to use https://
4. Force HTTPS in Laravel:

```php
// In AppServiceProvider boot method
if (config('app.env') === 'production') {
    URL::forceScheme('https');
}
```

### Monitoring

- Set up log monitoring
- Configure error reporting
- Monitor database performance
- Set up backup schedules

### Security Checklist

- [ ] SSL certificate installed
- [ ] Database credentials secured
- [ ] API keys in environment variables
- [ ] File permissions set correctly
- [ ] Debug mode disabled
- [ ] Error reporting configured
- [ ] Backup system in place