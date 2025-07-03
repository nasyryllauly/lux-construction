<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Telegram Bot настройки
$botToken = '7663496694:AAGgiCtObnpNgwQ_nU_26EsCQJ_7arJ2fkU';
$chatId = '@luxconstructionleads'; // ID группы

// Получаем данные из формы
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

$name = htmlspecialchars($input['name'] ?? '');
$phone = htmlspecialchars($input['phone'] ?? '');
$email = htmlspecialchars($input['email'] ?? '');
$message = htmlspecialchars($input['message'] ?? '');

if (empty($name) || empty($phone)) {
    http_response_code(400);
    echo json_encode(['error' => 'Имя и телефон обязательны']);
    exit;
}

// Формируем сообщение для Telegram
$telegramMessage = "🏗️ <b>Новая заявка с сайта LUX Construction</b>\n\n";
$telegramMessage .= "👤 <b>Имя:</b> {$name}\n";
$telegramMessage .= "📞 <b>Телефон:</b> {$phone}\n";

if (!empty($email)) {
    $telegramMessage .= "📧 <b>Email:</b> {$email}\n";
}

if (!empty($message)) {
    $telegramMessage .= "💬 <b>Сообщение:</b>\n{$message}\n";
}

$telegramMessage .= "\n⏰ <b>Время:</b> " . date('d.m.Y H:i:s');
$telegramMessage .= "\n🌐 <b>Источник:</b> luxconstruction.kz";

// Отправляем сообщение в Telegram
$telegramUrl = "https://api.telegram.org/bot{$botToken}/sendMessage";

$postData = [
    'chat_id' => $chatId,
    'text' => $telegramMessage,
    'parse_mode' => 'HTML'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $telegramUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    echo json_encode(['success' => true, 'message' => 'Заявка успешно отправлена']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка отправки сообщения', 'details' => $response]);
}
?>

