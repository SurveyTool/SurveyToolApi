namespace Core.Entities.Permission
{
    using Core.Entities;
    using Core.Entities.Auditing;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("Permissions")]
    public partial class Permission : AuditableEntity, ISoftDelete
    {
        public Permission()
        {
            this.Roles = new HashSet<Role>();
            this.Operations = new HashSet<Operation>();
        }

        [Required]
        public string PermissionName { get; set; }

        [Column(TypeName = "ntext")]
        public string Description { get; set; }

        public bool IsDeleted { get; set; }

        public virtual ICollection<Role> Roles { get; set; }

        public virtual ICollection<Operation> Operations { get; set; }
    }
}
