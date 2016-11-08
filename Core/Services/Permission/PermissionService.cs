using Core.Entities;
using Core.Repositories;
using Core.Entities.Permission;
using Core.Services.Permission.Dtos;
using System.Linq;
using System.Collections.Generic;
using AutoMapper;
using System;

namespace Core.Services.Permission
{
    public class PermissionService : ApplicationService, IPermissionService
    {
        private readonly IRepository<Operation> _operationRepository;
        private readonly IRepository<Core.Entities.Permission.Permission> _permissionRepository;
        private readonly IRepository<Role> _roleRepository;

        public PermissionService(IRepository<Operation> operationRepository,
            IRepository<Core.Entities.Permission.Permission> permissionRepository,
            IRepository<Role> roleRepository)
        {
            _operationRepository = operationRepository;
            _permissionRepository = permissionRepository;
            _roleRepository = roleRepository;

            Mapper.CreateMap<Operation, OperationDto>();
            Mapper.CreateMap<OperationDto, Operation>();
            Mapper.CreateMap<Role, RoleDto>();
            Mapper.CreateMap<RoleDto, Role>();
            Mapper.CreateMap<Core.Entities.Permission.Permission, PermissionDto>();
            Mapper.CreateMap<PermissionDto, Core.Entities.Permission.Permission>();
        }

        #region Authorize Request

        public bool AuthorizePermission(string userRole, OperationDto operationDto)
        {
            if (string.IsNullOrEmpty(operationDto.Identity))
                return true;
            // Get role and all parents
            Role role = _roleRepository.GetAllList(x => x.RoleName.Equals(userRole)).FirstOrDefault();
            if (role == null)
                return false;
            List<Role> allRoleTree = new List<Role>();
            GetRoleTree(role, ref allRoleTree);
            
            //// Get operation and permission match with operationDto
            Operation operation = _operationRepository.GetAllList(x => x.Identity == operationDto.Identity).FirstOrDefault();
            if (operation == null)
                return false;
            Core.Entities.Permission.Permission permission = _permissionRepository.GetAllList(x =>
                x.Id == operation.PermissionId).FirstOrDefault();
            if (permission == null)
                return false;

            foreach (Role r in allRoleTree)
            {
                if (r.Permissions.Contains(permission))
                    return true;
            }

            return false;
        }

        public void ScanOperations(List<OperationDto> operations)
        {
            var currentIdentities = _operationRepository.GetAll().Select(x => x.Identity);
            var scannedIdentities = operations.Select(x => x.Identity);

            var newIdentities = scannedIdentities.Except(currentIdentities);
            var updatedIdentities = currentIdentities.Intersect(scannedIdentities);
            var removedIdentities = currentIdentities.Except(scannedIdentities);

            // Insert new identities
            foreach (string item in newIdentities)
            {
                OperationDto operationDto = operations.Where(x => x.Identity.Equals(item)).First();
                Operation operation = new Operation()
                {
                    Identity = operationDto.Identity,
                    DisplayName = operationDto.DisplayName,
                    Description = operationDto.Description
                };
                _operationRepository.Insert(operation);
            }

            // Update existed identities
            foreach (string item in updatedIdentities)
            {
                OperationDto operationDto = operations.Where(x => x.Identity.Equals(item)).First();
                Operation operation = _operationRepository.GetAllList(x => x.Identity.Equals(item)).First();
                if (!operation.DisplayName.Equals(operationDto.DisplayName) || 
                    !operation.Description.Equals(operationDto.Description))
                {
                    operation.DisplayName = operationDto.DisplayName;
                    operation.Description = operationDto.Description;
                    _operationRepository.Update(operation);
                }
            }

            // Delete obsolete identities
            foreach (string item in removedIdentities)
            {
                Operation operation = _operationRepository.GetAllList(x => x.Identity.Equals(item)).First();
                _operationRepository.Delete(operation);
            }
        }

