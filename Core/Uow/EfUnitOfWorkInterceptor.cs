using Core.DataContext;
using Ninject.Extensions.Interception;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Core.Uow
{
    /// <summary>
    /// This interceptor is used to manage transactions.
    /// </summary>
    public class EfUnitOfWorkInterceptor : IInterceptor
    {
        private readonly IDataContextProvider _dataContextProvider;
        /// <summary>
        /// Creates a new EfUnitOfWorkInterceptor object.
        /// </summary>
        /// <param name="dataContextProvider">The data context provider used to get DbContext.</param>
        public EfUnitOfWorkInterceptor(IDataContextProvider dataContextProvider)
        {
            _dataContextProvider = dataContextProvider;
        }

        /// <summary>
        /// Intercepts a method.
        /// </summary>
        /// <param name="invocation">Method invocation arguments</param>
        public void Intercept(IInvocation invocation)
        {
            //If there is a running transaction, just run the method
            if (EfUnitOfWork.Current != null || !RequiresDbConnection(invocation.Request.Method))
            {
                invocation.Proceed();
                return;
            }

            try
            {                
                EfUnitOfWork.Current = new EfUnitOfWork(_dataContextProvider);
                EfUnitOfWork.Current.BeginTransaction();

                try
                {
                    invocation.Proceed();
                    EfUnitOfWork.Current.Commit();
                }
                catch
                {
                    try
                    {
                        EfUnitOfWork.Current.Rollback();
                    }
                    catch
                    {

                    }

                    throw;
                }
            }
            finally
            {
                EfUnitOfWork.Current = null;
            }
        }

        private static bool RequiresDbConnection(MethodInfo methodInfo)
        {
            if (UnitOfWorkHelper.HasUnitOfWorkAttribute(methodInfo))
            {
                return true;
            }

            if (UnitOfWorkHelper.IsConventionalUowClass(methodInfo.DeclaringType))
            {
                return true;
            }

            return false;
        }
    }
}
