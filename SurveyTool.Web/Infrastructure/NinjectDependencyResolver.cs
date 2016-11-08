using System;
using System.Collections.Generic;
using System.Web.Mvc;
using System.Linq;
using Ninject;
using Ninject.Web.Common;
using Ninject.Extensions.Conventions;
using DAL;

namespace SurveyTool.Web.Infrastructure
{
    public class NinjectDependencyResolver : IDependencyResolver
    {
        private IKernel kernel;

        public NinjectDependencyResolver(IKernel kernelParam)
        {
            kernel = kernelParam;
            AddBindings();
        }

        public object GetService(Type serviceType)
        {
            return kernel.TryGet(serviceType);
        }

        public IEnumerable<object> GetServices(Type serviceType)
        {
            return kernel.GetAll(serviceType);
        }

        private void AddBindings()
        {
            // put all DI bindings here
            //Bind all interfaces to default implementation classes in Core project
            kernel.Bind<SurveyToolDbContext>().ToSelf().InRequestScope();
            
            kernel.Bind(x => x.FromAssembliesMatching("Core.dll")
                .SelectAllClasses()
                .BindAllInterfaces());

            //Bind all repository and service interfaces to default implementation classes
           
            kernel.Bind(x => x.FromAssembliesMatching("DAL.dll")
                 .SelectAllClasses()
                 .Join
                 .FromAssembliesMatching("ServicesSurveyTool.dll")
                 .SelectAllClasses()
                 .BindAllInterfaces());

            /*
             * ClassService and CourserService have circular link to each other so 
             * we need to use in request scope for them
             */

            //kernel.GetBindings(typeof(IClassService)).Where(binding => !binding.IsConditional)
            //    .ToList().ForEach(binding => kernel.RemoveBinding(binding));

            //kernel.GetBindings(typeof(ICourseService)).Where(binding => !binding.IsConditional)
            //    .ToList().ForEach(binding => kernel.RemoveBinding(binding));

            //kernel.Bind<IClassService>().To<ClassService>().InRequestScope();
            //kernel.Bind<ICourseService>().To<CourseService>().InRequestScope();
        }
    }
}