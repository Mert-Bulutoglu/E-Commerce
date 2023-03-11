using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IMailService
    {
        Task SendMessageAsync(string to, string subject, string body, bool isBodyHtml = true);
        Task SendMessageAsync(string[] tos, string subject, string body, bool isBodyHtml = true);
    }
}