<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require __DIR__ . '/../config.php';
require __DIR__ . '/PHPMailer/Exception.php';
require __DIR__ . '/PHPMailer/PHPMailer.php';
require __DIR__ . '/PHPMailer/SMTP.php';

/**
 * Sends an enquiry email via PHPMailer using SMTP settings from config.php
 */
function sendContactEmail($name, $phone, $projectType, $budget, $location, $plotSize)
{
    $mail = new PHPMailer(true);

    $mail->isSMTP();
    $mail->Host       = SMTP_HOST;
    $mail->SMTPAuth   = SMTP_AUTH;
    $mail->Username   = SMTP_USERNAME;
    $mail->Password   = SMTP_PASSWORD;
    $mail->SMTPSecure = (SMTP_SECURE == 'tls') ? PHPMailer::ENCRYPTION_STARTTLS : PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = SMTP_PORT;

    $mail->setFrom(SMTP_USERNAME, 'Square ft Group Contact Form');
    $mail->addAddress(CONTACT_RECIPIENT_EMAIL, CONTACT_RECIPIENT_NAME);

    $mail->isHTML(false);
    $mail->Subject = "New Project Enquiry from Square ft Group Website: $name";
    $mail->Body    = "Name: $name\nPhone: $phone\nProject Type: $projectType\nBudget: $budget\nProject Location: $location\nPlot Size: $plotSize";

    $mail->send();
}
?>