        private void GetRoleTree(Role role, ref List<Role> allRoleTree)
        {
            if(role.ParentRole != null)
                GetRoleTree(role.ParentRole, ref allRoleTree);
            allRoleTree.Add(role);
        }

        #endregion

        #region Service for Role

        public List<RoleDto> GetAllRoles()
        {
            List<RoleDto> returnList = new List<RoleDto>();
            //List<Role> rootRoles = _roleRepository.GetAllList(x => x.IsDeleted == false && x.ParentRoleId == null).ToList();
            //int level = 0;
            //foreach(Role r in rootRoles){
            //    returnList.Add(new RoleDto(){
            //        Id = r.Id,
            //        RoleName = r.RoleName,
            //        Description = r.Description
            //    });
            //    GetRoleDtoTree(r, level, ref returnList);
            //}
            //returnList.ForEach(x => x.RoleName = (new string('-', x.Level * 8)) + x.RoleName);
            _roleRepository.GetAllList(x => x.IsDeleted == false).ForEach(x => returnList.Add(new RoleDto()
            {
                Id = x.Id,
                RoleName = x.RoleName,
                Description = x.Description,
                ParentRoleId = x.ParentRoleId,
                ParentRoleName = x.ParentRoleId == null ? "" : x.ParentRole.RoleName,
            }));
            return returnList;
        }

        private void GetRoleDtoTree(Role role, int level, ref List<RoleDto> roleDtoTree)
        {
            foreach (Role r in role.ChildRoles)
            {
                roleDtoTree.Add(new RoleDto()
                {
                    Id = r.Id,
                    RoleName = r.RoleName,
                    Description = r.Description,
                    ParentRoleId = role.Id,
                    ParentRoleName = role.RoleName,
                    Level = level + 1
                });
                GetRoleDtoTree(r, level + 1, ref roleDtoTree);
            }
        }

        public List<PermissionRoleDto> GetPermissionsOfRole(int roleId)
        {
            List<PermissionRoleDto> returnList = new List<PermissionRoleDto>();
            Role role = _roleRepository.Get(roleId);
            foreach (Core.Entities.Permission.Permission p in role.Permissions)
            {
                returnList.Add(new PermissionRoleDto()
                {
                    RoleId = role.Id,
                    PermissionId = p.Id,
                    IsAllow = true,
                    IsInherited = false
                });
            }
            ScanChildRoles(role, role, ref returnList);
            List<Core.Entities.Permission.Permission> permissions = _permissionRepository.GetAllList();
            foreach (Core.Entities.Permission.Permission p in permissions)
            {
                PermissionRoleDto checkItem = returnList.Where(x => x.RoleId == role.Id && x.PermissionId == p.Id)
                    .FirstOrDefault();
                if (checkItem == null)
                    returnList.Add(new PermissionRoleDto()
                    {
                        RoleId = role.Id,
                        PermissionId = p.Id,
                        IsAllow = false,
                        IsInherited = false
                    });
            }
            return returnList.OrderBy(x => x.PermissionId).ThenBy(x => x.RoleId).ToList();
        }

        public RoleDto GetRole(int roleId)
        {
            Role role = _roleRepository.Get(roleId);
            if (role.IsDeleted)
                return null;
            RoleDto roleDto = Mapper.Map<RoleDto>(role);
            roleDto.ParentRoleId = role.ParentRoleId;
            roleDto.ParentRoleName = (role.ParentRole != null) ? role.ParentRole.RoleName : "";
            return roleDto;
        }

        public void AddRole(RoleDto roleDto)
        {
            Role role = new Role();
            Mapper.Map<RoleDto, Role>(roleDto, role);

            int roleId = _roleRepository.InsertAndGetId(role);
        }

        public void UpdateRole(RoleDto roleDto)
        {
            Role role = _roleRepository.Get(roleDto.Id);
            _roleRepository.Update(Mapper.Map<RoleDto, Role>(roleDto, role));
        }

