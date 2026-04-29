<?php
header('Content-Type: application/json');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require './phpmailer/Exception.php';
require './phpmailer/PHPMailer.php';
require './phpmailer/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Invalid request"]);
    exit;
}

// Get and sanitize form data
$subject = trim($_POST["subject"] ?? "");
$message = trim($_POST["message"] ?? "");
$name    = trim($_POST["name"] ?? "");
$email   = trim($_POST["email"] ?? "");
$phone   = trim($_POST["phone"] ?? "");
$company = trim($_POST["company"] ?? "");

// ==================== ROUTING LOGIC ====================
// Change these emails to your actual work Outlook addresses
$recipients = [
    "Supplier"   => "diyano7342@poisonword.com",
    "Business"   => "nu4skus9oq@yzcalo.com",
    "Feedback"   => "5fo9x@deltajohnsons.com",  
    "Other"      => "lafyutagni@necub.com"
];

$to = $recipients[$subject] ?? "info@foodservice.am";   // fallback

// Validation
if (empty($subject) || empty($message) || empty($name) || empty($email)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Please fill all required fields."]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid email address."]);
    exit;
}

try {
    $mail = new PHPMailer(true);

    // ==================== GMAIL SMTP (Recommended & Stable) ====================
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'design.alphafood@gmail.com';
    $mail->Password   = 'jcassigzekwijgnl';           
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    // ==================== EMAIL SETTINGS ====================
    $mail->setFrom('design.alphafood@gmail.com', 'Alpha Food Service Website');
    $mail->addAddress($to);                    // Department email (changes based on subject)
    $mail->addReplyTo($email, $name);

    // Optional: Also send a copy to yourself
    // $mail->addCC('sargsyan.rafael97@outlook.com');

    $mail->isHTML(false);
    $mail->Subject = "New Contact Form: " . $subject;

    $body = "New message from Alpha Food Service website:\n\n";
    $body .= "Name: " . $name . "\n";
    $body .= "Email: " . $email . "\n";
    $body .= "Phone: " . ($phone ?: "Not provided") . "\n";
    $body .= "Company: " . ($company ?: "Not provided") . "\n\n";
    $body .= "Subject: " . $subject . "\n\n";
    $body .= "Message:\n" . $message . "\n\n";
    $body .= "_________________________________\n";
    $body .= "Sent from: " . ($_SERVER['HTTP_REFERER'] ?? 'Website');

    $mail->Body = $body;

    if ($mail->send()) {
        echo json_encode(["status" => "success", "message" => "Message sent successfully ✅"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Mailer Error: " . $mail->ErrorInfo]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Message could not be sent. Please try again later."]);
}
?>