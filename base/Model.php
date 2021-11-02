<?php

namespace Hasdemir\Base;

use PDO;

class Model
{
    private $db;
    protected string $table;
    protected string $primary_key;
    protected array $fields;
    protected array $uniques;

    protected string $select = '*';
    protected array $where = ['params' => [], 'sql' => ''];
    protected int $where_key;
    protected string $deleted_at;
    protected string $order = '';
    protected string $limit = '';

    public function __construct($db, $table, $primary_key, $fields, $uniques)
    {
        $this->db = $db;
        $this->table = $table;
        $this->primary_key = $primary_key;
        $this->fields = $fields;
        $this->uniques = $uniques;
        foreach ($this->fields as $field) {
            $this->{$field} = '';
        }
    }

    public function save()
    {
        $binds = array_map(fn ($attr) => ":$attr", $this->fields);
        $sql = "INSERT INTO $this->table (" . implode(", ", $this->fields) . ") VALUES (" . implode(", ", $binds) . ")";
        $statement = $this->db->prepare($sql);
        foreach ($this->fields as $field) {
            $statement->bindValue(":$field", $this->{$field});
        }
        $statement->execute();
        return true;
    }

    public function insert($params)
    {
        $params['deleted_at'] = $this->deleted_at;
        $params['created_at'] = time();
        $params['updated_at'] = time();
        $binds = array_map(fn ($attr) => ":$attr", array_keys($params));
        $sql = "INSERT INTO $this->table (" . implode(", ", $this->fields) . ") VALUES (" . implode(", ", $binds) . ")";
        $statement = $this->db->prepare($sql);
        foreach ($this->fields as $field) {
            $statement->bindValue(":$field", $params[$field]);
        }
        $statement->execute();
        return $statement->fetch(PDO::FETCH_ASSOC);
    }
    
    public function set($params = [])
    {
        $params['deleted_at'] = $this->deleted_at ?? time();
        $params['updated_at'] = time();
        $binds = [];
        foreach ($params as $key => $value) {
            $binds[] = $key . ' = :' . $key;
        }
        $sql = "UPDATE $this->table SET " . implode(', ', $binds) . " WHERE " . $this->primary_key . " = :" . $this->primary_key;;
        $statement = $this->db->prepare($sql);
        foreach ($params as $key => $value) {
            $statement->bindValue(":$key", $value);
        }
        $statement->bindValue(":" . $this->primary_key, $this->where_key);
        $bool = $statement->execute(); //Delete de sıkıntı var 
        var_dump($this->deleted_at != null);die;
        if ($this->deleted_at != null) return $bool;
        return $this->find($this->where_key);
    }

    public function get()
    {
        $sql = "SELECT $this->select FROM " . $this->table . $this->where['sql'] . $this->order . $this->limit;
        $statement = $this->db->prepare($sql);
        foreach ($this->where['params'] as $key => $value) {
            $statement->bindValue(":$key", $value);
        }
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }

    public function find($primary_key)
    {
        $this->where_key = $primary_key;
        $sql = "SELECT $this->select FROM " . $this->table ." WHERE " . $this->primary_key . " = :" . $this->primary_key;
        $statement = $this->db->prepare($sql);
        $statement->bindValue(":" . $this->primary_key, $this->where_key);
        $statement->execute();
        return $statement->fetch(PDO::FETCH_ASSOC);
    }
    
    public function all()
    {
        $statement = $this->db->prepare("SELECT * FROM $this->table");
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }

    public function select(array $fields = [])
    {
        $this->select = count($fields) === 1 ? $fields[0] : implode(', ', $fields); 
        return $this;
    }

    public function order(array $order)
    {
        $this->order = " ORDER BY " . $order[0] . ' ' . strtoupper($order[1]);
        return $this;
    }
    
    public function limit(int $limit)
    {
        $this->limit = " LIMIT " . $limit;
        return $this;
    }

    public function where(array $where)
    {
        $this->where = [
            'params' => $where,
            'sql' => " WHERE " . implode(" AND ", array_map(fn ($attr) => "$attr = :$attr", array_keys($where)))
        ];
        return $this;
    }

    public function softDelete(): bool
    {   
        $this->deleted_at = time();
        $this->set();
        return true;
    }
}