        public void DeleteRole(int roleId)
        {
            Role role = _roleRepository.Get(roleId);
            foreach (Role item in role.ChildRoles.ToList())
            {
                Role child = _roleRepository.Get(item.Id);
                child.ParentRoleId = role.ParentRoleId;
                _roleRepository.Update(child);
            }
            _roleRepository.Delete(role);
        }

        public void SaveRoleSecuritySchema(int roleId, List<PermissionRoleDto> permissionRoleDtos)
        {
            List<PermissionRoleDto> allowedList = permissionRoleDtos.Where(x => x.IsInherited == false && x.IsAllow == true).ToList();
            Role role = _roleRepository.Get(roleId);
            List<Core.Entities.Permission.Permission> permissions = _permissionRepository.GetAllList();
            var rolePermissions = role.Permissions;
            foreach (Core.Entities.Permission.Permission p in permissions)
            {
                PermissionRoleDto pr = allowedList.Where(x => x.PermissionId == p.Id && x.RoleId == role.Id).FirstOrDefault();
                if (pr != null && !rolePermissions.Contains(p))
                {
                    rolePermissions.Add(p);
                    continue;
                }
                if (pr == null && rolePermissions.Contains(p))
                {
                    rolePermissions.Remove(p);
                    continue;
                }
            }
            _roleRepository.Update(role);
        }

        #endregion
        
        #region Service for Permission

        public List<PermissionDto> GetAllPermissions()
        {
            List<PermissionDto> returnList = Mapper.Map<List<PermissionDto>>(_permissionRepository.GetAllList(x => x.IsDeleted == false));
            return returnList;
        }

        public PermissionDto GetPermission(int PermissionId)
        {
            Core.Entities.Permission.Permission permission = _permissionRepository.Get(PermissionId);
            if (permission.IsDeleted)
                return null;
            PermissionDto permissionDto = Mapper.Map<PermissionDto>(permission);
            return permissionDto;
        }

        public void AddPermission(PermissionDto permissionDto)
        {
            Core.Entities.Permission.Permission permission = new Core.Entities.Permission.Permission();
            Mapper.Map<PermissionDto, Core.Entities.Permission.Permission>(permissionDto, permission);

            int PermissionId = _permissionRepository.InsertAndGetId(permission);
        }

        public void UpdatePermission(PermissionDto permissionDto)
        {
            Core.Entities.Permission.Permission permission = _permissionRepository.Get(permissionDto.Id);
            _permissionRepository.Update(Mapper.Map<PermissionDto, Core.Entities.Permission.Permission>(permissionDto, permission));
        }

        public void DeletePermission(int permissionId)
        {
            Core.Entities.Permission.Permission permission = _permissionRepository.Get(permissionId);
            permission.Operations.ToList().ForEach(x => RemoveOperationAsociation(x.Id));
            permission.Roles.ToList().ForEach(x =>
            {
                Role role = _roleRepository.Get(x.Id);
                role.Permissions.Remove(permission);
                _roleRepository.Update(role);
            });
            _permissionRepository.Delete(permission);
        }

        public List<OperationDto> GetOperationsOfPermission(int permissionId)
        {
            List<OperationDto> returnList = Mapper.Map<List<OperationDto>>(_operationRepository.GetAllList(
                x => x.PermissionId == permissionId));
            return returnList;
        }

        public void RemoveOperationAsociation(int operationId)
        {
            Operation operation = _operationRepository.Get(operationId);
            operation.PermissionId = null;
            _operationRepository.Update(operation);
        }

        #endregion

        #region Service for Operation

        public List<OperationDto> GetAllOperations()
        {
            List<OperationDto> returnList = Mapper.Map<List<OperationDto>>(_operationRepository.GetAllList());
            return returnList;
        }

        public List<OperationDto> GetAssignedOperations()
        {
            List<OperationDto> returnList = Mapper.Map<List<OperationDto>>(_operationRepository.GetAllList(
                x => x.PermissionId > 0));
            return returnList;
        }

        public List<OperationDto> GetAvailableOperations()
        {
            List<OperationDto> returnList = Mapper.Map<List<OperationDto>>(
                _operationRepository.GetAllList());
            return returnList.Where(x => x.PermissionId == null).ToList();
        }

