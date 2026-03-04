<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

if ($method === 'GET') {
    $row = $db->query('SELECT settings_json FROM app_settings WHERE id = 1')->fetch();
    if (!$row) {
        json_response(null);
    }
    json_response(json_decode($row['settings_json'], true));

} elseif ($method === 'POST' || $method === 'PUT') {
    $body = get_body();
    $json = json_encode($body);
    $existing = $db->query('SELECT id FROM app_settings WHERE id = 1')->fetch();
    if ($existing) {
        $db->prepare('UPDATE app_settings SET settings_json = ? WHERE id = 1')->execute([$json]);
    } else {
        $db->prepare('INSERT INTO app_settings (id, settings_json) VALUES (1, ?)')->execute([$json]);
    }
    json_response(['success' => true]);

} else {
    json_response(['error' => 'Methode niet toegestaan.'], 405);
}
