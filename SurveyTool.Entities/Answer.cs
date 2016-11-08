using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntityFrameworks
{
    public class Answer
    {
        [Key]
        public int Id { get; set; }
        public int? AnswerNumber { get; set; }
        public int SerialNumber { get; set; }
        [StringLength(500)]
        public string AnswerText { get; set; }
        public bool? AnswerYesNo { get; set; }
        public DateTime? AnswerDate { get; set; }
        public DateTime? AnswerTime { get; set; }
        public int QuestionOptionId { get; set; }
        [ForeignKey("QuestionOptionId")]
        public virtual QuestionOption QuestionOption { get; set; }

    }
}
