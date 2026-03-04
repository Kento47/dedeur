<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

if ($method === 'GET') {
    $rows = $db->query('SELECT id, name, phone, email, message, timestamp, is_read as `read` FROM contact_messages ORDER BY timestamp DESC')->fetchAll();
    $mapped = array_map(fn($r) => array_merge($r, ['id' => (int)$r['id'], 'read' => (bool)$r['read']]), $rows);
    json_response($mapped);

} elseif ($method === 'POST') {
    $body = get_body();
    $id = $body['id'] ?? (time() * 1000);
    $db->prepare('INSERT INTO contact_messages (id, name, phone, email, message, timestamp, is_read) VALUES (?,?,?,?,?,?,0)')
       ->execute([
           $id,
           $body['name'],
           $body['phone'] ?? '',
           $body['email'] ?? '',
           $body['message'],
           $body['timestamp'] ?? date('Y-m-d H:i:s'),
       ]);
    json_response(['success' => true, 'id' => $id], 201);

} elseif ($method === 'PUT') {
    $body = get_body();
    $id = $body['id'] ?? null;
    if (!$id) json_response(['error' => 'ID verplicht.'], 400);
    $db->prepare('UPDATE contact_messages SET is_read = 1 WHERE id = ?')->execute([$id]);
    json_response(['success' => true]);

} elseif ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) json_response(['error' => 'ID verplicht.'], 400);
    $db->prepare('DELETE FROM contact_messages WHERE id = ?')->execute([$id]);
    json_response(['success' => true]);

} else {
    json_response(['error' => 'Methode niet toegestaan.'], 405);
}
