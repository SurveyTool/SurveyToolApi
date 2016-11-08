using EntityFrameworks;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServicesSurveyTool
{
    public interface IServicesManageSurvey
    {
        List<Survey> GetAllSurvey(string UserName);
        Survey GetSurvey(int IdSurvey);
        bool DeleteSurvey(string IdSurvey);
    }
}
