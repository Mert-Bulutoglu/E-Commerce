using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Threading.Tasks;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using System.Text;

namespace Infrastructure.Services
{
    public class MailService : IMailService
    {
        private readonly IConfiguration _config;

        public MailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendMailAsync(string to, string subject, string body, bool isBodyHtml = true)
        {
           await SendMailAsync(new[] {to}, subject, body, isBodyHtml);
            
        }

        public async Task SendMailAsync(string[] tos, string subject, string body, bool isBodyHtml = true)
        {
            
            MailMessage mail = new ();
            mail.IsBodyHtml = isBodyHtml;
            foreach (var to in tos)
                    mail.To.Add(to);
            mail.Subject = subject;
            mail.Body = body;
            mail.From = new(_config["Mail:Username"], _config["Mail:Webname"], System.Text.Encoding.UTF8);

            SmtpClient smtp = new();
            smtp.Credentials = new NetworkCredential(_config["Mail:Username"],_config["Mail:Password"]);
            smtp.Port = 587;
            smtp.EnableSsl = true;
            smtp.Host = _config["Mail:Host"];
            await smtp.SendMailAsync(mail);

        }

        public async Task SendPasswordResetMailAsync(string to, string userId, string resetToken)
        {
            StringBuilder mail = new();
            mail.AppendLine("Hello<br>If you have requested a new password, you can renew your password from the link below.</br><br>");
            mail.AppendLine(_config["AngularClientUrl"] + userId + "/" + resetToken);
            mail.AppendLine("<br><br><span style=\"font-size:12px;\">NOTE: If this request has not been fulfilled by you, please do not take this e-mail seriously.</span><br/><br/><br>Kind Regards...<br><br><br>Eat Your Protein<br/><br/><br/><br/>");
            await SendMailAsync(to, "Password Renewal Request", mail.ToString());
            
        }

    }
}