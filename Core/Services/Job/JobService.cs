using AutoMapper;
using Core.Entities;
using Core.Repositories;
using Core.Services;
using Core.Entities.Job;
using Core.Services.Jobs.Dtos;
using System.Collections.Generic;

namespace Core.Services.Jobs
{
    public class JobService : ApplicationService, IJobService
    {
        private readonly IRepository<Job> _jobRepository;

        public JobService(IRepository<Job> jobRepository)
        {
            _jobRepository = jobRepository;

            Mapper.CreateMap<Job, JobDto>();
            Mapper.CreateMap<JobDto, Job>();
        }
        
        public List<JobDto> GetAll()
        {
            List<JobDto> returnList = Mapper.Map<List<JobDto>>(_jobRepository.GetAllList());
            return returnList;
        }

        public List<JobDto> GetAllActive()
        {
            List<JobDto> returnList = Mapper.Map<List<JobDto>>(
                _jobRepository.GetAllList(x => x.Status == JobStatus.ENABLED));
            return returnList;
        }

        public JobDto Get(int Id)
        {
            return Mapper.Map<JobDto>(_jobRepository.Get(Id));
        }

        public void Add(JobDto jobDto)
        {
            Job job = new Job();
            Mapper.Map<JobDto, Job>(jobDto, job);

            int jobId = _jobRepository.InsertAndGetId(job);
        }
        
        public void Update(JobDto jobDto)
        {
            Job job = _jobRepository.Get(jobDto.Id);
            _jobRepository.Update(Mapper.Map<JobDto, Job>(jobDto, job));
        }

        public void Delete(int Id)
        {
            _jobRepository.Delete(Id);
        }
    }
}
