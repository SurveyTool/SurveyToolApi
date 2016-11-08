namespace Core.Entities.Job
{
    using Core.Entities;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("Jobs")]
    public partial class Job : Entity
    {
        public Job()
        {
        }

        [Column(TypeName = "ntext")]
        public string Title { get; set; }

        [Column(TypeName = "ntext")]
        public string Description { get; set; }

        public string ClassName { get; set; }

        public string DisplayName { get; set; }

        public string Schedule { get; set; }

        public JobStatus Status { get; set; }
    }

    public enum JobStatus
    {
        DISABLED = 0,
        ENABLED = 1,
    }
}
