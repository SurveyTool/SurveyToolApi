using DAL;
using EntityFrameworks;
using ServicesSurveyTool;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SurveyTool.Controllers
{
    public class LoginRegisterController : SurveyTool.Web.Controllers.ControllerBase
    {

        IServicesLogin sv;
        public LoginRegisterController(IServicesLogin _sv)
        {
            this.sv = _sv;
        }
        public JsonResult Index()
        {
            
            return null;
        }
        [HttpPost]
        public JsonResult CheckLogin(string username,string password)
        {
            Console.Write(sv.CheckLogin(username, password));
            return Json(new {
                check = sv.CheckLogin(username, password),
                fullname = sv.GetFullName(username)
            }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult CheckExistsUserNameInRegister(string username)
        {
            Console.WriteLine(sv.CheckExistsUserNameInRegister(username));
            return Json(sv.CheckExistsUserNameInRegister(username), JsonRequestBehavior.AllowGet);
        }
        public JsonResult CheckExistsEmailInRegister(string email)
        {
            Console.WriteLine(sv.CheckExistsEmailInRegister(email));
            return Json(sv.CheckExistsEmailInRegister(email), JsonRequestBehavior.AllowGet);
        }
        public JsonResult SubmitUser(string fullname, string username, string password, 
            string email, string phone, DateTime birthday, string gender, string company)
        {
            User user = new User();
            user.FullName = fullname;
            user.UserName = username;
            user.Password = password;
            user.Email = email;
            user.Phone = phone;
            user.Birthday = birthday;
            user.Gender = gender;
            user.Company = company;
            return Json(sv.AddAccount(user), JsonRequestBehavior.AllowGet);
        }
    }
}