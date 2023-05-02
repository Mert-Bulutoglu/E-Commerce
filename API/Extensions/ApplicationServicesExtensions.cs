using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Errors;
using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<ITokensService, TokenService>();
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<IPaymentService, PaymentService>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IBasketRepository,BasketRepository>();
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<IMailService, MailService>();
            services.AddScoped(typeof(IGenericRepository<>), (typeof(GenericRepository<>)));
            services.AddScoped<IBrandRepository, BrandRepository>();
            services.AddScoped<ITypeRepository, TypeRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IDeliveryMethodRepository, DeliveryMethodRepository>();

            services.Configure<ApiBehaviorOptions>(options =>
             {
                 options.InvalidModelStateResponseFactory = actionContext =>
                     {
                      var errors = actionContext.ModelState
                       .Where(e => e.Value.Errors.Count > 0)
                       .SelectMany(x => x.Value.Errors)
                       .Select(x => x.ErrorMessage).ToArray();
                      var errorResponse = new ApiValidationErrorResponse
                      {
                          Errors = errors
                      };

                      return new BadRequestObjectResult(errorResponse);
                  };
             });

             return services;

        }
    }
}