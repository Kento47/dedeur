<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

if ($method === 'GET') {
    $rows = $db->query('SELECT id, name, email, role FROM users ORDER BY id')->fetchAll();
    json_response($rows);

} elseif ($method === 'POST') {
    $body = get_body();
    $id = (string) time();
    $db->prepare('INSERT INTO users (id, name, email, password, role) VALUES (?,?,?,?,?)')
       ->execute([$id, $body['name'], $body['email'], $body['password'], $body['role'] ?? 'user']);
    $user = $db->prepare('SELECT id, name, email, role FROM users WHERE id = ?');
    $user->execute([$id]);
    json_response($user->fetch(), 201);

} elseif ($method === 'PUT') {
    $body = get_body();
    $id = $body['id'] ?? null;
    if (!$id) json_response(['error' => 'ID verplicht.'], 400);

    $fields = [];
    $values = [];
    foreach (['name','email','password','role'] as $f) {
        if (isset($body[$f])) { $fields[] = "$f = ?"; $values[] = $body[$f]; }
    }
    if ($fields) {
        $values[] = $id;
        $db->prepare('UPDATE users SET ' . implode(', ', $fields) . ' WHERE id = ?')->execute($values);
    }
    $stmt = $db->prepare('SELECT id, name, email, role FROM users WHERE id = ?');
    $stmt->execute([$id]);
    json_response($stmt->fetch());

} elseif ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) json_response(['error' => 'ID verplicht.'], 400);
    $db->prepare('DELETE FROM users WHERE id = ?')->execute([$id]);
    json_response(['success' => true]);

} else {
    json_response(['error' => 'Methode niet toegestaan.'], 405);
}
