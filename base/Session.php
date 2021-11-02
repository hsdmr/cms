<?php

namespace Hasdemir\Base;

class Session
{
    protected const FLASH_KEY = 'flashes';

    public function __construct()
    {
        session_start();
    }

    public function setFlash($key, $message)
    {
        $_SESSION[self::FLASH_KEY][$key] = $message;
    }

    public function getFlash($key)
    {
        return $_SESSION[self::FLASH_KEY][$key] ?? false;
    }

    public function set($key, $value)
    {
        $_SESSION[$key] = $value;
    }

    public function get($key)
    {
        return $_SESSION[$key] ?? false;
    }

    public function remove($key)
    {
        unset($_SESSION[$key]);
    }

    public function __destruct()
    {
        $_SESSION[self::FLASH_KEY] = [];
    }
}