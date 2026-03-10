<?php
// Load environment variables from .env file
if (file_exists(__DIR__ . '/.env')) {
    $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);
        
        if (!array_key_exists($name, $_ENV)) {
            putenv("$name=$value");
            $_ENV[$name] = $value;
            $_SERVER[$name] = $value;
        }
    }
} else {
    die('Please create .env file based on .env.example');
}

// Set error reporting based on environment
if (getenv('APP_DEBUG') === 'true') {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
    ini_set('display_startup_errors', 0);
}

// Timezone
date_default_timezone_set('UTC');

// Function to show error page
function showErrorPage($title = 'Error', $message = 'An error occurred', $debugInfo = '') {
    // Set error page variables
    $GLOBALS['title'] = $title;
    $GLOBALS['subTitle'] = 'Error';
    $GLOBALS['errorMessage'] = $message;
    $GLOBALS['debugInfo'] = $debugInfo;
    
    // Clear any previous output
    if (ob_get_level() > 0) {
        ob_clean();
    }
    
    // Set HTTP status code
    if (!headers_sent()) {
        http_response_code(500);
    }
    
    // Include the error page
    include __DIR__ . '/error.php';
    
    // Stop script execution
    exit(1);
}

// Error and exception handling
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    // Log the error
    $errorMessage = "Error [$errno] $errstr in $errfile on line $errline";
    error_log($errorMessage);
    
    // If it's a fatal error, show the error page
    if (!(error_reporting() & $errno)) {
        return false; // Let the standard error handler handle this
    }
    
    // Prepare debug info
    $debugInfo = [
        'type' => 'Error',
        'message' => $errstr,
        'file' => $errfile,
        'line' => $errline
    ];
    
    // Show error page
    if (!headers_sent()) {
        showErrorPage(
            'Error',
            'An error occurred while processing your request',
            (getenv('APP_DEBUG') === 'true') ? json_encode($debugInfo, JSON_PRETTY_PRINT) : ''
        );
    } else {
        echo '<div style="background: #f8d7da; color: #721c24; padding: 1rem; margin: 1rem; border: 1px solid #f5c6cb; border-radius: 4px;">';
        echo '<h3>An error occurred</h3>';
        echo '<p>Please check the error logs for more information.</p>';
        if (getenv('APP_DEBUG') === 'true') {
            echo '<p><strong>Error:</strong> ' . htmlspecialchars($errstr) . '</p>';
            echo '<p><strong>File:</strong> ' . htmlspecialchars($errfile) . ' on line ' . htmlspecialchars($errline) . '</p>';
        }
        echo '</div>';
    }
    
    return true; // Don't execute PHP internal error handler
});

// Exception handler
set_exception_handler(function($exception) {
    // Log the exception
    error_log("Uncaught Exception: " . $exception->getMessage() . " in " . $exception->getFile() . ":" . $exception->getLine());
    
    // Prepare debug info
    $debugInfo = [
        'type' => get_class($exception),
        'message' => $exception->getMessage(),
        'file' => $exception->getFile(),
        'line' => $exception->getLine(),
        'trace' => $exception->getTraceAsString()
    ];
    
    // Show error page
    if (!headers_sent()) {
        showErrorPage(
            'Exception',
            'An unexpected error occurred',
            (getenv('APP_DEBUG') === 'true') ? json_encode($debugInfo, JSON_PRETTY_PRINT) : ''
        );
    } else {
        echo '<div style="background: #f8d7da; color: #721c24; padding: 1rem; margin: 1rem; border: 1px solid #f5c6cb; border-radius: 4px;">';
        echo '<h3>An unhandled exception occurred</h3>';
        echo '<p>Please check the error logs for more information.</p>';
        if (getenv('APP_DEBUG') === 'true') {
            echo '<p><strong>Message:</strong> ' . htmlspecialchars($exception->getMessage()) . '</p>';
            echo '<p><strong>File:</strong> ' . htmlspecialchars($exception->getFile()) . ' on line ' . $exception->getLine() . '</p>';
            echo '<pre>' . htmlspecialchars($exception->getTraceAsString()) . '</pre>';
        }
        echo '</div>';
    }
    exit(1);
});

// Fatal error handler
register_shutdown_function(function() {
    $error = error_get_last();
    if ($error !== null && in_array($error['type'], [E_ERROR, E_CORE_ERROR, E_COMPILE_ERROR, E_USER_ERROR])) {
        // Log the error
        $errorMessage = "Fatal error: " . $error['message'] . " in " . $error['file'] . ":" . $error['line'];
        error_log($errorMessage);
        
        // Prepare debug info
        $debugInfo = [
            'type' => 'Fatal Error',
            'message' => $error['message'],
            'file' => $error['file'],
            'line' => $error['line']
        ];
        
        // Show error page
        if (!headers_sent()) {
            showErrorPage(
                'Fatal Error',
                'A fatal error occurred while processing your request',
                (getenv('APP_DEBUG') === 'true') ? json_encode($debugInfo, JSON_PRETTY_PRINT) : ''
            );
        } else {
            echo '<div style="background: #f8d7da; color: #721c24; padding: 1rem; margin: 1rem; border: 1px solid #f5c6cb; border-radius: 4px;">';
            echo '<h3>A fatal error occurred</h3>';
            echo '<p>Please check the error logs for more information.</p>';
            if (getenv('APP_DEBUG') === 'true') {
                echo '<p><strong>Error:</strong> ' . htmlspecialchars($error['message']) . '</p>';
                echo '<p><strong>File:</strong> ' . htmlspecialchars($error['file']) . ' on line ' . $error['line'] . '</p>';
            }
            echo '</div>';
        }
    }
});

// Session configuration
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', isset($_SERVER['HTTPS']));

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Database connection
try {
    $pdo = new PDO(
        'mysql:host=' . getenv('DB_HOST') . ';dbname=' . getenv('DB_NAME') . ';charset=utf8mb4',
        getenv('DB_USER'),
        getenv('DB_PASS'),
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::ATTR_STRINGIFY_FETCHES => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
        ]
    );
} catch (PDOException $e) {
    error_log('Database connection failed: ' . $e->getMessage());
    
    // Prepare debug info
    $debugInfo = [
        'type' => 'Database Error',
        'message' => $e->getMessage(),
        'code' => $e->getCode()
    ];
    
    if (!headers_sent()) {
        showErrorPage(
            'Database Error',
            'Unable to connect to the database. Please try again later.',
            (getenv('APP_DEBUG') === 'true') ? json_encode($debugInfo, JSON_PRETTY_PRINT) : ''
        );
    } else {
        echo 'Database connection failed. Please check your configuration.';
    }
    exit(1);
}

// Set default timezone for database if needed
$pdo->exec("SET time_zone = '+00:00';");
