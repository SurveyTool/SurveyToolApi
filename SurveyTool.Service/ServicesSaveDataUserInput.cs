using DAL;
using EntityFrameworks;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServicesSurveyTool
{
    public class ServicesSaveDataUserInput : IServicesSaveDataUserInput
    {
        SurveyToolDbContext db;
        public ServicesSaveDataUserInput(SurveyToolDbContext _db)
        {
            this.db = _db;
        }
        public bool AddQuestionOption(QuestionOption questionOption)
        {
            if(questionOption==null)
            {
                return false;
            }
            else
            {
                db.QuestionOptions.Add(questionOption);
                db.SaveChanges();
            }
            return true;
        }
        public bool AddAnswer(Answer answer)
        {
            if (answer == null)
            {
                return false;
            }
            else
            {
                db.Answers.Add(answer);
                db.SaveChanges();
            }
            return true;
        }
    }
}
