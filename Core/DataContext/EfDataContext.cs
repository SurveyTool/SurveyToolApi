using Core.Entities;
using Core.Entities.Auditing;
using Core.Entities.Job;
using Core.Entities.Permission;
using Core.Runtime.Session;
using System;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;

namespace Core.DataContext
{
    public abstract class EfDataContext : DbContext, IDataContext
    {
        /// <summary>
        /// Constructor.
        /// Uses default connection string.
        /// </summary>
        public EfDataContext() : base("Default")
        {

        }

        /// <summary>
        /// Constructor.
        /// </summary>
        public EfDataContext(string nameOrConnectionString)
            : base(nameOrConnectionString)
        {

        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            //modelBuilder.Types<ISoftDelete>().Configure(c => c.HasTableAnnotation(AbpEfConsts.SoftDeleteCustomAnnotationName, true));
        }

        public override int SaveChanges()
        {
            foreach (var entry in ChangeTracker.Entries())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        SetCreationAuditProperties(entry);
                        break;
                    case EntityState.Modified:
                        SetModificationAuditProperties(entry);
                        break;
                    case EntityState.Deleted:
                        HandleSoftDelete(entry);
                        break;
                }
            }

            return base.SaveChanges();
        }

        private void SetCreationAuditProperties(DbEntityEntry entry)
        {
            if (entry.Entity is IAuditableEntity)
            {
                var auditedEntry = entry.Cast<IAuditableEntity>();
                auditedEntry.Entity.CreatedDate = DateTime.Now; //TODO: UtcNow?
                auditedEntry.Entity.CreatedBy = SfSession.Instance.UserId;
            }
        }

        private void SetModificationAuditProperties(DbEntityEntry entry)
        {
            if (entry.Entity is IAuditableEntity)
            {
                var auditedEntry = entry.Cast<IAuditableEntity>();
                auditedEntry.Entity.UpdatedDate = DateTime.Now; //TODO: UtcNow?
                auditedEntry.Entity.UpdatedBy = SfSession.Instance.UserId;
            }
        }

        private void HandleSoftDelete(DbEntityEntry entry)
        {
            if (entry.Entity is ISoftDelete)
            {
                var softDeleteEntry = entry.Cast<ISoftDelete>();

                softDeleteEntry.State = EntityState.Unchanged;
                softDeleteEntry.Entity.IsDeleted = true;

                if (entry.Entity is IAuditableEntity)
                {
                    var deletionAuditedEntry = entry.Cast<IAuditableEntity>();
                    deletionAuditedEntry.Entity.UpdatedDate = DateTime.Now; //TODO: UtcNow?
                    deletionAuditedEntry.Entity.UpdatedBy = SfSession.Instance.UserId;
                }
            }
        }

    }
}
