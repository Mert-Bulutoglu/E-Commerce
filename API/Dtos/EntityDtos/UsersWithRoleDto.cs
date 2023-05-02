namespace API.Dtos.EntityDtos
{
    public class UsersWithRoleDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public IList<RoleDto> Roles { get; set; }
    }
}
