<?php

namespace App\Utils;

class Logger
{
    private static $logPath = __DIR__ . '/../../storage/logs/';
    private static $maxFileSize = 10485760; // 10MB
    private static $maxFiles = 30;

    public static function log($level, $message, array $context = [])
    {
        if (!file_exists(self::$logPath)) {
            mkdir(self::$logPath, 0777, true);
        }

        $logFile = self::$logPath . 'app-' . date('Y-m-d') . '.log';
        
        // Rotate log file if it exceeds max size
        if (file_exists($logFile) && filesize($logFile) > self::$maxFileSize) {
            self::rotateLogs();
        }

        $contextString = '';
        if (!empty($context)) {
            $contextString = json_encode($context, JSON_PRETTY_PRINT);
        }

        $logMessage = sprintf(
            "[%s] %s: %s %s" . PHP_EOL,
            date('Y-m-d H:i:s'),
            strtoupper($level),
            $message,
            $contextString
        );

        error_log($logMessage, 3, $logFile);
    }

    public static function error($message, array $context = [])
    {
        self::log('error', $message, $context);
    }

    public static function info($message, array $context = [])
    {
        self::log('info', $message, $context);
    }

    public static function warning($message, array $context = [])
    {
        self::log('warning', $message, $context);
    }

    public static function debug($message, array $context = [])
    {
        if (getenv('APP_DEBUG') === 'true') {
            self::log('debug', $message, $context);
        }
    }

    private static function rotateLogs()
    {
        $logFiles = glob(self::$logPath . '*.log');
        
        if (count($logFiles) >= self::$maxFiles) {
            // Sort files by creation time
            usort($logFiles, function($a, $b) {
                return filemtime($a) - filemtime($b);
            });
            
            // Delete the oldest files
            $filesToDelete = array_slice($logFiles, 0, count($logFiles) - self::$maxFiles + 1);
            foreach ($filesToDelete as $file) {
                if (is_file($file)) {
                    unlink($file);
                }
            }
        }
        
        // Rotate current log
        $newLogFile = self::$logPath . 'app-' . date('Y-m-d') . '-' . time() . '.log';
        rename(self::$logPath . 'app-' . date('Y-m-d') . '.log', $newLogFile);
    }
}
