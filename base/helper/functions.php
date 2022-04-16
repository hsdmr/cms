<?php

use Hasdemir\Base\Codes;

if (!function_exists('randomString')) {
  function randomString(int $length = 60): string
  {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $random_string = '';
    for ($i = 0; $i < $length; $i++) {
      $random_string .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $random_string;
  }
}

if (!function_exists('getModelFromTable')) {
  function getModelFromTable($table): string
  {
    return Codes::NAMESPACE_MODEL . implode('', array_map(fn ($item) => ucfirst($item), array_values(explode('_', $table))));
  }
}

if (!function_exists('view')) {
  function view($view = null, $data = [])
  {
    $array = explode('.', $view);
    $extension = end($array);
    $last_index = key($array);
    unset($array[$last_index]);
    $view = implode(DS, $array);
    return include_once ROOT . DS . 'resources' . DS . $view . '.' . $extension;
  }
}

if (!function_exists('asset')) {
  function asset($path = ''): void
  {
    echo $_ENV['APP_URL'] . $path;
  }
}

if (!function_exists('timestamps')) {
  function timestamps($soft_delete = false): string
  {
    $timestamps = "`created_at` BIGINT(20) NULL , `updated_at` BIGINT(20) NULL";
    $timestamps_with_delete = "`deleted_at` BIGINT(20) NULL , `created_at` BIGINT(20) NULL , `updated_at` BIGINT(20) NULL";

    if ($soft_delete) {
      return $timestamps_with_delete;
    } else {
      return $timestamps;
    }
  }
}

if (!function_exists('slugify')) {
  function slugify(string $str, string $seperator = ''): string
  {
    return implode('-', explode($seperator, strtolower($str)));
  }
}


if (!function_exists('getSearchParamsWithDefaults')) {
  function getSearchParamsWithDefaults($params): array
  {
    $params['search'] = $params['search'] ?? "";
    $params['trash'] = $params['trash'] ?? false;
    $params['order'] = $params['order'] ?? 'id';
    $params['limit'] = $params['limit'] ?? 10;
    $params['page'] = $params['page'] ?? 1;
    $params['by'] = $params['by'] ?? 'asc';

    return $params;
  }
}