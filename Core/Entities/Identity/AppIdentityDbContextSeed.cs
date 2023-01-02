using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace Core.Entities.Identity
{
    public class AppIdentityDbContextSeed
    {
        public static async Task SeedUserAsync(UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any())
            {
                var user =new AppUser
                {
                    DisplayName = "Mert",
                    Email = "mert@gmail.com",
                    UserName="mert@gmail.com",
                    Address = new Address
                    {
                        FirstName = "Mert",
                        LastName = "Bulutoğlu",
                        Street = "Esatpaşa",
                        City = "Istanbul",
                        State = "Ataşehir",
                        ZipCode = 34000
                    }
                };


                await userManager.CreateAsync(user, "Pa$$w0rd");
            }
        }
    }
}