<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

if ($method === 'GET') {
    $rows = $db->query('SELECT id, date, service_type as serviceType, men, women, children, new_visitors as newVisitors, total, notes FROM visitor_logs ORDER BY date DESC')->fetchAll();
    $mapped = array_map(function($r) {
        return array_merge($r, [
            'id'          => (int)$r['id'],
            'men'         => (int)$r['men'],
            'women'       => (int)$r['women'],
            'children'    => (int)$r['children'],
            'newVisitors' => (int)$r['newVisitors'],
            'total'       => (int)$r['total'],
        ]);
    }, $rows);
    json_response($mapped);

} elseif ($method === 'POST') {
    $body = get_body();
    $id = $body['id'] ?? (time() * 1000);
    $total = ($body['men'] ?? 0) + ($body['women'] ?? 0) + ($body['children'] ?? 0);
    $db->prepare('INSERT INTO visitor_logs (id, date, service_type, men, women, children, new_visitors, total, notes) VALUES (?,?,?,?,?,?,?,?,?)')
       ->execute([
           $id,
           $body['date'],
           $body['serviceType'],
           $body['men'] ?? 0,
           $body['women'] ?? 0,
           $body['children'] ?? 0,
           $body['newVisitors'] ?? 0,
           $total,
           $body['notes'] ?? '',
       ]);
    json_response(['success' => true, 'id' => $id, 'total' => $total], 201);

} elseif ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) json_response(['error' => 'ID verplicht.'], 400);
    $db->prepare('DELETE FROM visitor_logs WHERE id = ?')->execute([$id]);
    json_response(['success' => true]);

} else {
    json_response(['error' => 'Methode niet toegestaan.'], 405);
}
