using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using Newtonsoft.Json;
using Core.Runtime.Session;

namespace SurveyTool.Web.Controllers
{
  //  [Authorize]
    public class HomeController : ControllerBase
    {
        public HomeController()
        {
        }

        [AllowAnonymous]
        public JsonResult test()
        {

            return Json(new
            {
                success = true
            }, JsonRequestBehavior.AllowGet);
        }

        [AllowAnonymous]
        [HttpPost]
        public JsonResult Login(string username, string password)
        {
           
            return Json(new
                    {
                        success = true,
                        message = "Login successfully",
                        data = 1
                    });
        }

       
        public JsonResult Logout()
        {
            FormsAuthentication.SignOut();
            
            SfSession.Instance.Set("User", null);
            SfSession.Instance.Set("Username", "");
            
            return Json(new
            {
                success = true,
                message = "",
                data = ""
            });
        }

        //private void SaveAuthenticationInfo()
        //{
        //    FormsAuthenticationTicket fat = new FormsAuthenticationTicket(1, userDto.Username, DateTime.Now,
        //            DateTime.Now.AddDays(30), false, JsonConvert.SerializeObject(userDto));
        //    HttpCookie cookie = new HttpCookie(FormsAuthentication.FormsCookieName,
        //            FormsAuthentication.Encrypt(fat));
        //    cookie.Expires.AddDays(30);
        //    Response.Cookies.Add(cookie);
        //    SfSession.Instance.Set("User", userDto);
        //    SfSession.Instance.Set("Username", userDto.Username);
        //}
    }
}