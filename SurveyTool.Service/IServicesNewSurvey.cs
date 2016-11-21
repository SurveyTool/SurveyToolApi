using EntityFrameworks;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServicesSurveyTool
{
    public interface IServicesNewSurvey
    {
        int GetIdUser(string username);
        Survey ConvertJsonToObject(JObject obj);
        bool AddSurvey(Survey survey);
        bool AddSection(Section section);
        int GetIdQuestionType(string nameQuestionType);
        bool AddOptionChoice(OptionChoice option);
        bool AddQuestionOption(QuestionOption questionOption);
        bool AddQuestion(Question question);
        bool AddSubSurvey(SubUserSurvey subSurvey);
    }
}
