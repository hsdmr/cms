<?php

namespace Hasdemir\Base;

use Hasdemir\Exception\NotFoundException;
use Hasdemir\Exception\StoragePdoException;
use PDO;

class Model
{
  private string $primary_key = 'id';
  private $db;
  protected $table;
  protected $fields = [];
  protected $unique = [];
  protected $hidden = [];
  protected $protected = [];
  protected $soft_delete = false;
  protected $with_hidden = false;
  private bool $with_deleted = false;
  private bool $only_deleted = false;

  private string $select = '*';
  private array $where = ['params' => [], 'sql' => ''];
  private $where_key;
  private string $order = '';
  private string $limit = '';
  private array $with = [];

  public function __construct()
  {
    $this->db = System::getPdo();
    $this->createFields();
  }

  /**
   * It detects whether to edit or add a new row in the table and performs the recording.
   *
   * @return object model
   *
   */
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

  /**
   * Adds a new row to the table.
   *
   * @param  array  $params
   * @return object model
   *
   */
  public function create($params)
  {
    $this->timestamps($params);
    $this->checkHasUniqueItem($params);
    $fields = [];
    foreach ($this->fields as $key) {
      $fields[$key] = $params[$key] ?? null;
    }
    $binds = array_map(fn ($attr) => ":$attr", array_keys($fields));
    $sql = "INSERT INTO $this->table (" . implode(", ", $this->fields) . ") VALUES (" . implode(", ", $binds) . ")";
    $statement = $this->db->prepare($sql);
    $binds = [];
    foreach ($fields as $key => $value) {
      $statement->bindValue(":$key", $value);
      $binds[$key] = $value;
    }
    $GLOBALS[Codes::SQL_QUERIES][] = [
      Codes::QUERY => $sql,
      Codes::BINDS => $binds
    ];
    $statement->execute();
    return $this->find($this->db->lastInsertId());
  }

  /**
   * Updates the relevant row in the table.
   *
   * @param  array  $params
   * @return object model
   *
   */
  public function update($params = [])
  {
    $this->timestamps($params, 'update');
    $this->checkHasUniqueItem($params);
    $binds = [];
    foreach ($params as $key => $value) {
      $binds[] = $key . ' = :' . $key;
    }
    $sql = "UPDATE $this->table SET " . implode(', ', $binds) . " WHERE " . $this->primary_key . " = :" . $this->primary_key;
    $statement = $this->db->prepare($sql);
    $binds = [];
    foreach ($params as $key => $value) {
      $statement->bindValue(":$key", $value);
      $binds[$key] = $value;
    }
    $statement->bindValue(":" . $this->primary_key, $this->where_key);
    $GLOBALS[Codes::SQL_QUERIES][] = [
      Codes::QUERY => $sql,
      Codes::BINDS => $binds
    ];
    $statement->execute();
    return $this->find($this->where_key);
  }

  /**
   * Returns the first row in the search query.
   *
   * @return object model
   *
   */
  public function first()
  {
    $model = $this->get()[0];
    if (is_array($model)) $this->where_key = $model[$this->primary_key];
    if (is_object($model)) $this->where_key = $model->{$this->primary_key};
    return $model;
  }

