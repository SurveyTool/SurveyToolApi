using DAL;
using log4net;
using Ninject;
using SurveyTool.Web.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;


namespace SurveyTool.Web.Controllers
{

    public abstract class ControllerBase : Controller
    {
        protected override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            base.OnActionExecuted(filterContext);
            if (filterContext.Exception == null)
            {
                IDependencyResolver resolver = DependencyResolver.Current;
                SurveyToolDbContext dbContext = resolver.GetService<SurveyToolDbContext>();
                dbContext.SaveChanges();
            }
        }
    }
}