using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Services.Jobs.Dtos
{
    public class JobDto
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string ClassName { get; set; }

        public string DisplayName { get; set; }

        public string Schedule { get; set; }

        public int Status { get; set; }

        public string Description { get; set; }    
    }
}
