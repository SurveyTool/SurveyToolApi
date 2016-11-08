using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities.Auditing
{
    /// <summary>
    /// An entity can implement this interface if auditing info of this entity must be stored.
    /// <see cref="CreationTime"/>, <see cref="CreatedBy"/>, <see cref="UpdatedDate"/>,
    /// <see cref="UpdatedBy"/> can be automatically set when saving <see cref="Entity"/> to database.
    /// </summary>
    public interface IAuditableEntity
    {
        DateTime? CreatedDate { get; set; }

        string CreatedBy { get; set; }

        DateTime? UpdatedDate { get; set; }

        string UpdatedBy { get; set; }
    }
}
