<?php
header('Content-Type: application/json');
require 'includes/mail-helper.php';

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "There was a problem with your submission."]);
    exit;
}

// reCAPTCHA v3 verification
$recaptchaSecret   = "6LegmvcsAAAAALlPUhBTOqJNZg-J_rPfi2ZLdnhd";
$recaptchaResponse = $_POST['g-recaptcha-response'] ?? '';

if (empty($recaptchaResponse)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Security verification failed."]);
    exit;
}

$verifyResponse = file_get_contents('https://www.google.com/recaptcha/api/siteverify?secret=' . $recaptchaSecret . '&response=' . $recaptchaResponse);
$responseData   = json_decode($verifyResponse);

if (!$responseData->success || $responseData->score < 0.5) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Security check failed. Please try again."]);
    exit;
}

// Collect and sanitize input
$name        = strip_tags(trim($_POST["name"] ?? ''));
$name        = str_replace(["\r", "\n"], [" ", " "], $name);
$phone       = strip_tags(trim($_POST["phone"] ?? ''));
$projectType = strip_tags(trim($_POST["project_type"] ?? ''));
$budget      = strip_tags(trim($_POST["budget"] ?? ''));
$location    = strip_tags(trim($_POST["location"] ?? ''));
$plotSize    = strip_tags(trim($_POST["plot_size"] ?? ''));

// Validate required fields
if (empty($name) || empty($phone)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Please provide your name and phone number."]);
    exit;
}

// Send email
try {
    sendContactEmail($name, $phone, $projectType, $budget, $location, $plotSize);
    echo json_encode(["status" => "success", "message" => "Thank you! We'll get back to you within 24 hours."]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Message could not be sent. Please try again later."]);
}
?>
