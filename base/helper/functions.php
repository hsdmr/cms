<?php

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
        return MODEL_NAMESPACE . implode('', array_map(fn ($item) => ucfirst($item), array_values(explode('_', $table))));
    }
}
