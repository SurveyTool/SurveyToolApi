using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Uow
{
    /// <summary>
    /// Represents a transactional job.
    /// </summary>
    public interface IUnitOfWork
    {
        /// <summary>
        /// Opens database connection and begins transaction.
        /// </summary>
        void BeginTransaction();

        /// <summary>
        /// Commits transaction and closes database connection.
        /// </summary>
        int Commit();

        /// <summary>
        /// Rollbacks transaction and closes database connection.
        /// </summary>
        void Rollback();
    }
}
