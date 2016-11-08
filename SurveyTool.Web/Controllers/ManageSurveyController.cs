using ServicesSurveyTool;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SurveyTool.Controllers
{
    public class ManageSurveyController : SurveyTool.Web.Controllers.ControllerBase
    {
        IServicesManageSurvey sv;
        public ManageSurveyController(IServicesManageSurvey _sv)
        {
            this.sv = _sv;
        }
        public JsonResult GetAllSurvey(string UserName)
        {
            return Json(sv.GetAllSurvey(UserName)
            , JsonRequestBehavior.AllowGet);
        }
        public bool DeleteSurvey(string IdSurvey)
        {
            return sv.DeleteSurvey(IdSurvey);
            
        }
    }
}