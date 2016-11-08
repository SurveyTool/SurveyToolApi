using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SurveyTool.Service.Jobs.Dto
{
    public class NewJobDto
    {
        public string Title { get; set; }

        public string Action { get; set; }

        public string Schedule { get; set; }

        public string Description { get; set; }

        public int Status { get; set; }
    }
}
