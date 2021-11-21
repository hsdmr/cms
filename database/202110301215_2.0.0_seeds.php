<?php

use Hasdemir\Base\System;

class Seeds200
{
    public function up()
    {
        $db = System::get('pdo');
        $sql = [];
        $sql['user'] = "INSERT INTO `user` (`id`, `first_name`, `last_name`, `role`, `email`, `username`, `email_verified_at`, `password`, `deleted_at`, `created_at`, `updated_at`) VALUES (NULL, 'Murat', 'Hasdemir', 'admin', 'hsdmrsoft@gmail.com', 'admin', NULL, '" . password_hash('Rest135**', PASSWORD_BCRYPT) . "', NULL, " . time() . ", " . time() . ")";
        $sql['post'] = "INSERT INTO `post` (`id`, `permalink_id`, `user_id`, `file_id`, `status`, `title`, `content`, `sidebar`, `template`, `deleted_at`, `created_at`, `updated_at`) VALUES (NULL, '1', '1', NULL, 'published', 'Title 1', 'NULL', 'NULL', 'NULL', NULL, " . time() . ", " . time() . ")";
        
        try {
            foreach ($sql as $key => $value) {
                $db->exec($value);
            }
        } catch(\Throwable $th) {
            echo $th->getMessage();
        }
    }

    public function down()
    {
    }
}
