<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

if ($method === 'GET') {
    $rows = $db->query('SELECT id, name, phone, preferred_date as preferredDate, reason, status, date FROM appointments ORDER BY date DESC')->fetchAll();
    $mapped = array_map(fn($r) => array_merge($r, ['id' => (int)$r['id']]), $rows);
    json_response($mapped);

} elseif ($method === 'POST') {
    $body = get_body();
    $id = $body['id'] ?? (time() * 1000);
    $db->prepare('INSERT INTO appointments (id, name, phone, preferred_date, reason, status, date) VALUES (?,?,?,?,?,?,?)')
       ->execute([
           $id,
           $body['name'],
           $body['phone'],
           $body['preferredDate'],
           $body['reason'],
           $body['status'] ?? 'new',
           $body['date'] ?? date('Y-m-d H:i:s'),
       ]);
    json_response(['success' => true, 'id' => $id], 201);

} elseif ($method === 'PUT') {
    $body = get_body();
    $id = $body['id'] ?? null;
    if (!$id) json_response(['error' => 'ID verplicht.'], 400);
    $db->prepare('UPDATE appointments SET status = ? WHERE id = ?')->execute([$body['status'], $id]);
    json_response(['success' => true]);

} elseif ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) json_response(['error' => 'ID verplicht.'], 400);
    $db->prepare('DELETE FROM appointments WHERE id = ?')->execute([$id]);
    json_response(['success' => true]);

} else {
    json_response(['error' => 'Methode niet toegestaan.'], 405);
}
