<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $body = get_body();
    $email = strtolower(trim($body['email'] ?? ''));
    $password = trim($body['password'] ?? '');

    if (!$email || !$password) {
        json_response(['error' => 'Email en wachtwoord zijn verplicht.'], 400);
    }

    $db = getDB();
    $stmt = $db->prepare('SELECT id, name, email, role FROM users WHERE LOWER(email) = ? AND password = ?');
    $stmt->execute([$email, $password]);
    $user = $stmt->fetch();

    if (!$user) {
        json_response(['error' => 'Ongeldige inloggegevens.'], 401);
    }

    json_response($user);
} else {
    json_response(['error' => 'Methode niet toegestaan.'], 405);
}
