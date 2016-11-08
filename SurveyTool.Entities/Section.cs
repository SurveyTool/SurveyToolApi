using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntityFrameworks
{
    public class Section
    {
        [Key]
        public int Id { get; set; }
        public int NumberSection { get; set; }
        [StringLength(255)]
        public string Title { get; set; }
        [StringLength(500)]
        public string Discription { get; set; }
        public int SurveyId { get; set; }
        [ForeignKey("SurveyId")]
        public virtual Survey Survey { get; set; }
        public virtual ICollection<Question> Questions { get; set; }
    }
}
