using Core.Entities.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IUserRepository: IGenericRepository<AppUser>
    {
        Task<List<AppUser>> GetUsersWithRole();
        Task<AppUser> GetUserByIdWithRoles(AppUser user);

    }
}
