using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class UpdatePasswordCommandDto
    {
        public string UserId { get; set; }
        public string ResetToken { get; set; }
        public string Password { get; set; }
        public string PasswordConfirm { get; set; }
    }
}