using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Services.Jobs.Dtos
{
    public class ActionDto
    {
        public int Id { get; set; }

        public string DisplayName { get; set; }

        public string ClassName { get; set; }
    }
}
