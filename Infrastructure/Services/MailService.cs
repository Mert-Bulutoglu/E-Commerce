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
            mail.AppendLine("Merhaba<br>Eğer yeni şifre talebinde bulunduysanız aşağıdaki linkten şifrenizi yenileyebilirsiniz.<br><strong><a target=\"_blank\" href=\"");
            string str = _config["AngularClientUrl"] + "/account/update-password/" + userId + "/" + resetToken;
            mail.AppendLine(str);
            mail.AppendLine("\"Yeni şifre talebi için tıklayınız... </a></strong><br><br><span style=\"font-size:12px;\">Not: Eğer ki bu talep tarafınızca gerçekleştirilmemişse lütfen bu maili ciddiye almayınız.</span><br><br><br> Eat Your Protein");
            
            await SendMailAsync(to, "Şifre Yenileme Talebi", mail.ToString());
            
        }

    }
}