<?php

namespace Hasdemir\Base;

use Hasdemir\Exception\NotFoundException;
use Hasdemir\Exception\StoragePdoException;
use PDO;

abstract class Model
{
  private string $primary_key = 'id';
  private PDO $db;
  protected string $table;
  protected array $fields = [];
  protected array $unique = [];
  protected array $hidden = [];
  protected array $protected = [];
  protected bool $soft_delete = false;
  protected bool $with_hidden = false;
  private bool $with_deleted = false;
  private bool $only_deleted = false;

  private array $select = [];
  private string $where_sql = '';
  private array $where_params = [];
  private $where_key;
  private string $order = '';
  private string $limit = '';
  private array $with = [];

  public function __construct()
  {
    Log::currentJob(slugify($this->table, '_') . '-model');
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
    $obj_fields = $this->fields;
    array_shift($fields);
    array_shift($obj_fields);
    $binds = array_map(fn ($attr) => ":$attr", array_keys($fields));
    $sql = "INSERT INTO `$this->table` (`" . implode("`, `", $obj_fields) . "`) VALUES (" . implode(", ", $binds) . ")";
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
    $this->{$this->primary_key} = $this->db->lastInsertId();
    return $this->findByPrimaryKey($this->{$this->primary_key});
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
      $binds[] = '`' . $key . '` = :' . $key;
    }
    $sql = "UPDATE `$this->table` SET " . implode(', ', $binds) . " WHERE " . $this->primary_key . " = :" . $this->primary_key;
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
    return $this->findByPrimaryKey($this->where_key);
  }

  /**
   * Returns the first row in the search query.
   *
   * @return object model
   *
   */
  public function first()
  {
    $model = isset($this->get()[0]) ? $this->get()[0] : null;
    if (is_array($model)) {
      if (isset($model[$this->primary_key])) {
        $this->where_key = $model[$this->primary_key];
      }
    }
    if (is_object($model)) {
      if (isset($model->{$this->primary_key})) {
        $this->where_key = $model->{$this->primary_key};
      }
    }
    return $model;
  }

  /**
   * Returns the search query.
   *
   * @return object collection
   *
   */
  public function get(): array
  {
    $sql = "SELECT " . $this->createValidSelect() . " FROM `$this->table` $this->where_sql";

    if ($this->soft_delete && !$this->with_deleted && !$this->only_deleted) {
      $sql .= ($this->where_sql === '' ? "WHERE" : " AND") . " `deleted_at` IS NULL";
    }

    if ($this->soft_delete && $this->only_deleted && !$this->with_deleted) {
      $sql .= ($this->where_sql === '' ? "WHERE" : " AND") . " `deleted_at` IS NOT NULL";
    }
    $sql .= $this->order . $this->limit;
    $statement = $this->db->prepare($sql);
    $binds = [];
    foreach ($this->where_params as $item) {
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

      if (count(array_diff(array_keys($item), $this->fields)) === 0) {
        $new_model = getModelFromTable($this->table);
        $object = new $new_model;
        $object = $object->newModel($item[$this->primary_key], $this->with_deleted, $this->only_deleted, $this->with_hidden, $this->select);
        foreach ($this->with as $with) {
          $object->{$with} = $object->{$with}();
        }
      }

      $collection[] = $object ?? $item;
    }
    return $collection;
  }

  /**
   * Searches with primary key.
   *
   * @param  array  $primary_key
   * @return object model
   *
   * @throws NotFoundException
   */
  public function findByPrimaryKey(int $primary_key)
  {
    $this->where_key = $primary_key;
    $sql = "SELECT " . $this->createValidSelect() . " FROM `$this->table` WHERE `" . $this->primary_key . "` = :" . $this->primary_key;
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

    if ($item) {
      foreach ($this->fields as $field) {
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

      foreach ($this->fields as $field) {
        if ($this->select != [] && !in_array($field, $this->select)) {
          unset($this->{$field});
        }
      }

      return $this;
    }

    throw new NotFoundException(explode('\\', getModelFromTable($this->table))[2] . " not found");
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
      $sql = "UPDATE `$this->table` SET `deleted_at` = :deleted_at WHERE `" . $this->primary_key . "` = :" . $this->primary_key;
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
    $sql = "DELETE FROM `$this->table` WHERE `" . $this->primary_key . "` = :" . $this->primary_key;
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
  public function withDeleted(): object
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
  public function withHidden(): object
  {
    $this->with_hidden = true;
    return $this;
  }

  /**
   * Returns only deleted data.
   *
   * @param  array  $with
   * @return $this
   *
   */
  public function with($with): object
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
  public function onlyDeleted(): object
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
  public function select(): object
  {
    $this->select = func_get_args() ?? [];
    return $this;
  }

  private function whereConditions($key): void
  {
    if ($this->where_sql === '') {
      $this->where_sql .= ' WHERE';
    }

    if (substr($this->where_sql, -1) !== '(' && substr($this->where_sql, -5) !== 'WHERE') {
      $this->where_sql .= " $key";
    }
  }
  /**
   * Adds where query with and.
   *
   * @return $this
   *
   */
  public function where(): object
  {
    $this->whereConditions('AND');

    $where = func_get_args();
    if (func_num_args() === 2) {
      $key = $where[0];
      $operator = '=';
      $value = $where[1];
    } else {
      $key = $where[0];
      $operator = $where[1];
      $value = $where[2];
    }

    $this->where_params[] = [$key, $operator, $value];
    $this->where_sql = trim($this->where_sql .= " `$key` $operator :$key");

    return $this;
    //$this->where = [
    //  'params' => $where,
    //  'sql' => " WHERE " . implode(" $w ", array_map(fn ($key, $operator) => "$key $operator :$key", $keys, $operators))
    //];
  }

  /**
   * Adds where query with or.
   *
   * @return $this
   *
   */
  public function orWhere(): object
  {
    $this->whereConditions('OR');

    $where = func_get_args();

    if (func_num_args() == 2) {
      $key = $where[0];
      $operator = '=';
      $value = $where[1];
    } else {
      $key = $where[0];
      $operator = $where[1];
      $value = $where[2];
    }

    $this->where_params[] = [$key, $operator, $value];
    $this->where_sql = trim($this->where_sql .= " `$key` $operator :$key");

    return $this;
  }

  /**
   * Adds WHERE IS NULL to query.
   *
   * @return $this
   *
   */
  public function WhereNotNull($key, $conjunction = 'AND'): object
  {
    $this->whereConditions($conjunction);
    $this->where_sql = trim($this->where_sql .= " `$key` IS NOT NULL");

    return $this;
  }

  /**
   * Adds WHERE IS NULL to query.
   *
   * @return $this
   *
   */
  public function WhereIn($key, $keys = []): object
  {
    $this->whereConditions('AND');
    $this->where_sql = trim($this->where_sql .= " `$key` IN ('" . implode("', '", $keys) . "')");

    return $this;
  }

  /**
   * Adds WHERE IS NULL to query.
   *
   * @return $this
   *
   */
  public function WhereNull($key, $conjunction = 'AND'): object
  {
    $this->whereConditions($conjunction);
    $this->where_sql = trim($this->where_sql .= " `$key` IS NULL");

    return $this;
  }

  /**
   * Adds open parenthesis to query with or.
   *
   * @return $this
   *
   */
  public function openPharanthesis($key = ''): object
  {
    if ($this->where_sql === '') {
      $this->where_sql .= ' WHERE (';
    } else {
      $this->where_sql = trim($this->where_sql .= " $key (");
    }


    return $this;
  }

  /**
   * Adds close parenthesis to query with and.
   *
   * @return $this
   *
   */
  public function closePharanthesis(): object
  {
    $this->where_sql = trim($this->where_sql .= " )");

    return $this;
  }

  /**
   * Determines the order of the data to return in the query.
   *
   * @param  array  $order
   * @return $this
   *
   */
  public function order(string $order, string $by = 'ASC'): object
  {
    $this->order = " ORDER BY `" . $order . '` ' . strtoupper($by);
    return $this;
  }

  /**
   * Determines how many rows to return in the query.
   *
   * @param  int  $limit
   * @return $this
   *
   */
  public function limit(int $limit, int $offset = 0): object
  {
    $this->limit = " LIMIT " . $offset . ", " . $limit;
    return $this;
  }

  /**
   * For many to many queries.
   *
   * @param  string  $table
   * @return $collection
   *
   */
  public function belongsToMany(string $table): array
  {
    foreach ([$table . '_' . $this->table, $this->table . '_' . $table] as $item) {
      $statement = $this->db->prepare("SHOW TABLES LIKE '$item';");
      $statement->execute();
      $row = $statement->fetch();
      if ($row) {
        $table_name = $row[0];
      }
    }
    $sql = "SELECT * FROM `" . $table_name . "` WHERE `" . $this->table . "_id` = :" . $this->table;
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
      $new_model = getModelFromTable($this->table);
      $object = new $new_model;
      $object = $object->newModel($item[$this->primary_key], $this->with_deleted, $this->only_deleted, $this->with_hidden, $this->select);
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
  public function belongTo(string $table): array
  {
    $sql = "SELECT * FROM `" . $table . "` WHERE `id` = :id LIMIT 1";
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
    $new_model = getModelFromTable($this->table);
    $object = new $new_model;
    $object = $object->newModel($item[$this->primary_key], $this->with_deleted, $this->only_deleted, $this->with_hidden, $this->select);
    return  $object;
  }

  /**
   *  For has many queries.
   *
   * @param  string  $table
   * @return object
   *
   */
  public function hasMany(string $table): array
  {
    $sql = "SELECT * FROM `" . $table . "` WHERE `" . $this->table . "_id` = :id";
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
      $new_model = getModelFromTable($this->table);
      $object = new $new_model;
      $object = $object->newModel($item[$this->primary_key], $this->with_deleted, $this->only_deleted, $this->with_hidden, $this->select);
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
   * @throws StoragePdoException
   */
  private function checkHasUniqueItem($params): void
  {
    foreach ($this->unique as $key) {
      $result = $this->select("COUNT(id) as count", $key, $this->primary_key)->where($key, $params[$key])->get()[0];
      $this->select = [];
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
  private function timestamps(&$params, $type = 'create'): void
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
  private function createFields(): void
  {
    $sql = "DESCRIBE $this->table";
    $statement = $this->db->prepare($sql);
    $statement->execute();

    foreach ($statement->fetchAll(PDO::FETCH_ASSOC) as $item) {
      $this->fields[] = $item['Field'];
      $this->{$item['Field']} = null;
    }
  }

  /**
   * Creates valid select.
   *
   * @return string
   *
   */
  private function createValidSelect(): string
  {
    if ($this->select == []) {
      return '`' . trim(implode('`, `', array_diff($this->fields, $this->protected))) . '`';
    }
    $specials = [];
    $select = $this->select;
    if ($specials == []) {
      return '`' . trim(implode('`, `', array_diff($select, $this->protected))) . '`';
    }
    if ($select == []) {
      return trim(implode(', ', $specials));
    }
    return trim(implode(', ', $specials)) . ', `' . trim(implode('`, `', array_diff($select, $this->protected))) . '`';
  }

  /**
   * Returns data in array format.
   *
   * @return array
   *
   */
  public function toArray(): array
  {
    $array = [];
    foreach ($this->fields as $field) {
      if (isset($this->{$field})) {
        $array[$field] = $this->{$field};
      }
    }
    return $array;
  }

  public function newModel(int $id, $with_deleted = null, $only_deleted = null, $with_hidden = null, $select = null)
  {
    $model = getModelFromTable($this->table);
    $item = new $model;
    if ($with_deleted) {
      $item->withDeleted();
    }
    if ($only_deleted) {
      $item->onlyDeleted();
    }
    if ($with_hidden) {
      $item->withHidden();
    }
    if ($select) {
      $item->select = $select;
    }
    return $item->findByPrimaryKey($id);
  }

  public function __destruct()
  {
    Log::endJob();
  }
}
