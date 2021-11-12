<?php

namespace Hasdemir\Base;

use Hasdemir\Exception\DefaultException;
use Hasdemir\Exception\StoragePdoException;
use PDO;

class Model
{
    private $db;
    private string $table;
    private string $primary_key;
    private array $fields;
    private array $uniques;
    private array $hiddens;
    private bool $soft_delete = false;
    private bool $with_deleteds = false;
    private bool $only_deleteds = false;

    private string $select;
    private array $where = ['params' => [], 'sql' => ''];
    private string $where_key;
    private string $order = '';
    private string $limit = '';

    public function __construct($db, $table, $primary_key, $fields, $uniques, $hiddens, $soft_delete)
    {
        $this->db = $db;
        $this->table = $table;
        $this->primary_key = $primary_key;
        $this->uniques = $uniques;
        $this->hiddens = $hiddens;
        $this->soft_delete = $soft_delete;
        $this->fields = $fields;
        $this->timestamps($this->fields);
        foreach ($this->fields as $field) {
            $this->{$field} = '';
        }
        $this->select = implode(', ', array_diff($this->fields, $this->hiddens));
    }

    public function save()
    {
        $params = [];
        foreach ($this->fields as $field) {
            $params[$field] = $this->{$field};
        }
        if (isset($this->where_key)) {
            return $this->update($params);
        }
        return $this->create($params);
    }

    public function create($params)
    {
        $this->timestamps($params, 'create');
        $this->checkHasUniqueItem($params);
        $fields = [];
        foreach ($this->fields as $key) {
            $fields[$key] = $params[$key];
        }
        $binds = array_map(fn ($attr) => ":$attr", array_keys($fields));
        $sql = "INSERT INTO $this->table (" . implode(", ", $this->fields) . ") VALUES (" . implode(", ", $binds) . ")";
        $statement = $this->db->prepare($sql);
        foreach ($fields as $key => $value) {
            $statement->bindValue(":$key", $value);
        }
        $statement->execute();
        if ($this->primary_key == 'id') {
            return $this->find($this->db->lastInsertId());
        }
        return $this->find($fields[$this->primary_key]);
    }

    public function update($params = [])
    {
        $this->timestamps($params, 'update');
        $binds = [];
        foreach ($params as $key => $value) {
            if ($value != '') {
                $binds[] = $key . ' = :' . $key;
            }
        }
        $sql = "UPDATE $this->table SET " . implode(', ', $binds) . " WHERE " . $this->primary_key . " = :" . $this->primary_key;
        $statement = $this->db->prepare($sql);
        foreach ($params as $key => $value) {
            if ($value != '') {
                $statement->bindValue(":$key", $value);
            }
        }
        $statement->bindValue(":" . $this->primary_key, $this->where_key);
        $statement->execute();
        return $this->find($this->where_key);
    }

    public function first()
    {
        return $this->get()[0];
    }

    public function get()
    {
        $sql = "SELECT $this->select FROM " . $this->table . $this->where['sql'];
        if ($this->soft_delete && !$this->with_deleteds) {
            $sql .= ($this->where['sql'] === '' ? " WHERE" : " AND") . " deleted_at IS NULL";
        }
        if ($this->soft_delete && $this->only_deleteds) {
            $sql .= ($this->where['sql'] === '' ? " WHERE" : " AND") . " deleted_at IS NOT NULL";
        }
        $sql .= $this->order . $this->limit;
        $statement = $this->db->prepare($sql);
        foreach ($this->where['params'] as $item) {
            $statement->bindValue(":" . $item[0], $item[2]);
        }
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }

    public function find($primary_key)
    {
        $this->where_key = $primary_key;
        $this->select .= ", $this->primary_key";
        $sql = "SELECT $this->select FROM " . $this->table . " WHERE " . $this->primary_key . " = :" . $this->primary_key;
        $statement = $this->db->prepare($sql);
        $statement->bindValue(":" . $this->primary_key, $this->where_key);
        $statement->execute();
        return $statement->fetch(PDO::FETCH_ASSOC);
    }

    public function all()
    {
        $sql = "SELECT $this->select FROM $this->table";
        if ($this->soft_delete) {
            $sql .= " WHERE deleted_at IS NULL";
        }
        $statement = $this->db->prepare($sql);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }

    public function delete(): bool
    {
        if ($this->soft_delete) {
            $sql = "UPDATE $this->table SET deleted_at = :deleted_at WHERE " . $this->primary_key . " = :" . $this->primary_key;
            $statement = $this->db->prepare($sql);
            $statement->bindValue(":$this->primary_key", $this->where_key);
            $statement->bindValue(":deleted_at", time());
            $statement->execute();
            return true;
        }
        return $this->forceDelete();
    }

    public function forceDelete(): bool
    {
        $sql = "DELETE FROM $this->table WHERE " . $this->primary_key . " = :" . $this->primary_key;
        $statement = $this->db->prepare($sql);
        $statement->bindValue(":$this->primary_key", $this->where_key);
        $statement->execute();
        return true;
    }

    public function withDeleteds()
    {
        $this->with_deleteds = true;
        return $this;
    }

    public function onlyDeleteds()
    {
        $this->only_deleteds = true;
        return $this;
    }

    public function select(array $fields = [])
    {
        $this->select = count($fields) === 1 ? $fields[0] : implode(', ', $fields);
        return $this;
    }

    public function where(array $where)
    {
        $keys = [];
        $operators = [];
        foreach ($where as $item) {
            $keys[] = $item[0];
            $operators[] = $item[1];
        }
        $this->where = [
            'params' => $where,
            'sql' => " WHERE " . implode(" AND ", array_map(fn ($key, $operator) => "$key $operator :$key", $keys, $operators))
        ];
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

    private function checkHasUniqueItem($params)
    {
        foreach ($this->uniques as $key) {
            $count = count($this->select([$key])->where([[$key, '=', $params[$key]]])->get());
            $this->select = implode(', ', array_diff($this->fields, $this->hiddens));
            if ($count != 0) {
                throw new StoragePdoException("'$key' has already been registered");
            }
        }
    }

    private function timestamps(&$params, $type = 'construct')
    {
        if ($type === 'create') {
            $params['updated_at'] = time();
            $params['created_at'] = time();
            if ($this->soft_delete) {
                $params['deleted_at'] = null;
            }
        }

        if ($type === 'update') {
            $params['updated_at'] = time();
            if ($this->soft_delete) {
                $params['deleted_at'] = null;
            }
        }

        if ($type === 'construct') {
            $params[] = 'created_at';
            $params[] = 'updated_at';
            if ($this->soft_delete) {
                $params[] = 'deleted_at';
            }
        }
    }
}
