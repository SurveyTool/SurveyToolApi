using DAL;
using EntityFrameworks;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServicesSurveyTool
{
   public  class ServicesLoadingData : IServicesLoadingData
    {
        SurveyToolDbContext db;
        public ServicesLoadingData(SurveyToolDbContext _db)
        {
            this.db = _db;
            db.Configuration.ProxyCreationEnabled = false;
        }
        public List<QuestionType> GetListQuestionType()
        {
            return db.QuestionTypes.ToList();
        }
        public string GetQuestionTypeByIdQuestion(int IdQuestionType)
        {
            foreach (var type in GetListQuestionType())
            {
                if(type.Id==IdQuestionType)
                {
                    return type.NameTypeQuestion;
                }
            }
            return null;
        }
        public int GetNumberQuestion(int IdSurvey)
        {
            int i = 0;
            List<Section> listSection = GetListSectionByIdSurvey(IdSurvey);
            foreach (var section in listSection)
            {
                i += GetListQuestionByIdSection(section.Id).Count;
            }
            return i;
        }
        public int GetNumberAnswer (int IdSurvey)
        {
            int IdQuestion = GetListQuestionByIdSurvey(IdSurvey)[0].Id;
            List<Answer> listAnswer = GetListAnswerByIdQuestion(IdQuestion);
            return listAnswer.Count;
        }
        public List<Question> GetListQuestionByIdSection(int IdSection)
        {
            List<Question> listQuestion = new List<Question>();
            List<Question> allQuestion = db.Questions.ToList();
            foreach (var question in allQuestion)
            {
                if (question.SectionId==IdSection)
                {
                    listQuestion.Add(question);
                }
            }
            return listQuestion;
        }
        public List<Section> GetListSectionByIdSurvey(int IdSurvey)
        {
            List<Section> listSection = new List<Section>();
            List<Section> allSection = db.Sections.ToList();
            foreach (var section in allSection)
            {
                if (section.SurveyId == IdSurvey)
                {
                    listSection.Add(section);
                }
            }
            return listSection;
        }
        public List<Question> GetListQuestionByIdSurvey(int IdSurvey)
        {
            List<Question> listQuestion = new List<Question>();
            List<Section> allSection = GetListSectionByIdSurvey(IdSurvey);
            foreach(var section in allSection)
            {
                listQuestion.AddRange(GetListQuestionByIdSection(section.Id));
            }
            return listQuestion;
        }
        protected List<QuestionOption> GetListQuestionOptionByIdQuestion(int IdQuestion)
        {
            List<QuestionOption> listQuestionOption = new List<QuestionOption>();
            List<QuestionOption> allQuestionOption = db.QuestionOptions.ToList();
            foreach(var questionOption in allQuestionOption)
            {
                if(questionOption.QuestionId==IdQuestion)
                {
                    listQuestionOption.Add(questionOption);
                }
            }
            return listQuestionOption;
        }
        public List<OptionChoice> GetListOptionChoiceByIdQuestion(int IdQuestion)
        {
            List<OptionChoice> listOptionChoice = new List<OptionChoice>();
            List<OptionChoice> allOptionChoice = db.OptionChoices.ToList();
            List<QuestionOption> listQuestionOption = GetListQuestionOptionByIdQuestion(IdQuestion);
            foreach(var questionOption in listQuestionOption)
            {
                foreach( var optionChoice in allOptionChoice)
                {
                    if (questionOption.OptionChoiceId == optionChoice.Id)
                    {
                        listOptionChoice.Add(optionChoice);
                    }
                }
            }
            return listOptionChoice;
        }
        public Survey GetSurvey(int IdSurvey)
        {
            return db.Surveys.Find(IdSurvey);
        }
        public List<Answer> GetListAnswerByIdQuestion(int IdQuestion)
        {
            List<string> listAnswerText = new List<string>();
            List<Answer> listAnwser = new List<Answer>();
            List<QuestionOption> listQuestionOption = GetListQuestionOptionByIdQuestion(IdQuestion);
            List<Answer> allAnswer = db.Answers.ToList();
            foreach(var questionOption in listQuestionOption)
            {
                foreach(var answer in allAnswer)
                {
                    if(answer.QuestionOptionId==questionOption.Id)
                    {
                        Answer tempAnswer = new Answer();
                        tempAnswer.AnswerDate = answer.AnswerDate;
                        tempAnswer.AnswerNumber = answer.AnswerNumber;
                        tempAnswer.AnswerTime = answer.AnswerTime;
                        tempAnswer.AnswerYesNo = answer.AnswerYesNo;
                        tempAnswer.SerialNumber = answer.SerialNumber;
                        tempAnswer.AnswerText = answer.AnswerText;
                        listAnwser.Add(tempAnswer);
                    }
                }
            }
            return listAnwser;
        }
       
    }
}
