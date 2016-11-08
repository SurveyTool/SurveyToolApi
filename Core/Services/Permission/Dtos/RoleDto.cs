
namespace Core.Services.Permission.Dtos
{
    public class RoleDto
    {
        public int Id { get; set; }
        public string RoleName { get; set; }
        public string Description { get; set; }
        public int? ParentRoleId { get; set; }
        public string ParentRoleName { get; set; }
        public int Level { get; set; }
    }
}
