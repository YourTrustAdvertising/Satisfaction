<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Загружаем конфигурацию
$config = require_once 'config.php';
$telegram_token = $config['telegram_token'];
$telegram_chat_id = $config['telegram_chat_id'];

// Получаем данные формы
$name = trim($_POST['name'] ?? '');
$telegram = trim($_POST['telegram'] ?? '');
$email = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');

// Валидация данных
if (empty($name) || empty($message)) {
    echo json_encode([
        'success' => false, 
        'message' => 'Пожалуйста, заполните имя и сообщение'
    ]);
    exit;
}

// Проверяем наличие хотя бы одного контакта
if (empty($telegram) && empty($email)) {
    echo json_encode([
        'success' => false, 
        'message' => 'Укажите хотя бы один способ связи: Telegram или Email'
    ]);
    exit;
}

// Формируем сообщение для Telegram
$text = "🔥 Новая заявка с сайта!\n\n";
$text .= "👤 Имя: " . htmlspecialchars($name) . "\n";
if (!empty($telegram)) {
    // Добавляем @ если его нет
    if (!str_starts_with($telegram, '@')) {
        $telegram = '@' . $telegram;
    }
    $text .= "📱 Telegram: " . htmlspecialchars($telegram) . "\n";
}
if (!empty($email)) {
    $text .= "📧 Email: " . htmlspecialchars($email) . "\n";
}
$text .= "💬 Сообщение:\n" . htmlspecialchars($message);

// Отправляем в Telegram
$url = "https://api.telegram.org/bot{$telegram_token}/sendMessage";
$data = [
    'chat_id' => $telegram_chat_id,
    'text' => $text,
    'parse_mode' => 'HTML'
];

$options = [
    'http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
        'content' => http_build_query($data)
    ]
];

$context = stream_context_create($options);
$response = file_get_contents($url, false, $context);

if ($response === FALSE) {
    $error = error_get_last();
    echo json_encode([
        'success' => false,
        'message' => 'Ошибка отправки: ' . ($error['message'] ?? 'Неизвестная ошибка')
    ]);
    exit;
}

$result = json_decode($response, true);
if (!$result['ok']) {
    echo json_encode([
        'success' => false,
        'message' => 'Ошибка Telegram: ' . ($result['description'] ?? 'Неизвестная ошибка')
    ]);
    exit;
}

echo json_encode([
    'success' => true,
    'message' => 'Спасибо! Ваша заявка успешно отправлена.'
]);
?>