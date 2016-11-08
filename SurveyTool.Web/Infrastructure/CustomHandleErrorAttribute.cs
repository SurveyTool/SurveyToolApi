using Core.Runtime.Log;
using System;
using System.Web;
using System.Web.Mvc;

namespace SurveyTool.Web.Infrastructure
{
    public class CustomHandleErrorAttribute : HandleErrorAttribute
    {
        public CustomHandleErrorAttribute()
        {

        }

        public override void OnException(ExceptionContext filterContext)
        {
            if (filterContext.ExceptionHandled || !filterContext.HttpContext.IsCustomErrorEnabled)
            {
                return;
            }

            if (new HttpException(null, filterContext.Exception).GetHttpCode() != 500)
            {
                return;
            }

            if (!ExceptionType.IsInstanceOfType(filterContext.Exception))
            {
                return;
            }

            //Determine the return type of the action
            var controllerName = (string)filterContext.RouteData.Values["controller"];
            var actionName = (string)filterContext.RouteData.Values["action"];
            Type controllerType = filterContext.Controller.GetType();
            var method = controllerType.GetMethod(actionName);
            var returnType = method.ReturnType;

            //If the action that generated the exception returns JSON
            if (returnType.Equals(typeof(JsonResult)))
            {
                filterContext.Result = new JsonResult()
                {
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                    Data = new
                    {
                        success = false,
                        message = filterContext.Exception.Message,
                        data = "",
                    }
                };
            }
            else
            {
                
                var model = new HandleErrorInfo(filterContext.Exception, controllerName, actionName);

                filterContext.Result = new ViewResult
                {
                    ViewName = "Error/Index.cshtml",
                    MasterName = Master,
                    ViewData = new ViewDataDictionary<HandleErrorInfo>(model),
                    TempData = filterContext.Controller.TempData
                };
            }

            SfLogger.Instance.LogException(filterContext.Exception);

            filterContext.ExceptionHandled = true;
            filterContext.HttpContext.Response.Clear();
            filterContext.HttpContext.Response.StatusCode = 500;

            filterContext.HttpContext.Response.TrySkipIisCustomErrors = true;
        }
    }
}