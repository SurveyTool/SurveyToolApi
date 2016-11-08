using DAL;
using EntityFrameworks;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServicesSurveyTool
{
    public class ServicesManageSurvey :IServicesManageSurvey
    {
        SurveyToolDbContext db;
        
        public ServicesManageSurvey(SurveyToolDbContext _db)
        {
            this.db = _db;
        }
        public int GetIdUser(string username)
        {
            foreach (var user in db.Users)
            {
                if (user.UserName.Equals(username) == true)
                {
                    return user.Id;
                }
            }
            return -1;
        }
        public List<Survey> GetAllSurvey(string UserName)
        {
            int IdUser = GetIdUser(UserName);
            if(IdUser==-1)
            {
                return null;
            }
            List<Survey> listSurvey = new List<Survey>();
            foreach(var item in db.Surveys.ToList())
            {

                if (item.UserId == IdUser)
                {
                    Survey temp = new Survey();
                    temp.Id = item.Id;
                    temp.Title = item.Title;
                    temp.EndPage = item.EndPage;
                    temp.Discription = item.Discription;
                    temp.Deadline = item.Deadline;
                    temp.DateStart = item.DateStart;

                    listSurvey.Add(temp);
                }
                
                
            }
            
            return listSurvey;
        }
        public Survey GetSurvey(int IdSurvey)
        {
            foreach(var item in db.Surveys.ToList())
            {
                if(item.Id==IdSurvey)
                {
                    return item;
                }
            }
            return null;
        }
        public List<Section> GetSectionByIdSurvey(int IdSurvey)
        {
            List<Section> ListSection = new List<Section>();
            foreach (var section in db.Sections)
            {
                if(section.SurveyId==IdSurvey)
                {
                    ListSection.Add(section);
                }
            }
            return ListSection;
        }
        public List<Question> GetQuestionByIdSection(int IdSection)
        {
            List<Question> ListQuestion = new List<Question>();
            foreach(var question in db.Questions)
            {
                if(question.SectionId==IdSection)
                {
                    ListQuestion.Add(question);
                }
            }
            return ListQuestion;
        }
        public List<OptionChoice> GetListOptionChoiceByIdQuestion(int IdQuestion)
        {
            List<OptionChoice> ListOptionChoice = new List<OptionChoice>();
            List<QuestionOption> ListOptionQuestion = db.QuestionOptions.ToList();
            foreach(var optionChoice in db.OptionChoices)
            {
                foreach(var optionQuestion in ListOptionQuestion)
                {
                    if(IdQuestion==optionQuestion.QuestionId&&optionChoice.Id==optionQuestion.OptionChoiceId)
                    {
                        ListOptionChoice.Add(optionChoice);
                    }
                }
            }
            return ListOptionChoice;
        }
        public List<QuestionOption> GetListQuestionOptionByIdQuestion(int IdQuestion)
        {
            List<QuestionOption> ListQuestionOption = new List<QuestionOption>();
            foreach(var questionOption in db.QuestionOptions)
            {
                if(IdQuestion==questionOption.QuestionId)
                {
                    ListQuestionOption.Add(questionOption);
                }
            }
            return ListQuestionOption;
        }
        protected bool DeleteListOptionQuestion(List<QuestionOption> ListQuestionOption)
        {
            foreach(var questionOption in ListQuestionOption)
            {
                db.QuestionOptions.Remove(questionOption);
                db.SaveChanges();
            }
            return true;
        }
        protected bool DeleteListOptionChoice(List<OptionChoice> ListOptionChoice)
        {
            foreach (var optionChoice in ListOptionChoice)
            {
                db.OptionChoices.Remove(optionChoice);
                db.SaveChanges();
            }
            return true;
        }
        protected bool DeleteListQuestion(List<Question> ListQuestion)
        {
            foreach (var question in ListQuestion)
            {
                db.Questions.Remove(question);
                db.SaveChanges();
            }
            return true;
        }
        protected bool DeleteListSection(List<Section> ListSection)
        {
            foreach (var section in ListSection)
            {
                db.Sections.Remove(section);
                db.SaveChanges();
            }
            return true;
        }
        public bool DeleteSurvey(string IdSurvey)
        {
            Survey survey = GetSurvey(Int32.Parse(IdSurvey));
            List<Section> ListSection = GetSectionByIdSurvey(Int32.Parse(IdSurvey));
            foreach(var section in ListSection)
            {
                List<Question> ListQuestion = GetQuestionByIdSection(section.Id);
                foreach(var question in ListQuestion)
                {
                    List<QuestionOption> ListQuestionOption = GetListQuestionOptionByIdQuestion(question.Id);
                    List<OptionChoice> ListOptionChoice = GetListOptionChoiceByIdQuestion(question.Id);
                    DeleteListOptionQuestion(ListQuestionOption);
                    DeleteListOptionChoice(ListOptionChoice);
                }
                DeleteListQuestion(ListQuestion);
            }
            DeleteListSection(ListSection);
            db.Surveys.Remove(survey);
            db.SaveChanges();
            return true;
        }
    }
}
