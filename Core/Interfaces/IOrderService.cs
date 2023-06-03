using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities.Identity;
using Core.Entities.OrderAggregate;

namespace Core.Interfaces
{
    public interface IOrderService : IGenericRepository<Order>
    {
        Task<Order> CreateOrderAsync(string buyerEmail, int deliveryMethod, string basketId, Entities.OrderAggregate.Address shippingAdress);
        Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail);
        Task<IReadOnlyList<Order>> GetAllOrdersAsync();
        Task<Order> GetOrderByIdAsync(int id, string buyerEmail);
        Task<Order> GetOrderByIdSpecAsync(int id);
        Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync();

    }
}