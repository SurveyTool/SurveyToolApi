using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntityFrameworks
{
    public class OptionChoice
    {
        [Key]
        public int Id { get; set; }
        [StringLength(255)]
        public string Contents { get; set; }
        public int MinimumOflinearScale { get; set; }
        public int MaximumOflinearScale { get; set; }
        public int ChoiceValueOflinearScale { get; set; }
        public virtual ICollection<QuestionOption> QuestionOptions { get; set; }
    }
}
