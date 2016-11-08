using EntityFrameworks;
using Newtonsoft.Json.Linq;
using ServicesSurveyTool;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SurveyTool.Controllers
{
    public class InformationUserInputController : SurveyTool.Web.Controllers.ControllerBase
    {
        IServicesSaveDataUserInput services;
        public InformationUserInputController(IServicesSaveDataUserInput _services)
        {
            this.services = _services;
        }
        [HttpPost]
        public bool AddRecord(string dataJson)
        {
            JObject obj = JObject.Parse(dataJson);
            JArray listAnswer = (JArray)obj["listAnswer"];
            int serialNumber=-1;
            foreach(JObject answerObj in listAnswer)
            {
                QuestionOption questionOption=new QuestionOption();
                questionOption.QuestionId = (int)answerObj["IdQuestion"];
                services.AddQuestionOption(questionOption);
                if(serialNumber==-1)
                {
                    serialNumber = questionOption.Id;
                }
                switch ((string)answerObj["typeQuestion"]) {
                    case "ShortAnswer":
                        Answer answerS = new Answer();
                        if (answerObj["dataText"] != null)
                        {
                            answerS.AnswerText = (string)answerObj["dataText"];
                        }
                        answerS.QuestionOptionId = questionOption.Id;
                        answerS.SerialNumber = serialNumber;
                        answerS.AnswerTime = DateTime.Now;
                        services.AddAnswer(answerS);
                        break;
                    case "Paragraph":
                        Answer answerP = new Answer();
                        if (answerObj["dataText"] != null)
                        {
                            answerP.AnswerText = (string)answerObj["dataText"];
                        }
                        answerP.QuestionOptionId = questionOption.Id;
                        answerP.SerialNumber = serialNumber;
                        answerP.AnswerTime = DateTime.Now;
                        services.AddAnswer(answerP);
                        break;
                    case "MultipleChoice":
                        Answer answerM = new Answer();
                        if (answerObj["dataText"] != null)
                        {
                            answerM.AnswerText = (string)answerObj["dataText"];
                        }
                        answerM.QuestionOptionId = questionOption.Id;
                        answerM.SerialNumber = serialNumber;
                        answerM.AnswerTime = DateTime.Now;
                        services.AddAnswer(answerM);
                        break;
                    case "CheckBoxs":
                        Answer answerC = new Answer();
                        answerC.QuestionOptionId = questionOption.Id;
                        if (answerObj["dataText"] != null)
                        {
                            JArray listCheckBoxs = (JArray)answerObj["dataText"];
                            string dataTex = "";
                            int i = 0;
                            foreach (JObject value in listCheckBoxs)
                            {
                                dataTex = dataTex + (string)value["label"];
                                if(i<listCheckBoxs.Count-1)
                                {
                                    dataTex = dataTex + ", ";
                                }
                                i++;
                            }
                            answerC.AnswerText = dataTex;
                        }
                        answerC.AnswerTime = DateTime.Now;
                        answerC.SerialNumber = serialNumber;
                        services.AddAnswer(answerC);
                        break;
                    case "Dropdown":
                        Answer answerD = new Answer();
                        if (answerObj["dataText"] != null)
                        {
                            answerD.AnswerText = (string)answerObj["dataText"];
                        }
                        answerD.QuestionOptionId = questionOption.Id;
                        answerD.SerialNumber = serialNumber;
                        answerD.AnswerTime = DateTime.Now;
                        services.AddAnswer(answerD);
                        break;
                    case "LinearScale":
                        Answer answerL = new Answer();
                        answerL.QuestionOptionId = questionOption.Id;
                        if (answerObj["dataText"] != null)
                        {
                            answerL.AnswerNumber = (int)answerObj["dataText"];
                        }
                        if (answerObj["dataComment"] != null)
                        {
                            answerL.AnswerText = (string)answerObj["dataComment"];
                        }
                        answerL.SerialNumber = serialNumber;
                        answerL.AnswerTime = DateTime.Now;
                        services.AddAnswer(answerL);
                        break;
                    case "Date":
                        Answer answerDate = new Answer();
                        answerDate.QuestionOptionId = questionOption.Id;
                        if (answerObj["dataText"] != null)
                        {
                            try
                            {
                                answerDate.AnswerDate = DateTime.Parse((string)answerObj["dataText"]);
                            }
                            catch(System.FormatException e)
                            {
                                return false;
                            }
                        }
                        answerDate.SerialNumber = serialNumber;
                        answerDate.AnswerTime = DateTime.Now;
                        services.AddAnswer(answerDate);
                        break;
                    }
            }
            return true;
        }
    }
}