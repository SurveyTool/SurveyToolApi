using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntityFrameworks
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        [StringLength(255)]
        public string FullName { get; set; }
        [StringLength(50)]
        public string UserName { get; set; }
        public bool IsAdmin { get; set; }
        [StringLength(255)]
        public string Password { get; set; }
        public string Email { get; set; }
        public DateTime Birthday { get; set; }
        [StringLength(10)]
        public string Phone { get; set; }
        [StringLength(7)]
        public string Gender { get; set; }
        [StringLength(255)]
        public string Company { get; set; }
        public virtual ICollection<Survey> Surveys { get; set; }

    }
}
