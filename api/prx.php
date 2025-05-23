<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if (!isset($_GET['url'])) {
  http_response_code(400);
  echo json_encode(['error' => 'Missing url parameter']);
  exit;
}

$url = $_GET['url'];
$ch = curl_init($url);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // bypass cert errors if needed

$data = curl_exec($ch);

if (curl_errno($ch)) {
  http_response_code(500);
  echo json_encode(['error' => curl_error($ch)]);
  exit;
}

echo json_encode(['contents' => json_decode($data, true)]);
