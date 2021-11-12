<?php

namespace Hasdemir\Base;

class Log
{
    const LOG_DIR = ROOT . DS . 'logs';
    private static $currentJob;

    private static function insert($log, $type, $date = true) {
        $log_file = $date ? date('Y-m-d') . ".log" : $type . ".log";
        if (!file_exists(self::LOG_DIR)) {
            mkdir(self::LOG_DIR);
        }
        if (!file_exists(self::LOG_DIR . DS . $type)) {
            mkdir(self::LOG_DIR . DS . $type);
        }

        $file = fopen(self::LOG_DIR . DS . $type . DS . $log_file, 'a');
        $write = fwrite($file, $log);
        fclose($file);
    }

    public static function startApp()
    {
        $log = '-------------------- App Started At => ' . date('Y-m-d H:i:s') .  ' --------------------' . PHP_EOL;
        self::insert($log, 'daily');
    }
    
    public static function endApp()
    {
        $log = '-------------------- App Ended At => ' . date('Y-m-d H:i:s') .  ' ----------------------' . PHP_EOL . PHP_EOL;
        self::insert($log, 'daily');
    }

    public static function currentJob($job)
    {
        self::$currentJob = $job;
        $log = '[' . date('Y-m-d H:i:s') . '] Start => \'' . self::$currentJob . '\'' . PHP_EOL;
        self::insert($log, 'daily');
    }
    
    public static function endJob()
    {
        $log = '[' . date('Y-m-d H:i:s') . '] End => \'' . self::$currentJob . '\'' . PHP_EOL;
        self::insert($log, 'daily');
    }
    
    public static function request($url, $method)
    {
        $log = '[' . date('Y-m-d H:i:s') . '] Request url => \'' . $url . '\', method => \'' . $method . '\'' . PHP_EOL;
        self::insert($log, 'daily');
    }

    public static function error($response, $e, $th)
    {
        $log = '[' . date('Y-m-d H:i:s') . '] Throwed error. Message => "' . $response['message'] . '", Status Code => \'' . $e->http_code . '\'' . PHP_EOL;
        self::insert($log, 'daily');
        $log = '[' . date('Y-m-d H:i:s') . '] {"message": "' . $e->getMessage() . '", "status": "' . $e->http_code . '", "file": "' . $e->getFile() . '", "line": "' . $e->getLine() . '"}';
        /*foreach ($th as $t) {
            $log .= '{"message": "' . $t->getMessage() . '", "status": "' . $t->http_code . '", "file": "' . $t->getFile() . '", "line": "' . $t->getLine() . '"}';
        }*/
        $log .= PHP_EOL . PHP_EOL;

        self::insert($log, 'error', false);
    }
}