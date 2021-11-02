<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;
use Hasdemir\Base\System;
use Hasdemir\Exception\DefaultException;

class Post extends Model
{
    private $db;
    protected const TABLE = 'post';
    protected const PRIMARY_KEY = 'id';
    protected const FIELDS = ['permalink_id', 'user_id', 'file_id', 'status', 'title', 'content'];
    protected const UNIQUES = ['permalink_id'];
    protected const SOFT_DELETE = true;
    
    public function __construct(\PDO $db = null)
    {
        $this->db = $db ?? System::get('pdo');
        parent::__construct($this->db, self::TABLE, self::PRIMARY_KEY, self::FIELDS, self::UNIQUES, self::SOFT_DELETE);
    }

    public function create($data)
    {
        throw new DefaultException('deneme');
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
