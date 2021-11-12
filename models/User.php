<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;
use Hasdemir\Base\System;

class User extends Model
{
    private $db;
    protected const TABLE = 'user';
    protected const PRIMARY_KEY = 'id';
    protected const FIELDS = ['first_name', 'last_name', 'role', 'email', 'email_verified_at', 'password'];
    protected const UNIQUES = ['email'];
    protected const HIDDENS = ['deleted_at', 'created_at', 'updated_at'];
    protected const SOFT_DELETE = true;
    
    public function __construct(\PDO $db = null)
    {
        $this->db = $db ?? System::get('pdo');
        parent::__construct($this->db, self::TABLE, self::PRIMARY_KEY, self::FIELDS, self::UNIQUES, self::HIDDENS, self::SOFT_DELETE);
    }
}