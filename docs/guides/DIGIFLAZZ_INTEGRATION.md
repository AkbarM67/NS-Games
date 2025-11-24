# DigiFlazz API Integration

## Setup

1. Tambahkan credentials di `.env`:
```
DIGIFLAZZ_USERNAME=your_username
DIGIFLAZZ_API_KEY=your_api_key
```

2. Jalankan migrasi untuk menambah sku_code:
```bash
php artisan migrate:fresh --seed
```

## API Endpoints

### Admin Only (Auth + Admin required)

#### Cek Saldo DigiFlazz
```
GET /api/admin/digiflazz/balance
```

#### Get Price List dari DigiFlazz
```
GET /api/admin/digiflazz/price-list
```

#### Process Order via DigiFlazz
```
POST /api/admin/orders/{id}/process
```

#### Cek Status Order di DigiFlazz
```
GET /api/admin/orders/{id}/check-status
```

## Cara Kerja

1. **Customer** membuat order dan upload bukti bayar
2. **Admin** verifikasi pembayaran dan ubah status ke `pending`
3. **Admin** klik process order → otomatis kirim ke DigiFlazz API
4. Status order otomatis update berdasarkan response DigiFlazz:
   - `processing` → sedang diproses
   - `success` → berhasil
   - `failed` → gagal

## Flow Integration

```
Customer Order → Upload Payment → Admin Verify → Process via DigiFlazz → Auto Update Status
```

## Sample DigiFlazz SKU Codes

Tambahkan di database products:
- Mobile Legends 86 Diamond: `ML86`
- Free Fire 70 Diamond: `FF70`
- PUBG Mobile 60 UC: `PUBG60`

## Error Handling

- Log semua request/response DigiFlazz
- Update order status berdasarkan response
- Simpan external reference ID untuk tracking