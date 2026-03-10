# WowDash Bootstrap PHP

A modern PHP dashboard template built with Bootstrap 5.

## Features

- Responsive design
- Modern UI components
- Clean and well-structured code
- Secure authentication system
- Role-based access control
- Production-ready logging
- Environment-based configuration

## Requirements

- PHP 7.4 or higher
- MySQL 5.7+ or MariaDB 10.2+
- Composer (for dependency management)
- Node.js & NPM (for frontend assets)

## Installation

1. Clone the repository:
   ```bash
   git clone [repository-url] wowdash
   cd wowdash
   ```

2. Install PHP dependencies:
   ```bash
   composer install
   ```

3. Install frontend dependencies:
   ```bash
   npm install
   npm run build
   ```

4. Configure environment:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your database credentials and other settings.

5. Set proper permissions:
   ```bash
   chmod -R 775 storage/
   chmod -R 775 bootstrap/cache/
   ```

6. Generate application key:
   ```bash
   php -r "echo 'APP_KEY=' . bin2hex(random_bytes(32)) . PHP_EOL;" >> .env
   ```

7. Import the database schema (if available) or run migrations:
   ```bash
   # If you have a SQL dump
   mysql -u username -p database_name < database/schema.sql
   ```

## Configuration

### Environment Variables

Edit the `.env` file to configure your application environment:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=http://localhost

DB_HOST=localhost
DB_DATABASE=wowdash
DB_USERNAME=root
DB_PASSWORD=

# Other configuration options...
```

### Logging

Logs are stored in the `storage/logs` directory. The application automatically rotates logs when they reach 10MB and keeps up to 30 log files.

## Usage

### Development

For development, you can use PHP's built-in server:

```bash
php -S localhost:8000 -t public
```

Then visit `http://localhost:8000` in your browser.

### Production

For production, configure your web server (Apache/Nginx) to point to the `public` directory.

#### Apache

```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    DocumentRoot "/path/to/wowdash/public"

    <Directory "/path/to/wowdash/public">
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/wowdash-error.log
    CustomLog ${APACHE_LOG_DIR}/wowdash-access.log combined
</VirtualHost>
```

#### Nginx

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/wowdash/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
    }

    location ~ /\.ht {
        deny all;
    }
}
```

## Logging

The application provides a simple logging interface:

```php
use App\Utils\Logger;

// Log messages at different levels
Logger::info('User logged in', ['user_id' => 123]);
Logger::error('Database connection failed', ['error' => $e->getMessage()]);
Logger::debug('Debug information', $data);
```

## Security

- Always keep your `.env` file secure and never commit it to version control
- Use strong, unique passwords for database and other services
- Keep all software up to date
- Configure proper file permissions
- Use HTTPS in production

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
