using Quartz;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.JobScheduling
{
    public interface ISfJob : IJob
    {
        string DisplayName { get; }
    }
}
