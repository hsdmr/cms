<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;
use Hasdemir\Base\System;

class Post extends Model
{
    private $db;
    protected const TABLE = 'post';
    protected const PRIMARY_KEY = 'id';
    protected const FIELDS = ['permalink_id', 'user_id', 'file_id', 'status', 'title', 'content'];
    protected const UNIQUES = ['permalink_id'];
    protected const HIDDENS = ['deleted_at', 'created_at', 'update_at'];
    protected const SOFT_DELETE = true;
    
    public function __construct(\PDO $db = null)
    {
        $this->db = $db ?? System::get('pdo');
        parent::__construct($this->db, self::TABLE, self::PRIMARY_KEY, self::FIELDS, self::UNIQUES, self::HIDDENS, self::SOFT_DELETE);
    }

}
