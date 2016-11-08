using Core.Entities.Permission;
using Core.Services.Permission.Dtos;
using System.Collections.Generic;

namespace Core.Services.Permission
{
    public interface IPermissionService: IApplicationService
    {
        bool AuthorizePermission(string userRole, OperationDto operationDto);

        void ScanOperations(List<OperationDto> operations);

        List<PermissionRoleDto> GetPermissionRoles();

        void SaveSecuritySchema(List<PermissionRoleDto> permissionRoleDtos);

        ////
        // Service for Role
        ////
        List<RoleDto> GetAllRoles();
        RoleDto GetRole(int roleId);
        void AddRole(RoleDto roleDto);
        void UpdateRole(RoleDto roleDto);
        void DeleteRole(int roleId);
        List<PermissionRoleDto> GetPermissionsOfRole(int roleId);
        void SaveRoleSecuritySchema(int roleId, List<PermissionRoleDto> permissionRoleDtos);

        ////
        // Service for Permission
        ////
        List<PermissionDto> GetAllPermissions();
        PermissionDto GetPermission(int permissionId);
        void AddPermission(PermissionDto permissionDto);
        void UpdatePermission(PermissionDto permissionDto);
        void DeletePermission(int permissionId);
        List<OperationDto> GetOperationsOfPermission(int permissionId);
        void RemoveOperationAsociation(int operationId);

        ////
        // Service for Operations
        ////
        List<OperationDto> GetAllOperations();
        List<OperationDto> GetAvailableOperations();
        List<OperationDto> GetAssignedOperations();
        OperationDto GetOperation(int operationId);
        void GroupOperation(OperationDto operationDto);
    }
}
