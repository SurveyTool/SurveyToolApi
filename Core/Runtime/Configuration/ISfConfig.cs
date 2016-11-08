using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Runtime.Configuration
{
    /// <summary>
    /// Defines session information that can be refered across all layers
    /// </summary>
    public interface ISfConfig
    {
        /// <summary>
        /// Save a key value for later reference
        /// </summary>
        void Set(object key, object value);

        /// <summary>
        /// Get stored value by key
        /// </summary>
        object Get(object key);
    }
}
