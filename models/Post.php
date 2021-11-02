<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;
use Hasdemir\Base\System;

class Post extends Model
{
    private $db;
    protected const TABLE = 'post';
    protected const PRIMARY_KEY = 'id';
    protected const FIELDS = ['permalink_id', 'user_id', 'file_id', 'status', 'title', 'content', 'deleted_at', 'created_at', 'updated_at'];
    protected const UNIQUES = ['permalink_id'];
    
    public function __construct(\PDO $db = null)
    {
        $this->db = $db ?? System::get('pdo');
        parent::__construct($this->db, self::TABLE, self::PRIMARY_KEY, self::FIELDS, self::UNIQUES);
    }

    public function create($data)
    {
        return $this->insert([
            'permalink_id' => $data['permalink_id'],
            'user_id' => $data['user_id'] ?? 1,
            'file_id' => $data['file_id'] ?? null,
            'status' => $data['status'] ?? 'published',
            'title' => $data['title'] ?? 'Post_'. uniqid(),
            'content' => $data['content'] ?? '',
        ]);
    }
    
    public function update($data)
    {
        return $this->set([
            'file_id' => $data['file_id'] ?? null,
            'status' => $data['status'] ?? 'published',
            'title' => $data['title'] ?? 'Post_'. uniqid(),
            'content' => $data['content'] ?? '',
        ]);
    }
}
