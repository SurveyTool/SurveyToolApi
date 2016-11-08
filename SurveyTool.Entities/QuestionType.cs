using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntityFrameworks
{
    public class QuestionType
    {
        [Key]
        public int Id { get; set; }
        [StringLength(255)]
        public string NameTypeQuestion { get; set; }
        public virtual ICollection<Question> Questions { get; set; }
    }
}
