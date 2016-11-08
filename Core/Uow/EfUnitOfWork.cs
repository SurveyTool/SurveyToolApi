using Core.DataContext;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Uow
{
    /// <summary>
    /// Implements Unit of work for Entity Framework.
    /// </summary>
    public class EfUnitOfWork : IUnitOfWork
    {
        [ThreadStatic]
        private static EfUnitOfWork _current;

        /// <summary>
        /// Gets current instance of the EfUnitOfWork.
        /// It gets the right instance that is related to current thread.
        /// </summary>
        public static EfUnitOfWork Current
        {
            get { return _current; }
            set { _current = value; }
        }

        /// <summary>
        /// Gets DbContext object to perform queries.
        /// </summary>
        public IDataContext Context { get; private set; }

        /// <summary>
        /// Reference to the session factory.
        /// </summary>
        private readonly IDataContextProvider _dataContextProvider;

        /// <summary>
        /// Creates a new <see cref="EfUnitOfWork"/>.
        /// </summary>
        /// <param name="dataContextProvider">The data context provider used to get DbContext.</param>
        public EfUnitOfWork(IDataContextProvider dataContextProvider)
        {
            _dataContextProvider = dataContextProvider;
        }

        public void BeginTransaction()
        {
            // Should check if transaction is needed and start transaction
            // Ignore for now
            Context = _dataContextProvider.GetDataContext();
        }

        /// <summary>
        /// Saves all pending changes
        /// </summary>
        /// <returns>The number of objects in an Added, Modified, or Deleted state</returns>
        public int Commit()
        {
            return Context.SaveChanges();
        }

        public void Rollback()
        {

        }
    }
}
