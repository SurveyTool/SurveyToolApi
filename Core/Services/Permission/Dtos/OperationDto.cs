
namespace Core.Services.Permission.Dtos
{
    public class OperationDto
    {
        public int Id { get; set; }
        public string Identity { get; set; }
        public string DisplayName { get; set; }
        public string Description { get; set; }
        public int? PermissionId { get; set; }
    }
}
