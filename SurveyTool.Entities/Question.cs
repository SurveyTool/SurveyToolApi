using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntityFrameworks
{
    public class Question
    {
        [Key]
        public int Id { get; set; }
        public int NumberQuestion { get; set; }
        [StringLength(255)]
        public string Contents { get; set; }
        public bool IsRequired { get; set; }
        public bool IsMultiChoice { get; set; }
        public int QuestionTypeId { get; set; }
        [ForeignKey("QuestionTypeId")]
        public virtual QuestionType QuestionType { get; set; }
        public virtual ICollection<QuestionOption> QuestionOptions { get; set; }
        public int SectionId { get; set; }
        [ForeignKey("SectionId")]
        public virtual Section Section { get; set; }
    }
}
