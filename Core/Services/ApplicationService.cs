using Castle.Core.Logging;
//using Castle.Core.Logging;
using Ninject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Services
{
    /// <summary>
    /// This class can be used as a base class for application services. 
    /// </summary>
    public abstract class ApplicationService : IApplicationService
    {
        //[Inject]
        /// <summary>
        /// Reference to the logger to write logs.
        /// </summary>
        //public ILogger Logger { protected get; set; }

        /// <summary>
        /// Constructor.
        /// </summary>
        protected ApplicationService()
        {
            //Logger = NullLogger.Instance;
        }
    }
}
