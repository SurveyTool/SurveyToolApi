using DAL;
using EntityFrameworks;
using Newtonsoft.Json;
using ServicesSurveyTool;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SurveyTool.Controllers
{
    public class LoadingDataSurveyController : SurveyTool.Web.Controllers.ControllerBase
    {
        IServicesLoadingData servicesLoadingData;
        
        public LoadingDataSurveyController(IServicesLoadingData _servicesLoadingData)
        {
            this.servicesLoadingData = _servicesLoadingData;
        }
        [HttpGet]
        public JsonResult GetListOptionChoiceByQuestion(string IdQuestion)
        {
            return Json(JsonConvert.SerializeObject(servicesLoadingData.GetListOptionChoiceByIdQuestion(Int32.Parse(IdQuestion)), new JsonSerializerSettings
            { PreserveReferencesHandling = PreserveReferencesHandling.Objects }), JsonRequestBehavior.AllowGet);
        }
        
        [HttpGet]
        public JsonResult GetListQuestionBySection(string IdSection)
        {
            List<Question> questions = servicesLoadingData.GetListQuestionByIdSection(Int32.Parse(IdSection));
            return Json(JsonConvert.SerializeObject(questions, new JsonSerializerSettings
                {PreserveReferencesHandling = PreserveReferencesHandling.Objects }),JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult GetListSectionBySurvey(string IdSurvey)
        {
            try
            {
                int IdSurveyInt = Int32.Parse(IdSurvey);
            }
            catch(Exception ex)
            {
                return null;
            }
            return Json(JsonConvert.SerializeObject(servicesLoadingData.GetListSectionByIdSurvey(Int32.Parse(IdSurvey)),
                new JsonSerializerSettings { PreserveReferencesHandling = PreserveReferencesHandling.Objects }),
                JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult GetInformationSurvey(string IdSurvey)
        {
            if(IdSurvey==null)
            {
                return null;
            }
            try
            {
                int IdSurveyInt = Int32.Parse(IdSurvey);
            }
            catch (Exception ex)
            {
                return null;
            }
            return Json(JsonConvert.SerializeObject(servicesLoadingData.GetSurvey(Int32.Parse(IdSurvey)),
                new JsonSerializerSettings { PreserveReferencesHandling = PreserveReferencesHandling.Objects }),
                JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult GetListQuestionByIdSurvey(string IdSurvey)
        {
            if (IdSurvey == null)
            {
                return null;
            }
            List<Question> questions = servicesLoadingData.GetListQuestionByIdSurvey(Int32.Parse(IdSurvey));
            List<string> listQuestionString = new List<string>();
            foreach (var question in questions)
            {
                listQuestionString.Add(JsonConvert.SerializeObject(question, new JsonSerializerSettings
                { PreserveReferencesHandling = PreserveReferencesHandling.Objects }));
            }
            
            return Json(listQuestionString, JsonRequestBehavior.AllowGet);

        }
        public JsonResult GetListAnswerBySurvey(string IdSurvey)
        {
            if(IdSurvey==null)
            {
                return null;
            }
            List<Question> listQuestion=servicesLoadingData.GetListQuestionByIdSurvey(Int32.Parse(IdSurvey));
            List<String> listAnswerByQuestionJson = new List<string>();
            List<Question> listTitleQuestion = new List<Question>();
            foreach(var question in listQuestion)
            {
                Question tempQuestion = new Question();
                tempQuestion.Contents = question.Contents;
                tempQuestion.QuestionTypeId = question.QuestionTypeId;
                listTitleQuestion.Add(tempQuestion);
             
            }
            listAnswerByQuestionJson.Add(JsonConvert.SerializeObject(listTitleQuestion,
                new JsonSerializerSettings { PreserveReferencesHandling = PreserveReferencesHandling.Objects }));
            foreach (var question in listQuestion)
            {
                
                listAnswerByQuestionJson.Add(JsonConvert.SerializeObject(servicesLoadingData.GetListAnswerByIdQuestion(question.Id),
                new JsonSerializerSettings { PreserveReferencesHandling = PreserveReferencesHandling.Objects }));
                
               
            }
            return Json(listAnswerByQuestionJson, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult GetListQuestionType()
        {
            return Json(JsonConvert.SerializeObject(servicesLoadingData.GetListQuestionType(),
                new JsonSerializerSettings { PreserveReferencesHandling = PreserveReferencesHandling.Objects }),
                JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult GetNumberSection(string IdSurvey)
        {
            if (IdSurvey == null)
            {
                return null;
            }
            return Json(servicesLoadingData.GetListSectionByIdSurvey(Int32.Parse(IdSurvey)).Count, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult GetNumberQuestion(string IdSurvey)
        {
            if (IdSurvey == null)
            {
                return null;
            }
            return Json(servicesLoadingData.GetNumberQuestion(Int32.Parse(IdSurvey)), JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult GetIdNewSurvey()
        {
            Survey survey = new Survey();
            return Json(survey.Id, JsonRequestBehavior.AllowGet) ;
        }
    }
}