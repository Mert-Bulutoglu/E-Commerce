using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.Identity;
using Core.Entities.OrderAggregate;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Address = Core.Entities.Identity.Address;

namespace Infrastructure.Data
{
    public class StoreContextSeed
    {
          public static async Task SeedAsync(StoreContext context, ILoggerFactory loggerFactory,UserManager<AppUser> userManager,
            RoleManager<AppRole> roleManager)
             {
            try
            {
                if (!context.ProductBrands.Any())
                {
                    var brandsData = File.ReadAllText("../Infrastructure/Data/SeedData/brands.json");
                    var brands = JsonSerializer.Deserialize<List<ProductBrand>>(brandsData);

                    foreach (var item in brands)
                    {
                        context.ProductBrands.Add(item);
                    }

                    await context.SaveChangesAsync();
                }

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
                            LastName = "Bulutoðlu",
                            Street = "Esatpaþa",
                            City = "Istanbul",
                            State = "Ataþehir",
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
                            LastName = "Bulutoðlu",
                            Street = "Esatpaþa",
                            City = "Istanbul",
                            State = "Ataþehir",
                            ZipCode = "34000"
                        }
                    };


                    await userManager.CreateAsync(admin, "Pa$$w0rd");
                    await userManager.AddToRoleAsync(admin, "Admin");


                }

                if (!context.ProductTypes.Any())
                {
                    var typesData = File.ReadAllText("../Infrastructure/Data/SeedData/types.json");

                    var types = JsonSerializer.Deserialize<List<ProductType>>(typesData);

                    foreach (var item in types)
                    {
                        context.ProductTypes.Add(item);
                    }

                    await context.SaveChangesAsync();
                }

                 if (!context.Products.Any())
                {
                    var productsData = File.ReadAllText("../Infrastructure/Data/SeedData/products.json");
                    var products = JsonSerializer.Deserialize<List<Product>>(productsData);

                    foreach (var item in products)
                    {
                        context.Products.Add(item);
                    }

                    await context.SaveChangesAsync();
                }
                
                 if (!context.DeliveryMethods.Any())
                {
                    var dmData = File.ReadAllText("../Infrastructure/Data/SeedData/delivery.json");
                    var methods = JsonSerializer.Deserialize<List<DeliveryMethod>>(dmData);

                    foreach (var item in methods)
                    {
                        context.DeliveryMethods.Add(item);
                    }

                    await context.SaveChangesAsync();
                }


            }
            catch (Exception ex)
            {
                var logger = loggerFactory.CreateLogger<StoreContextSeed>();
                logger.LogError(ex.Message);
            }
        }
    }
}