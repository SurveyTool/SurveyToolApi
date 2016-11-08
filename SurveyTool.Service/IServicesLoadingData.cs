using EntityFrameworks;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServicesSurveyTool
{
    public interface IServicesLoadingData
    {
        List<Question> GetListQuestionByIdSection(int IdSection);
        List<Section> GetListSectionByIdSurvey(int IdSurvey);
        List<Question> GetListQuestionByIdSurvey(int IdSurvey);
        List<OptionChoice> GetListOptionChoiceByIdQuestion(int IdQuestion);
        Survey GetSurvey(int IdSurvey);
        List<QuestionType> GetListQuestionType();
        List<Answer> GetListAnswerByIdQuestion(int IdQuestion);
        string GetQuestionTypeByIdQuestion(int IdQuestionType);
        int GetNumberQuestion(int IdSurvey);
        int GetNumberAnswer(int IdSurvey);
    }
}
