using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data
{
    public class TypeRepository : GenericRepository<ProductType>, ITypeRepository
    {
        public TypeRepository(StoreContext context) : base(context)
        {
        }
    }
}
