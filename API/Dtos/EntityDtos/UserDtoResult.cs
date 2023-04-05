using Core.Entities.Identity;

namespace API.Dtos.EntityDtos
{
    public class UserDtoResult
    {
        public int Id { get; set; }
        public string DisplayName { get; set; }
        public string RoleName { get; set; }
        public string Email { get; set; }
        public AddressDto Address { get; set; }
    }
}
