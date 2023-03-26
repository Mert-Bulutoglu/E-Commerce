using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class VerifyResetTokenDto
    {
        public string ResetToken { get; set; }
        public string UserId { get; set; }
    }
}