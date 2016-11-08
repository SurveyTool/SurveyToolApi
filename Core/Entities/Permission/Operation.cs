namespace Core.Entities.Permission
{
    using Core.Entities;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("Operations")]
    public partial class Operation : Entity
    {
        public Operation()
        {

        }

        [Required]
        public string Identity { get; set; }

        public string DisplayName { get; set; }

        public string Description { get; set; }

        public int? PermissionId { get; set; }

        public virtual Permission Permission { get; set; }
    }
}
