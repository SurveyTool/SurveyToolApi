using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using EntityFrameworks;

namespace SurveyTool.Web.Infrastructure
{
    /// <summary>
    /// Asp.net MVC default AuthorizeAttribute class only accepts list of allowed roles
    /// in string for a controller action while we are using enum type for user roles.
    /// So we need to create our own custom class to accept list of allowed enum role.
    /// </summary>

    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, Inherited = true, AllowMultiple = true)]
    public class CustomAuthorizeAttribute : AuthorizeAttribute
    {
        //public CustomAuthorizeAttribute(params Role[] roles)
        //{
        //    this.Roles = string.Join(",", roles.Select(r => r.ToString()));
        //}
    }
}