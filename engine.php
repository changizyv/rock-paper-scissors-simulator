<?php
header('Content-Type: application/json');

// حالت ریست بازی و ارسال مقدار اولیه عناصر
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $elementCount = isset($input['count']) ? intval($input['count']) : 30;

    // ایجاد آرایه اولیه از عناصر
    $elements = [];
    for ($i = 0; $i < $elementCount; $i++) {
        $elements[] = 'rock';
        $elements[] = 'paper';
        $elements[] = 'scissors';
    }

    // شافل
    shuffle($elements);

    echo json_encode([
        'status' => 'ok',
        'elements' => $elements,
        'countEach' => $elementCount
    ]);
    exit;
}

echo json_encode(['status' => 'invalid_request']);
exit;
