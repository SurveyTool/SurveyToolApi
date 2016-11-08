using Core.Services;
using Core.Services.Jobs.Dtos;
using System.Collections.Generic;

namespace Core.Services.Jobs
{
    public interface IJobService : IApplicationService
    {
        List<JobDto> GetAll();

        List<JobDto> GetAllActive();

        JobDto Get(int Id);

        void Add(JobDto job);

        void Update(JobDto job);

        void Delete(int Id);
    }
}
