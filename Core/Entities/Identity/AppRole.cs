using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace Core.Entities.Identity
{
    public class AppRole : IdentityRole<int>
    {
        public override string Name { get; set; }
        public ICollection<AppUserRole> UserRoles { get; set; }
    }
}