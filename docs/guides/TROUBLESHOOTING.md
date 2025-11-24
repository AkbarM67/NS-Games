# Troubleshooting Guide

## Common Issues and Solutions

### Backend Issues

#### Database Connection Error
**Problem**: `SQLSTATE[HY000] [2002] Connection refused`

**Solution**:
1. Check MySQL service is running
2. Verify database credentials in `.env`
3. Ensure database exists
4. Check firewall settings

#### Composer Dependencies
**Problem**: `Class not found` errors

**Solution**:
```bash
composer dump-autoload
composer install
```

#### Storage Permissions
**Problem**: `Permission denied` for storage/logs

**Solution**:
```bash
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### Frontend Issues

#### Node Modules
**Problem**: Module not found errors

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Build Errors
**Problem**: TypeScript compilation errors

**Solution**:
1. Check TypeScript version compatibility
2. Update type definitions: `npm update @types/*`
3. Clear cache: `npm run clean`

#### CORS Issues
**Problem**: Cross-origin requests blocked

**Solution**:
1. Check Laravel CORS configuration
2. Verify frontend API base URL
3. Update allowed origins in backend

### API Integration Issues

#### Digiflazz Connection
**Problem**: API connection timeout

**Solution**:
1. Verify API credentials
2. Check IP whitelist
3. Test connection manually
4. Review API documentation

#### Midtrans Payment
**Problem**: Payment callback not received

**Solution**:
1. Check webhook URL configuration
2. Verify server key
3. Test in sandbox mode first
4. Check firewall/proxy settings

### Performance Issues

#### Slow Database Queries
**Solution**:
1. Add database indexes
2. Optimize queries
3. Use query caching
4. Monitor slow query log

#### High Memory Usage
**Solution**:
1. Increase PHP memory limit
2. Optimize image processing
3. Use queue for heavy tasks
4. Enable OPcache

### Development Issues

#### Hot Reload Not Working
**Solution**:
```bash
# For Vite
npm run dev -- --host 0.0.0.0
```

#### API Routes Not Found
**Solution**:
```bash
php artisan route:clear
php artisan route:cache
```

## Getting Help

1. Check error logs: `storage/logs/laravel.log`
2. Enable debug mode temporarily: `APP_DEBUG=true`
3. Use browser developer tools
4. Check network requests
5. Review server error logs

## Debugging Tools

### Backend
- Laravel Telescope (development)
- Laravel Debugbar
- Xdebug for PHP debugging

### Frontend
- React Developer Tools
- Redux DevTools
- Browser Network tab

### Database
- Laravel Query Log
- MySQL slow query log
- Database profiling tools