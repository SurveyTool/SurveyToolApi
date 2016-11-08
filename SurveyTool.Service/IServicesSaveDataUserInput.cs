using EntityFrameworks;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServicesSurveyTool
{
    public interface IServicesSaveDataUserInput
    {
        bool AddAnswer(Answer answer);
        bool AddQuestionOption(QuestionOption questionOption);
    }
}
