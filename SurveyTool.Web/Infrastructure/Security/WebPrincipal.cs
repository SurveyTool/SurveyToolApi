//using SurveyTool.Service.HRM.Dtos;
using SurveyTool.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
//using SurveyTool.Service.Users.Dtos;
using EntityFrameworks;

namespace SurveyTool.Web.Infrastructure.Security
{
    public class WebPrincipal : IPrincipal
    {
        public User User {get; set;}

        public WebPrincipal(string username)
        {
            this.Identity = new GenericIdentity(username);
        }
       public IIdentity Identity { get; set; }

        public bool IsInRole(string requiredRole)
        {
            //if (String.IsNullOrEmpty(requiredRole))
            //    return true;

            //Role role = (Role)Enum.Parse(typeof(Role), requiredRole);

            return true;//(User.SystemRoles.IndexOf(role) != -1);            
        }
       
       
    }
}