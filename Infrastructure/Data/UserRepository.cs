using Core.Entities.Identity;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data
{
    public class UserRepository : GenericRepository<AppUser>, IUserRepository
    {
        public UserRepository(StoreContext context) : base(context)
        {
        }

        public async Task<AppUser> GetUserByIdWithRoles(AppUser user)
        {
            return await _context.Users.Include(x => x.UserRoles).FirstOrDefaultAsync(x => x.Id == user.Id);
        }

        public async Task<List<AppUser>> GetUsersWithRole()
        {
            return await _context.Users.Include(u => u.UserRoles)
              .ThenInclude(ur => ur.Role)
              .ToListAsync();
        }
    }
}
