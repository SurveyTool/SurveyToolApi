using Core.Runtime.Session;
using EntityFrameworks;
using log4net;
using Newtonsoft.Json;
using SurveyTool.Web.Infrastructure.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Web.Security;

namespace SurveyTool
{
    public class MvcApplication : System.Web.HttpApplication
    {
        private readonly ILog _logger = log4net.LogManager.GetLogger(
                System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }


        protected void Application_PostAuthenticateRequest(Object sender, EventArgs e)
        {
            HttpCookie ck = Request.Cookies[FormsAuthentication.FormsCookieName];
            if (ck != null && !String.IsNullOrEmpty(ck.Value))
            {
                FormsAuthenticationTicket fat = FormsAuthentication.Decrypt(ck.Value);
                User user = JsonConvert.DeserializeObject<User>(fat.UserData);
                WebPrincipal webPrincipal = new WebPrincipal(user.UserName);
                webPrincipal.User = user;
                HttpContext.Current.User = webPrincipal;
                SfSession.Instance.UserId = user.UserName;
                SfSession.Instance.Set("User", user);
                SfSession.Instance.Set("Username", user.UserName);
            }
        }

        protected void Application_BeginRequest()
        {
            HttpRequestBase request = new HttpRequestWrapper(Context.Request);
            // turn off auto redirect of form authentication
            Context.Response.SuppressFormsAuthenticationRedirect = true;
        }

        //protected void Application_Error(object sender, EventArgs e)
        //{
        //    var httpContext = ((MvcApplication)sender).Context;

        //    var currentRouteData = RouteTable.Routes.GetRouteData(new HttpContextWrapper(httpContext));
        //    var currentController = " ";
        //    var currentAction = " ";

        //    if (currentRouteData != null)
        //    {
        //        if (currentRouteData.Values["controller"] != null 
        //            && !String.IsNullOrEmpty(currentRouteData.Values["controller"].ToString()))
        //        {
        //            currentController = currentRouteData.Values["controller"].ToString();
        //        }

        //        if (currentRouteData.Values["action"] != null 
        //            && !String.IsNullOrEmpty(currentRouteData.Values["action"].ToString()))
        //        {
        //            currentAction = currentRouteData.Values["action"].ToString();
        //        }
        //    }

        //    var ex = Server.GetLastError();

        //    // log the error using log4net.
        //    SfLogger.Instance.LogException(ex);

        //    //We check if we have an AJAX request and return JSON in this case
        //    if (IsAjaxRequest())
        //    {
        //        JavaScriptSerializer serializer = new JavaScriptSerializer();
        //        Response.Clear();
        //        Response.TrySkipIisCustomErrors = true;
        //        Response.ContentType = "application/json";
        //        if (ex is UnauthorizedAccessException)
        //            Response.StatusCode = 401;
        //        else
        //        {
        //            Response.StatusCode = ex is HttpException ? ((HttpException)ex).GetHttpCode() : 500; ;
        //        }
        //        Response.Write(serializer.Serialize(new
        //        {
        //            success = false,
        //            message = ex.Message
        //        }));
        //        Response.End();
        //    } else
        //    {
        //        var controller = new ErrorController();
        //        var routeData = new RouteData();
        //        var action = "Index";

        //        if (ex is HttpException)
        //        {
        //            var httpEx = ex as HttpException;

        //            switch (httpEx.GetHttpCode())
        //            {
        //                case 404:
        //                    action = "NotFound";
        //                    break;

        //                // others if any
        //                default:
        //                    action = "Index";
        //                    break;
        //            }

        //        }

        //        httpContext.ClearError();
        //        httpContext.Response.Clear();
        //        httpContext.Response.StatusCode = ex is HttpException ? ((HttpException)ex).GetHttpCode() : 500;
        //        httpContext.Response.TrySkipIisCustomErrors = true;
        //        Response.ContentType = "text/html";
        //        routeData.Values["controller"] = "Error";
        //        routeData.Values["action"] = action;

        //        controller.ViewData.Model = new HandleErrorInfo(ex, currentController, currentAction);
        //        ((IController)controller).Execute(new RequestContext(new HttpContextWrapper(httpContext), routeData));
        //    }

        //}

        ////This method checks if we have an AJAX request or not
        //private bool IsAjaxRequest()
        //{
        //    //The easy way
        //    bool isAjaxRequest = (Request["X-Requested-With"] == "XMLHttpRequest")
        //        || ((Request.Headers != null)
        //        && (Request.Headers["X-Requested-With"] == "XMLHttpRequest"));

        //    //If we are not sure that we have an AJAX request or that we have to return JSON 
        //    //we fall back to Reflection
        //    if (!isAjaxRequest)
        //    {
        //        try
        //        {
        //            //The controller and action
        //            string controllerName = Request.RequestContext.
        //                                    RouteData.Values["controller"].ToString();
        //            string actionName = Request.RequestContext.
        //                                RouteData.Values["action"].ToString();

        //            //We create a controller instance
        //            DefaultControllerFactory controllerFactory = new DefaultControllerFactory();
        //            Controller controller = controllerFactory.CreateController(
        //            Request.RequestContext, controllerName) as Controller;

        //            //We get the controller actions
        //            ReflectedControllerDescriptor controllerDescriptor =
        //                new ReflectedControllerDescriptor(controller.GetType());
        //            ActionDescriptor[] controllerActions =
        //            controllerDescriptor.GetCanonicalActions();

        //            //We search for our action
        //            foreach (ReflectedActionDescriptor actionDescriptor in controllerActions)
        //            {
        //                if (actionDescriptor.ActionName.ToUpper().Equals(actionName.ToUpper()))
        //                {
        //                    //If the action returns JsonResult then we have an AJAX request
        //                    if (actionDescriptor.MethodInfo.ReturnType
        //                    .Equals(typeof(JsonResult)))
        //                        return true;
        //                }
        //            }
        //        }
        //        catch
        //        {

        //        }
        //    }

        //    return isAjaxRequest;
        //}
    }
}
