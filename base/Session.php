<?php

namespace Hasdemir\Base;

class Session
{
  protected const FLASH_KEY = 'flashes';

  public function __construct()
  {
    if (session_status() === PHP_SESSION_NONE) {
      session_start();
    }
  }

  public static function setFlash($key, $message)
  {
    $_SESSION[self::FLASH_KEY][$key] = $message;
  }

  public static function getFlash($key)
  {
    return $_SESSION[self::FLASH_KEY][$key] ?? false;
  }

  public static function set($key, $value)
  {
    $_SESSION[$key] = $value;
  }

  public static function get($key)
  {
    return $_SESSION[$key] ?? false;
  }

  public static function remove($key)
  {
    unset($_SESSION[$key]);
  }

  public static function flush()
  {
    session_destroy();
  }

  public function __destruct()
  {
    unset($_SESSION[self::FLASH_KEY]);
  }
}
