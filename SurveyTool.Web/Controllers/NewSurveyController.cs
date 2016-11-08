using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft;
using Newtonsoft.Json.Linq;
using EntityFrameworks;
using ServicesSurveyTool;

namespace SurveyTool.Controllers
{
    public class NewSurveyController : SurveyTool.Web.Controllers.ControllerBase
    {
        IServicesNewSurvey services;
        public NewSurveyController(IServicesNewSurvey _servies)
        {
            this.services = _servies;
        }
        // GET: NewSurvey
        public JsonResult CreateSurvey(string dataSurvey)
        {
            
            JObject obj = JObject.Parse(dataSurvey);
            ///////
            Survey survey = services.ConvertJsonToObject(obj);
            services.AddSurvey(survey);
            ////// create survey

            //////
            List<Section> ListSection = new List<Section>();
            JArray listJArrayInfoPage = (JArray)obj["infoListPage"];
            List<int> ListInfoPage = new List<int>();
            List<string> EmailShare = new List<string>();
            int i = 0;
            foreach(JValue value in listJArrayInfoPage)
            {
                Section tempSection = new Section();
                tempSection.SurveyId = survey.Id;
                tempSection.NumberSection = i;
                services.AddSection(tempSection);//add record section
                ListSection.Add(tempSection);
                var values = value.ToObject<int>();
                ListInfoPage.Add(values);
                i++;
            }
            ////////
            List<Question> ListQuestion = new List<Question>();
            JArray listJArrayQuestion = (JArray)obj["listQuestion"];
            i = 0;
            foreach(JObject value in listJArrayQuestion)
            { 
                Question tempQuestion = new Question();
                tempQuestion.Contents = (string)value["titleQuestion"];
                tempQuestion.IsRequired = (bool)value["required"];
                tempQuestion.NumberQuestion = i;
                tempQuestion.QuestionTypeId = services.GetIdQuestionType((string)value["typeQuestion"]);
                i++;
                int dem = 0;
                for(int j=0;j<ListInfoPage.Count;j++)
                {
                    dem = dem + ListInfoPage[j];
                    if(tempQuestion.NumberQuestion<dem)
                    {
                        tempQuestion.SectionId = ListSection[j].Id;
                        services.AddQuestion(tempQuestion);
                        break;
                    }
                }
                
                List<OptionChoice> ListOptionChoice = new List<OptionChoice>();
                if((string)value["typeQuestion"]== "MultipleChoice"|| (string)value["typeQuestion"] == "CheckBoxs"||
                    (string)value["typeQuestion"] == "Dropdown")
                {
                    foreach (JValue itemOption in (JArray)value["listQuestionOption"])
                    {
                        OptionChoice tempOptionChoice = new OptionChoice();
                        tempOptionChoice.Contents = itemOption.ToObject<string>();
                        ListOptionChoice.Add(tempOptionChoice);
                        services.AddOptionChoice(tempOptionChoice);// create record questionOption
                        QuestionOption tempQuestionOption = new QuestionOption();
                        tempQuestionOption.OptionChoiceId = tempOptionChoice.Id;
                        tempQuestionOption.QuestionId = tempQuestion.Id;
                        services.AddQuestionOption(tempQuestionOption);
                    }

                }
                if((string)value["typeQuestion"] == "LinearScale")
                {
                    
                    OptionChoice tempOptionChoice = new OptionChoice();
                    tempOptionChoice.MinimumOflinearScale = (int)value["min"];
                    tempOptionChoice.MaximumOflinearScale = (int)value["max"];
                    tempOptionChoice.ChoiceValueOflinearScale = (int)value["choiceLinear"];
                    services.AddOptionChoice(tempOptionChoice);// create record questionOption
                    QuestionOption tempQuestionOption = new QuestionOption();
                    tempQuestionOption.OptionChoiceId = tempOptionChoice.Id;
                    tempQuestionOption.QuestionId = tempQuestion.Id;
                    services.AddQuestionOption(tempQuestionOption);
                }

               




            }



            ////Create section for survey 

            foreach (JValue value in (JArray)obj["mailShare"])
            {
                var values = value.ToObject<string>();
                EmailShare.Add(values);
            }
            
            
            
            
            return Json(survey.Id, JsonRequestBehavior.AllowGet);

        }
        
    }
}