using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LogNet = log4net;

namespace Core.Runtime.Log
{
    public class SfLogger : ISfLogger
    {
        /// <summary>
        /// Singleton instance.
        /// </summary>
        public static SfLogger Instance { get { return SingletonInstance; } }
        private static readonly SfLogger SingletonInstance = new SfLogger();

        private SfLogger()
        {

        }

        public void LogMessage(string message)
        {
            // get call stack
            StackTrace stackTrace = new StackTrace();

            // get calling method name
            LogNet.ILog _logger = LogNet.LogManager.GetLogger(stackTrace.GetFrame(1).GetMethod().Name);
            _logger.Debug(message);
        }

        public void LogException(Exception ex)
        {
            // get call stack
            StackTrace stackTrace = new StackTrace();

            // get calling method name
            LogNet.ILog _logger = LogNet.LogManager.GetLogger(stackTrace.GetFrame(1).GetMethod().Name);
            _logger.Error(ex.Message, ex);
        }

        public void LogInfo(string information)
        {
            // get call stack
            StackTrace stackTrace = new StackTrace();

            // get calling method name
            LogNet.ILog _logger = LogNet.LogManager.GetLogger(stackTrace.GetFrame(1).GetMethod().Name);
            _logger.Info(information);
        }
    }
}
