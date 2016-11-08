namespace Core.Entities.Permission
{
    using Core.Entities;
    using Core.Entities.Auditing;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("Roles")]
    public partial class Role : AuditableEntity, ISoftDelete
    {
        public Role()
        {
            this.Permissions = new HashSet<Permission>();
        }

        [Required]
        public string RoleName { get; set; }

        [Column(TypeName = "ntext")]
        public string Description { get; set; }

        public int? ParentRoleId { get; set; }

        public bool IsDeleted { get; set; }

        public virtual ICollection<Permission> Permissions { get; set; }

        public virtual Role ParentRole { get; set; }
        public virtual ICollection<Role> ChildRoles { get; set; }
    }
}
