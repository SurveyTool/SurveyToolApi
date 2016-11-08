using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntityFrameworks
{
    public class QuestionOption
    {
        [Key]
        public int Id { get; set; }
        public int QuestionId { get; set; }
        [ForeignKey("QuestionId")]
        public virtual Question Question { get; set; }
        public int? OptionChoiceId { get; set; }
        [ForeignKey("OptionChoiceId")]
        public virtual OptionChoice OptionChoice { get; set; }
        public virtual ICollection<Answer> Answers { get; set; }
    }
}
