using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.DataContext
{
    public interface IDataContextProvider
    {
        /// <summary>
        /// Return a derived DbContext for accessing database.
        /// </summary>
        IDataContext GetDataContext();
    }
}
