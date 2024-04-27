using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace WorkManagement.Controllers.ControllerUtils;

public class EmailGenerators
{
    // Method to send the verification email
    public static async Task SendVerificationEmailAsync(string userEmail, string verificationToken)
    {
        try
        {
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress("TCE DMDR", "insomniadevs007@gmail.com"));
            emailMessage.To.Add(new MailboxAddress("", userEmail)); // User's email
            emailMessage.Subject = "Verify Your Email";

            // Create the email body
            var bodyBuilder = new BodyBuilder();
            bodyBuilder.HtmlBody = $@"
                    <p>Thank you for registering! Please click the link below to verify your email:</p>
                    <a href='https://localhost:44487/verify?token={verificationToken}'>Verify Email</a>";

            emailMessage.Body = bodyBuilder.ToMessageBody();

            using (var client = new SmtpClient())
            {
                client.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
                client.Authenticate("insomniadevs007@gmail.com", "lzhyecgavxzkcgvg");
                client.Send(emailMessage);
            }
        }
        catch (Exception ex)
        {
            // Handle any exceptions (e.g., log or notify admin)
            Console.WriteLine($"Error sending email: {ex.Message}");
        }
    }
}