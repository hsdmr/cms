<?php

namespace Hasdemir\Base;

use Hasdemir\Exception\DefaultException;
use Hasdemir\Exception\StoragePdoException;
use PDO;

class Model
{
    private string $primary_key = 'id';
    private $db;
    protected $class;
    protected $table;
    protected $fields = [];
    protected $unique = [];
    protected $hidden = [];
    protected $protected = [];
    protected $soft_delete = false;
    private bool $with_deleted = false;
    private bool $only_deleted = false;

    private string $select;
    private array $where = ['params' => [], 'sql' => ''];
    private $where_key;
    private string $order = '';
    private string $limit = '';

    public function __construct()
    {
        $this->db = System::get('pdo');
        $this->createFields();
        $this->select = implode(', ', array_diff($this->fields, array_merge($this->protected, $this->hidden)));
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
        $this->timestamps($params);
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
        $this->select = implode(', ', array_diff($this->fields, array_merge($this->protected, $this->hidden)));
        return $this->find($this->db->lastInsertId());
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
        $model = $this->get()[0];
        if (is_array($model)) $this->where_key = $model[$this->primary_key];
        if (is_object($model)) $this->where_key = $model->{$this->primary_key};
        return $model;
    }

    public function get()
    {
        $sql = "SELECT $this->select FROM " . $this->table . $this->where['sql'];
        if ($this->soft_delete && !$this->with_deleted) {
            $sql .= ($this->where['sql'] === '' ? " WHERE" : " AND") . " deleted_at IS NULL";
        }
        if ($this->soft_delete && $this->only_deleted) {
            $sql .= ($this->where['sql'] === '' ? " WHERE" : " AND") . " deleted_at IS NOT NULL";
        }
        $sql .= $this->order . $this->limit;
        $statement = $this->db->prepare($sql);
        foreach ($this->where['params'] as $item) {
            $statement->bindValue(":" . $item[0], $item[2]);
        }
        $statement->execute();
        $items = $statement->fetchAll(PDO::FETCH_ASSOC);
        $collection = [];
        foreach ($items as $item) {
            $object = call_user_func_array([$this->class, 'getWithId'], [$item[$this->primary_key], false]);
            $collection[] = $object;
        }
        return $collection;
    }

    public function find($primary_key)
    {
        $this->where_key = $primary_key;
        $sql = "SELECT $this->select FROM " . $this->table . " WHERE " . $this->primary_key . " = :" . $this->primary_key;
        if ($this->soft_delete && !$this->with_deleted) {
            $sql .= " AND deleted_at IS NULL";
        }
        $statement = $this->db->prepare($sql);
        $statement->bindValue(":" . $this->primary_key, $this->where_key);
        $statement->execute();
        $item = $statement->fetch(PDO::FETCH_ASSOC);
        foreach ($this->fields as $field) {
            if ($field === $this->primary_key && $this->{$field} == null) {
                throw new StoragePdoException(explode('\\', $this->class)[2] . " not found");
            }
            $this->{$field} = $item[$field];
        }
        return $this;
    }

    public function all()
    {
        return $this->get();
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

    public function withDeleted()
    {
        $this->with_deleted = true;
        return $this;
    }

    public function withHidden()
    {
        $this->select = implode(', ', array_diff($this->fields, $this->protected));
        return $this;
    }

    public function toArray()
    {   
        $array = [];
        foreach ($this->fields as $field) {
            $array[$field] = $this->{$field};
        }
        return $array;
    }

    public function onlyDeleted()
    {
        $this->only_deleted = true;
        return $this;
    }

    public function select(array $fields = [])
    {
        $this->select = implode(', ', array_diff($fields, $this->protected));
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
        foreach ($this->unique as $key) {
            $count = count($this->select([$key])->where([[$key, '=', $params[$key]]])->get());
            $this->select = implode(', ', array_diff($this->fields, $this->hidden));
            if ($count != 0) {
                throw new StoragePdoException("'$key' has already been registered");
            }
        }
    }

    private function timestamps(&$params, $type = 'create')
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

    }

    private function createFields()
    {
        $sql = "DESCRIBE $this->table";
        $statement = $this->db->prepare($sql);
        $statement->execute();

        foreach ($statement->fetchAll(PDO::FETCH_ASSOC) as $item) {
            $this->fields[] = $item['Field'];
            $this->{$item['Field']} = null;
        }
    }
}
