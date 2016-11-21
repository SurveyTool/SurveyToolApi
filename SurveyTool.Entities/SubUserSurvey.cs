using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntityFrameworks
{
    public class SubUserSurvey
    {
        [Key]
        public int Id { get; set; }
        [StringLength(10)]
        public string Role { get; set; }
        public int IdUser { get; set; }
        public virtual User User { get; set; }
        public int IdSurvey { get; set; }
        public virtual Survey Survey { get; set; }
    }
}
