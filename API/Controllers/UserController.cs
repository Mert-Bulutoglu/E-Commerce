using API.Dtos;
using API.Dtos.EntityDtos;
using AutoMapper;
using Core.Entities;
using Core.Entities.Identity;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserDto = API.Dtos.UserDto;

namespace API.Controllers
{
    public class UserController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<AppRole> _roleManager;
        private readonly IUnitOfWork _unitOfWork;

        public UserController(IUserRepository userRepository, IMapper mapper, UserManager<AppUser> userManager, RoleManager<AppRole> roleManager, IUnitOfWork unitOfWork)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _userManager = userManager;
            _roleManager = roleManager;
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<ActionResult<List<UserDtoResult>>> GetUsers()
        {
            var users = await _userManager.Users.Include(c => c.Address).ToListAsync();
            var userDtoResults = _mapper.Map<List<UserDtoResult>>(users);
            foreach (var userDtoResult in userDtoResults)
            {
                var user = await _userManager.FindByIdAsync(userDtoResult.Id.ToString());
                var roles = await _userManager.GetRolesAsync(user);
                userDtoResult.RoleName = roles.FirstOrDefault();
            }
            return Ok(userDtoResults);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDtoResult>> GetUser(int id)
        {
            var user = await _userManager.Users.Include(u => u.Address).FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
            {
                return NotFound();
            }

            var userRole = await _userManager.GetRolesAsync(user);
            var address = user.Address != null ? new AddressDto
            {
                FirstName = user.Address.FirstName,
                LastName = user.Address.LastName,
                Street = user.Address.Street,
                City = user.Address.City,
                State = user.Address.State,
                ZipCode = user.Address.ZipCode
            } : null;

            var userDtoResult = _mapper.Map<UserDtoResult>(user);
            userDtoResult.RoleName = userRole.FirstOrDefault();
            userDtoResult.Address = address;

            return Ok(userDtoResult);
        }

        [HttpPost]
        public async Task<ActionResult> Save(AddUserDto userDto)
        {
            var userExists = await _userManager.FindByEmailAsync(userDto.Email);
            if (userExists != null)
            {
                return NotFound();
            }

            var user = new AppUser
            {
                DisplayName = userDto.Name,
                UserName = userDto.Name,
                Email = userDto.Email,
            };

            if (!await _roleManager.RoleExistsAsync(userDto.RoleName))
            {
                return NotFound();
            }

            var result = await _userManager.CreateAsync(user, userDto.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result);
            }

            if (userDto.RoleName == "User")
            {
                await _userManager.AddToRoleAsync(user, "User");
            }
            else
            {
                await _userManager.AddToRoleAsync(user, "Admin");
            }

            await _unitOfWork.Complete();

            var createdUser = new UserDtoResult
            {
                DisplayName = user.UserName,
                RoleName = userDto.RoleName,
                Email = user.Email,
                Id = user.Id
            };

            return Ok(createdUser);

        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(UpdateUserDto userDto)
        {
            var user = await _userRepository.GetByIdAsync(userDto.Id);

            if (user == null)
            {
                return NotFound(user);
            }

            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                return BadRequest(result);
            }

            var userRole = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRoleAsync(user, userRole[0]);
            await _unitOfWork.Complete();

            if (!await _roleManager.RoleExistsAsync(userDto.RoleName))
            {
                return NotFound();
            }

            if (userDto.RoleName == "User")
            {
                await _userManager.AddToRoleAsync(user, "User");
            }
            else
            {
                await _userManager.AddToRoleAsync(user, "Admin");
            }
            await _unitOfWork.Complete();

            var updatedUser = new UserDtoResult
            {
                DisplayName = user.UserName,
                RoleName = userDto.RoleName,
                Email = user.Email,
                Id = user.Id
            };

            return Ok(updatedUser);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var databaseType = await _userRepository.GetByIdAsync(id);
            if (databaseType == null)
            {
                return NotFound();
            }
            _userRepository.Delete(databaseType);
            await _unitOfWork.Complete();
            return Ok();
        }
    }
}
