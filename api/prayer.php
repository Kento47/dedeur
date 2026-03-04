<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

if ($method === 'GET') {
    $rows = $db->query('SELECT * FROM prayer_submissions ORDER BY timestamp DESC')->fetchAll();
    json_response($rows);

} elseif ($method === 'POST') {
    $body = get_body();
    $id = $body['id'] ?? (time() * 1000);
    $db->prepare('INSERT INTO prayer_submissions (id, type, name, phone, note, timestamp) VALUES (?,?,?,?,?,?)')
       ->execute([$id, $body['type'], $body['name'], $body['phone'], $body['note'], $body['timestamp'] ?? date('Y-m-d H:i:s')]);
    json_response(['success' => true, 'id' => $id], 201);

} elseif ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) json_response(['error' => 'ID verplicht.'], 400);
    $db->prepare('DELETE FROM prayer_submissions WHERE id = ?')->execute([$id]);
    json_response(['success' => true]);

} else {
    json_response(['error' => 'Methode niet toegestaan.'], 405);
}
