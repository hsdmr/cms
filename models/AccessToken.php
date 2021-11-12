<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;
use Hasdemir\Base\System;

class AccessToken extends Model
{
    private $db;
    protected const TABLE = 'access_token';
    protected const PRIMARY_KEY = 'token';
    protected const FIELDS = ['token', 'user_id', 'type', 'attributes', 'scope', 'expires'];
    protected const UNIQUES = ['token'];
    protected const HIDDENS = ['created_at', 'update_at'];
    protected const SOFT_DELETE = false;
    
    public function __construct(\PDO $db = null)
    {
        $this->db = $db ?? System::get('pdo');
        parent::__construct($this->db, self::TABLE, self::PRIMARY_KEY, self::FIELDS, self::UNIQUES, self::HIDDENS, self::SOFT_DELETE);
    }

}
