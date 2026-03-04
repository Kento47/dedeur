<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

if ($method === 'GET') {
    $rows = $db->query('SELECT * FROM conversion_submissions ORDER BY timestamp DESC')->fetchAll();
    // Map snake_case terug naar camelCase voor de frontend
    $mapped = array_map(fn($r) => [
        'id'          => $r['id'],
        'date'        => $r['date'],
        'workerName'  => $r['worker_name'],
        'firstName'   => $r['first_name'],
        'lastName'    => $r['last_name'],
        'address'     => $r['address'],
        'phone'       => $r['phone'],
        'whatsapp'    => $r['whatsapp'],
        'neighborhood'=> $r['neighborhood'],
        'pickup'      => (bool)$r['pickup'],
        'contact'     => (bool)$r['contact'],
        'timestamp'   => $r['timestamp'],
    ], $rows);
    json_response($mapped);

} elseif ($method === 'POST') {
    $body = get_body();
    $id = $body['id'] ?? (time() * 1000);
    $db->prepare('INSERT INTO conversion_submissions (id, date, worker_name, first_name, last_name, address, phone, whatsapp, neighborhood, pickup, contact, timestamp) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)')
       ->execute([
           $id,
           $body['date'] ?? date('Y-m-d'),
           $body['workerName'] ?? '',
           $body['firstName'] ?? '',
           $body['lastName'] ?? '',
           $body['address'] ?? '',
           $body['phone'] ?? '',
           $body['whatsapp'] ?? '',
           $body['neighborhood'] ?? '',
           $body['pickup'] ? 1 : 0,
           $body['contact'] ? 1 : 0,
           $body['timestamp'] ?? date('Y-m-d H:i:s'),
       ]);
    json_response(['success' => true, 'id' => $id], 201);

} elseif ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) json_response(['error' => 'ID verplicht.'], 400);
    $db->prepare('DELETE FROM conversion_submissions WHERE id = ?')->execute([$id]);
    json_response(['success' => true]);

} else {
    json_response(['error' => 'Methode niet toegestaan.'], 405);
}