  /**
   * Returns the search query.
   *
   * @return object collection
   *
   */
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
    $binds = [];
    foreach ($this->where['params'] as $item) {
      $statement->bindValue(":" . $item[0], $item[2]);
      $binds[$item[0]] = $item[2];
    }
    $GLOBALS[Codes::SQL_QUERIES][] = [
      Codes::QUERY => $sql,
      Codes::BINDS => $binds
    ];
    $statement->execute();
    $items = $statement->fetchAll(PDO::FETCH_ASSOC);
    $collection = [];
    foreach ($items as $item) {
      $object = $item;
      if (count(array_diff(array_keys($item), $this->fields)) === 0) {
        $object = call_user_func_array([getModelFromTable($this->table), 'findById'], [$item[$this->primary_key]]);
        foreach ($this->with as $with) {
          $object->{$with} = $object->{$with}();
        }
      }
      $collection[] = $object;
    }
    return $collection;
  }

  /**
   * Searches with primary key.
   *
   * @param  array  $primary_key
   * @return object model
   *
   * @throws \NotFoundException
   */
  public function find($primary_key)
  {
    $this->where_key = $primary_key;
    $sql = "SELECT " . $this->select . " FROM " . $this->table . " WHERE " . $this->primary_key . " = :" . $this->primary_key;
    if ($this->soft_delete && !$this->with_deleted) {
      $sql .= " AND deleted_at IS NULL";
    }
    $statement = $this->db->prepare($sql);
    $binds = [];
    $statement->bindValue(":" . $this->primary_key, $this->where_key);
    $binds[$this->primary_key] = $this->where_key;
    $GLOBALS[Codes::SQL_QUERIES][] = [
      Codes::QUERY => $sql,
      Codes::BINDS => $binds
    ];
    $statement->execute();
    $item = $statement->fetch(PDO::FETCH_ASSOC);
    foreach ($this->fields as $field) {
      if ($field === $this->primary_key && $item[$field] === null) {
        throw new NotFoundException(explode('\\', getModelFromTable($this->table))[2] . " not found");
      }
      $this->{$field} = $item[$field] ?? null;
    }
    if (!$this->with_hidden) {
      foreach ($this->hidden as $hide) {
        unset($this->{$hide});
      }
    }
    foreach ($this->protected as $protect) {
      unset($this->{$protect});
    }
    return $this;
  }

  /**
   * Returns all data in the table.
   *
   * @return object collection
   *
   */
  public function all()
  {
    return $this->get();
  }

  /**
   * Performs deletion according to soft delete status on the table.
   *
   * @return bool
   *
   */
  public function delete(): bool
  {
    if ($this->soft_delete) {
      $sql = "UPDATE " . $this->table . " SET deleted_at = :deleted_at WHERE " . $this->primary_key . " = :" . $this->primary_key;
      $statement = $this->db->prepare($sql);
      $binds = [];
      $statement->bindValue(":$this->primary_key", $this->where_key);
      $binds[$this->primary_key] = $this->where_key;
      $statement->bindValue(":deleted_at", time());
      $binds['deleted_at'] = time();
      $GLOBALS[Codes::SQL_QUERIES][] = [
        Codes::QUERY => $sql,
        Codes::BINDS => $binds
      ];
      $statement->execute();
      return true;
    }
    return $this->forceDelete();
  }

  /**
   * Completely deletes the relevant row in the table.
   *
   * @return bool
   *
   */
  public function forceDelete(): bool
  {
    $sql = "DELETE FROM " . $this->table . " WHERE " . $this->primary_key . " = :" . $this->primary_key;
    $statement = $this->db->prepare($sql);
    $binds = [];
    $statement->bindValue(":$this->primary_key", $this->where_key);
    $binds[$this->primary_key] = $this->where_key;
    $GLOBALS[Codes::SQL_QUERIES][] = [
      Codes::QUERY => $sql,
      Codes::BINDS => $binds
    ];
    $statement->execute();
    return true;
  }

  /**
   * Returns value with deleted data in table.
   *
   * @return object model
   *
   */
  public function withDeleted()
  {
    $this->with_deleted = true;
    return $this;
  }

  /**
   * Returns values with hidden columns in the table.
   *
   * @return object model
   *
   */
  public function withHidden()
  {
    $this->with_hidden = true;
    return $this;
  }

  /**
   * Returns data in array format.
   *
   * @return array
   *
   */
  public function toArray()
  {
    $array = [];
    foreach ($this->fields as $field) {
      $array[$field] = $this->{$field};
    }
    return $array;
  }

  /**
   * Returns only deleted data.
   *
   * @param  array  $with
   * @return $this
   *
   */
  public function with($with)
  {
    $this->with = $with;
    return $this;
  }

  /**
   * Returns only deleted data.
   *
   * @param  array  $params
   * @return $this
   *
   */
  public function onlyDeleted()
  {
    $this->only_deleted = true;
    return $this;
  }

  /**
   * Determines which columns in the table are returned.
   *
   * @param  array  $params
   * @return $this
   *
   */
  public function select()
  {
    $fields = func_get_args() ?? ['*'];
    $this->select = implode(', ', array_diff($fields, $this->protected));
    return $this;
  }

  /**
   * Adds where query with and.
   *
   * @param  array  $where, $w
   * @return $this
   *
   */
  public function where(array $where, string $w = 'AND')
  {
    $keys = [];
    $operators = [];
    foreach ($where as $item) {
      $keys[] = $item[0];
      $operators[] = $item[1];
    }
    $this->where = [
      'params' => $where,
      'sql' => " WHERE " . implode(" $w ", array_map(fn ($key, $operator) => "$key $operator :$key", $keys, $operators))
    ];
    return $this;
  }

  /**
   * Determines the order of the data to return in the query.
   *
   * @param  array  $order
   * @return $this
   *
   */
  public function order(array $order)
  {
    $this->order = " ORDER BY " . $order[0] . ' ' . strtoupper($order[1]);
    return $this;
  }

  /**
   * Determines how many rows to return in the query.
   *
   * @param  int  $limit
   * @return $this
   *
   */
  public function limit(int $limit)
  {
    $this->limit = " LIMIT " . $limit;
    return $this;
  }

  /**
   * For many to many queries.
   *
   * @param  string  $table
   * @return $collection
   *
   */
  public function belongsToMany(string $table)
  {
    foreach ([$table . '_' . $this->table, $this->table . '_' . $table] as $item) {
      $statement = $this->db->prepare("SHOW TABLES LIKE '$item';");
      $statement->execute();
      $row = $statement->fetch();
      if ($row) {
        $table_name = $row[0];
      }
    }
    $sql = "SELECT * FROM " . $table_name . " WHERE " . $this->table . "_id = :" . $this->table;
    $statement = $this->db->prepare($sql);
    $binds = [];
    $statement->bindValue(":" . $this->table, $this->where_key);
    $binds[$this->table . "_id"] = $this->where_key;
    $GLOBALS[Codes::SQL_QUERIES][] = [
      Codes::QUERY => $sql,
      Codes::BINDS => $binds
    ];
    $statement->execute();
    $items = $statement->fetchAll(PDO::FETCH_ASSOC);
    $collection = [];
    foreach ($items as $item) {
      $object = call_user_func_array([getModelFromTable($table), 'findById'], [$item[$this->table . "_id"]]);
      $collection[] = $object;
    }
    return $collection;
  }

  /**
   *  For belong to queries.
   *
   * @param  string  $table
   * @return object
   *
   */
  public function belongTo(string $table)
  {
    $sql = "SELECT * FROM " . $table . " WHERE id = :id LIMIT 1";
    $statement = $this->db->prepare($sql);
    $binds = [];
    $statement->bindValue(":id", $this->{$table . '_id'});
    $binds[$this->primary_key] = $this->{$table . '_id'};
    $GLOBALS[Codes::SQL_QUERIES][] = [
      Codes::QUERY => $sql,
      Codes::BINDS => $binds
    ];
    $statement->execute();
    $item = $statement->fetch(PDO::FETCH_ASSOC);
    return call_user_func_array([getModelFromTable($table), 'findById'], [$item['id']]);
  }

  /**
   *  For has many queries.
   *
   * @param  string  $table
   * @return object
   *
   */
  public function hasMany(string $table)
  {
    $sql = "SELECT * FROM " . $table . " WHERE " . $this->table . "_id = :id";
    $statement = $this->db->prepare($sql);
    $binds = [];
    $statement->bindValue(":id", $this->where_key);
    $binds[$this->table . "_id"] = $this->where_key;
    $GLOBALS[Codes::SQL_QUERIES][] = [
      Codes::QUERY => $sql,
      Codes::BINDS => $binds
    ];
    $statement->execute();
    $items = $statement->fetchAll(PDO::FETCH_ASSOC);
    $collection = [];
    foreach ($items as $item) {
      $object = call_user_func_array([getModelFromTable($table), 'findById'], [$item['id']]);
      $collection[] = $object;
    }
    return $collection;
  }

  /**
   * Checks for unique element in table.
   *
   * @param  array  $params
   * @return void
   *
   * @throws \StoragePdoException
   */
  private function checkHasUniqueItem($params)
  {
    foreach ($this->unique as $key) {
      $result = $this->select("COUNT(id) as count", $key, $this->primary_key)->where([[$key, '=', $params[$key]]])->get()[0];
      $this->select = implode(', ', array_diff($this->fields, $this->hidden));
      if ($this->where_key != '') {
        if ($result['count'] && $result[$this->primary_key] != $this->where_key) {
          throw new StoragePdoException("'$key' has already been registered");
        }
      } else if ($result['count']) {
        throw new StoragePdoException("'$key' has already been registered");
      }
    }
  }

  /**
   * Creates timestamps.
   *
   * @param  array  $params
   * @return void
   *
   */
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

  /**
   * Creates the columns in the table.
   *
   * @param  array  $options
   * @return void
   *
   */
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