        public OperationDto GetOperation(int operationId)
        {
            OperationDto operationDto = Mapper.Map<OperationDto>(_operationRepository.Get(operationId));
            return operationDto;
        }
        
        public void GroupOperation(OperationDto operationDto)
        {
            Operation operation = _operationRepository.Get(operationDto.Id);
            operation.PermissionId = operationDto.PermissionId;
            _operationRepository.Update(operation);
        }

        #endregion

        public List<PermissionRoleDto> GetPermissionRoles()
        {
            List<PermissionRoleDto> returnList = new List<PermissionRoleDto>();
            List<Role> roles = _roleRepository.GetAllList(x => x.IsDeleted == false);
            foreach (Role r in roles)
            {
                foreach (Core.Entities.Permission.Permission p in r.Permissions)
                {
                    returnList.Add(new PermissionRoleDto()
                    {
                        RoleId = r.Id,
                        PermissionId = p.Id,
                        IsAllow = true,
                        IsInherited = false
                    });
                }
                ScanChildRoles(r, r, ref returnList);
            }
            List<Core.Entities.Permission.Permission> permissions = _permissionRepository.GetAllList();
            foreach (Role r in roles)
            {
                foreach (Core.Entities.Permission.Permission p in permissions)
                {
                    PermissionRoleDto checkItem = returnList.Where(x => x.RoleId == r.Id && x.PermissionId == p.Id).FirstOrDefault();
                    if (checkItem == null)
                        returnList.Add(new PermissionRoleDto()
                        {
                            RoleId = r.Id,
                            PermissionId = p.Id,
                            IsAllow = false,
                            IsInherited = false
                        });
                }
            }
            return returnList.OrderBy(x => x.PermissionId).ThenBy(x => x.RoleId).ToList();
        }

        private void ScanChildRoles(Role originalRole, Role role, ref List<PermissionRoleDto> returnList)
        {
            foreach (Role r in role.ChildRoles)
            {
                foreach (Core.Entities.Permission.Permission p in r.Permissions)
                {
                    var duplicated = returnList.Where(x => x.RoleId == originalRole.Id &&
                        x.PermissionId == p.Id).FirstOrDefault();
                    if(duplicated == null)
                        returnList.Add(new PermissionRoleDto()
                        {
                            RoleId = originalRole.Id,
                            PermissionId = p.Id,
                            IsAllow = true,
                            IsInherited = true,
                            InheritedFrom = r.RoleName
                        });
                    else
                    {
                        returnList[returnList.IndexOf(duplicated)].IsAllow = true;
                        returnList[returnList.IndexOf(duplicated)].IsInherited = true;
                        returnList[returnList.IndexOf(duplicated)].InheritedFrom = r.RoleName;
                    }
                }
                ScanChildRoles(originalRole, r, ref returnList);
            }
        }

        public void SaveSecuritySchema(List<PermissionRoleDto> permissionRoleDtos)
        {
            List<PermissionRoleDto> allowedList = permissionRoleDtos.Where(x => x.IsInherited == false && x.IsAllow == true).ToList();
            List<Role> roles = _roleRepository.GetAllList(x => x.IsDeleted == false);
            List<Core.Entities.Permission.Permission> permissions = _permissionRepository.GetAllList();
            foreach (Role r in roles)
            {
                var rolePermissions = r.Permissions;
                foreach (Core.Entities.Permission.Permission p in permissions)
                {
                    PermissionRoleDto pr = allowedList.Where(x => x.PermissionId == p.Id && x.RoleId == r.Id).FirstOrDefault();
                    if (pr != null && !rolePermissions.Contains(p))
                    {
                        rolePermissions.Add(p);
                        continue;
                    }
                    if (pr == null && rolePermissions.Contains(p))
                    {
                        rolePermissions.Remove(p);
                        continue;
                    }
                }
                _roleRepository.Update(r);
            }
        }
    }
}
