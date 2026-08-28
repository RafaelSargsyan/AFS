<?php
header('Content-Type: application/json; charset=utf-8');

error_reporting(E_ALL);
ini_set('display_errors', 0);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/phpmailer/Exception.php';
require_once __DIR__ . '/phpmailer/PHPMailer.php';
require_once __DIR__ . '/phpmailer/SMTP.php';

// Only allow POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "status" => "error",
        "message" => "Invalid request method"
    ]);
    exit;
}

// Helper clean function
function clean($value) {
    return trim((string)$value);
}

// Get form data
$name    = clean($_POST["name"] ?? "");
$email   = clean($_POST["email"] ?? "");
$phone   = clean($_POST["phone"] ?? "");
$company = clean($_POST["company"] ?? "");
$subject = clean($_POST["subject"] ?? "");
$message = clean($_POST["message"] ?? "");

// Validate required fields
$missing = [];

if (!$name) $missing[] = "name";
if (!$email) $missing[] = "email";
if (!$message) $missing[] = "message";
if (!$subject) $missing[] = "subject";

if ($missing) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Missing fields: " . implode(", ", $missing)
    ]);
    exit;
}

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Invalid email address"
    ]);
    exit;
}

// Allowed subjects (STRICT)
$recipients = [
    "Supplier" => "info@foodservice.am",
    "Business" => "info@foodservice.am",
    "Feedback" => "Feedback@foodservice.am",
    "Other"    => "info@foodservice.am"
];

$allowedSubjects = array_keys($recipients);

if (!in_array($subject, $allowedSubjects, true)) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Invalid subject"
    ]);
    exit;
}

$to = $recipients[$subject];

try {
    $mail = new PHPMailer(true);

    // SMTP config
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'design.alphafood@gmail.com';
    $mail->Password   = 'jcassigzekwijgnl';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';

    // Email setup
    $mail->setFrom('design.alphafood@gmail.com', 'Food Service Website');
    $mail->addAddress($to);
    $mail->addReplyTo($email, $name);

    $mail->isHTML(false);
    $mail->Subject = "New Contact Form: " . $subject;

    // Body
    $body  = "Name: $name\n";
    $body .= "Email: $email\n";
    $body .= "Phone: " . ($phone ?: "Not provided") . "\n";
    $body .= "Company: " . ($company ?: "Not provided") . "\n\n";
    $body .= "Subject: $subject\n\n";
    $body .= "Message:\n$message\n\n";
    $body .= "Sent from: " . ($_SERVER['HTTP_REFERER'] ?? 'Website') . "\n";
    $body .= "Time: " . date('Y-m-d H:i:s');

    $mail->Body = $body;

    if ($mail->send()) {
        echo json_encode([
            "status" => "success",
            "message" => "Message sent successfully!"
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Failed to send message"
        ]);
    }

} catch (Exception $e) {
    error_log("Mail Error: " . $e->getMessage());

    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Server error. Please try again later."
    ]);
}