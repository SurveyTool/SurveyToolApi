using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntityFrameworks
{
    public class Survey
    {
        [Key]
        public int Id { get; set; }
        [StringLength(255)]
        public string Title { get; set; }
        [StringLength(500)]
        public string Discription { get; set; }
        [StringLength(500)]
        public string EndPage { get; set; }
        public DateTime DateStart { get; set; }
        public DateTime Deadline { get; set; }
        public bool AllowAddAnother { get; set; }
        public int LimitNumber { get; set; }
       
        public virtual ICollection<Section> Sections { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<SubUserSurvey> SubUserSurveys { get; set; }

    }
}
