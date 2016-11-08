using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LogNet = log4net;

namespace Core.Runtime.Log
{
    /// <summary>
    /// Defines logging utility that can be refered across all layers
    /// </summary>
    public interface ISfLogger
    {
        /// <summary>
        /// Log a message (Type: MESSAGE)
        /// </summary>
        void LogMessage(string message);

        /// <summary>
        /// Log an exception (Type: ERROR)
        /// </summary>
        void LogException(Exception ex);

        /// <summary>
        /// Log an information (Type: INFO)
        /// </summary>
        void LogInfo(string information);
    }
}
