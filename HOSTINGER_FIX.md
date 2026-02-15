# Hostinger Deployment Fix

## المشكلة:
الـ Frontend files موجودة في `frontend/` subfolder بس الـ .htaccess بيدور عليها في الـ Root

## الحل:

### Option 1: انقل Frontend files للـ Root (أسهل)

على الـ VPS اعمل:
```bash
cd /home/u849637831/domains/lightgrey-antelope-357802.hostingersite.com/public_html

# احفظ نسخة احتياطية
mv frontend frontend-backup

# انقل كل الملفات للـ root
mv frontend-backup/* .
mv frontend-backup/.* . 2>/dev/null || true

# امسح الفولدر الفاضي
rmdir frontend-backup

# نتأكد من الملفات
ls -la
```

### Option 2: عدل الـ .htaccess (لو عاوز تفصل Frontend/Backend)

استبدل `.htaccess` بـ:
```apache
# Don't use Passenger for frontend
# PassengerAppRoot /home/u849637831/domains/lightgrey-antelope-357802.hostingersite.com/public_html
# PassengerAppType node
# PassengerNodejs /opt/alt/alt-nodejs18/root/bin/node
# PassengerStartupFile server.js

<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /

# API requests -> Backend on port 5000
RewriteRule ^api/(.*)$ http://localhost:5000/api/$1 [P,L]

# Uploads -> Backend
RewriteRule ^uploads/(.*)$ http://localhost:5000/uploads/$1 [P,L]

# Everything else -> serve from frontend/ folder
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /frontend/$1 [L]
</IfModule>
```

بعدين شغل Backend separately:
```bash
cd /home/u849637831/domains/lightgrey-antelope-357802.hostingersite.com/public_html/nodeapp
npm install
pm2 start server.js --name franchise-backend
```
