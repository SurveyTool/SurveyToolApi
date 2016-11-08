
namespace Core.Services.Permission.Dtos
{
    public class PermissionRoleDto
    {
        public int PermissionId { get; set; }
        public int RoleId { get; set; }
        public bool IsAllow { get; set; }
        public bool IsInherited{ get; set; }
        public string InheritedFrom { get; set; }
    }
}
