using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data
{
    public class DeliveryMethodRepository : GenericRepository<DeliveryMethod>, IDeliveryMethodRepository
    {
        public DeliveryMethodRepository(StoreContext context) : base(context)
        {
        }
    }
}
