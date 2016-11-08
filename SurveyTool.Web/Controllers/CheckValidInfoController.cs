using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ServicesSurveyTool;
using EntityFrameworks;

namespace SurveyTool.Controllers
{
    public class CheckValidInfoController : Controller
    {
        IServicesLoadingData servicesLoading;
        public CheckValidInfoController(IServicesLoadingData _services)
        {
            this.servicesLoading = _services;
        }
        // GET: CheckValidInfo
        public JsonResult CheckValidDateSurvey(string IdSurvey)
        {
            string message;
            bool state;
            if (IdSurvey==null)
            {
                return Json(new
                {
                    message = "Survey not found",
                    state = false
                }, JsonRequestBehavior.AllowGet);
            }
            DateTime dateCurrent = DateTime.Now;
            Survey survey;
            try
            {
                int IdSurveyInt= Int32.Parse(IdSurvey);
                survey = servicesLoading.GetSurvey(IdSurveyInt);
            }
            catch(Exception ex)
            {
                return Json(new
                {
                    message = "Survey not found",
                    state = false
                }, JsonRequestBehavior.AllowGet);
            }
            if (survey == null)
            {
                return Json(new
                {
                    message = "Survey not found",
                    state = false
                }, JsonRequestBehavior.AllowGet);
            }




            if (CompareDate(DateTime.Today,survey.DateStart)< 0)
            {
                message= "Less than a day survey. Come back later";
                state = false;
                return Json(new
                {
                    message = message,
                    state=state
                }, JsonRequestBehavior.AllowGet);
            }
            if (CompareDate(DateTime.Today, survey.Deadline) > 0)
            {
                message = "Survey is close.";
                state = false;
                return Json(new
                {
                    message = message,
                    state = state
                }, JsonRequestBehavior.AllowGet);
            }
            return Json(new
            {
                state = true
            }, JsonRequestBehavior.AllowGet);

        }
        int CompareDate(DateTime date1,DateTime date2)
        {
            if(date1.Year>date2.Year)
            {
                return 1;
            }
            if(date1.Year<date2.Year)
            {
                return -1;
            }
            if (date1.Month > date2.Month)
            {
                return 1;
            }
            if (date1.Month < date2.Month)
            {
                return -1;
            }
            if (date1.Day > date2.Day)
            {
                return 1;
            }
            if (date1.Day < date2.Day)
            {
                return -1;
            }
            return 0;
        }
        public JsonResult CheckNumberPerson(string IdSurvey)
        {
            string message;
            bool state;
            if (IdSurvey == null)
            {
                return Json(new
                {
                    message = "Survey not found",
                    state = false
                }, JsonRequestBehavior.AllowGet);
            }
            Survey survey = null;
            try
            {
                int IdSurveyInt = Int32.Parse(IdSurvey);
                survey = servicesLoading.GetSurvey(IdSurveyInt);
            }
            catch(Exception ex)
            {
                return Json(new
                {
                    message = "Survey not found",
                    state = false
                }, JsonRequestBehavior.AllowGet);
            }
            if (survey == null)
            {
                return Json(new
                {
                    message = "Survey not found",
                    state = false
                }, JsonRequestBehavior.AllowGet);
            }
            if (survey.LimitNumber == -1)
            {
                return Json(new
                {

                    state = true
                }, JsonRequestBehavior.AllowGet);
            }
            if (servicesLoading.GetNumberAnswer(Int32.Parse(IdSurvey)) < survey.LimitNumber)
            {
                return Json(new
                {

                    state = true
                }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new
                {
                    message = "Survey is closed.",
                    state = false
                }, JsonRequestBehavior.AllowGet);
            }
        }
    }

}