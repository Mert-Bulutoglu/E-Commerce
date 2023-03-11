using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace Core.Entities.Identity
{
    public class AppIdentityDbContextSeed
    {
        public static async Task SeedUserAsync(UserManager<AppUser> userManager,
            RoleManager<AppRole> roleManager)
        {
            if (!userManager.Users.Any())
            {

                var user = new AppUser
                {
                    DisplayName = "Mert",
                    Email = "mert@gmail.com",
                    UserName = "mert@gmail.com",
                    Address = new Address
                    {
                        FirstName = "Mert",
                        LastName = "Bulutoğlu",
                        Street = "Esatpaşa",
                        City = "Istanbul",
                        State = "Ataşehir",
                        ZipCode = "34000"
                    }
                };

                var roles = new List<AppRole>
                {
                     new AppRole{Name = "User"},
                     new AppRole{Name = "Admin"}
                };

                foreach (var role in roles)
                {
                    await roleManager.CreateAsync(role);
                }

                
                await userManager.CreateAsync(user, "Pa$$w0rd");
                await userManager.AddToRoleAsync(user, "User");

                var admin = new AppUser
                {
                    UserName = "admin",
                    Email = "admin@admin.com",
                    DisplayName = "admin",
                    Address = new Address
                    {
                        FirstName = "admin",
                        LastName = "Bulutoğlu",
                        Street = "Esatpaşa",
                        City = "Istanbul",
                        State = "Ataşehir",
                        ZipCode = "34000"
                    }
                };

               
                await userManager.CreateAsync(admin, "Pa$$w0rd1");
                await userManager.AddToRoleAsync(admin, "Admin");


            }
        }
    }
}