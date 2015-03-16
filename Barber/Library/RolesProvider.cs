using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Web;
using System.Web.Security;
using Barber.Models;

namespace Barber.Library
{
    public class RolesProvider : RoleProvider
    {
        private BarberModel db = Utils.Model;

        public RolesProvider()
        {
            if (String.IsNullOrWhiteSpace(this.ApplicationName)) this.ApplicationName = "barber";
        }
        public override void Initialize(string name, NameValueCollection config)
        {
            base.Initialize(name, config);
            this.ApplicationName = config["applicationName"];
            if (String.IsNullOrWhiteSpace(this.ApplicationName)) this.ApplicationName = "barber";
        }

        public override void AddUsersToRoles(string[] usernames, string[] roleNames)
        {
            throw new NotImplementedException();
        }

        public bool AddUserToRole(string userName, string roleName)
        {

            if (this.UserRoleExists(roleName, userName) || !this.RoleExists(roleName)) return false;

            var userInRole = new UsersInRole()
            {
                ApplicationName = this.ApplicationName,
                UserId = userName,
                RoleName = roleName
            };
            db.UsersInRoles.InsertOnSubmit(userInRole);
            db.SubmitChanges();
            return true;
        }

        public override string ApplicationName { get; set; }

        public override void CreateRole(string roleName)
        {
            var role = new Role()
            {
                RoleName = roleName,
                ApplicationName = this.ApplicationName
            };

            db.Roles.InsertOnSubmit(role);
            db.SubmitChanges();
        }

        public override bool DeleteRole(string roleName, bool throwOnPopulatedRole)
        {
            var role = db.Roles.FirstOrDefault(r => r.RoleName == roleName);
            if (role == null) return false;
            db.Roles.DeleteOnSubmit(role);
            db.SubmitChanges();
            return true;
        }

        public override string[] FindUsersInRole(string roleName, string usernameToMatch)
        {
            return db.UsersInRoles.Where(
                ur =>
                    ur.RoleName == roleName && ur.UserId.Contains(usernameToMatch)).Select(r => r.UserId).ToArray();
        }

        public override string[] GetAllRoles()
        {
            return db.Roles.Select(r => r.RoleName).ToArray();
        }

        public override string[] GetRolesForUser(string username)
        {
            return
                db.UsersInRoles.Where(ur => ur.UserId == username)
                    .Select(ur => ur.RoleName)
                    .ToArray();

        }

        public override string[] GetUsersInRole(string roleName)
        {
            return
                db.UsersInRoles.Where(ur => ur.RoleName == roleName)
                    .Select(ur => ur.UserId)
                    .ToArray();
        }

        public override bool IsUserInRole(string username, string roleName)
        {
            return
                db.UsersInRoles.Any(ur => ur.RoleName == roleName && ur.UserId == username);
        }

        public override void RemoveUsersFromRoles(string[] usernames, string[] roleNames)
        {
            throw new NotImplementedException();
        }

        public override bool RoleExists(string roleName)
        {
            return db.Roles.Any(r => r.RoleName == roleName);
        }
        public bool UserRoleExists(string roleName, string userName)
        {
            return db.UsersInRoles.Any(r => r.RoleName == roleName && r.UserId == userName);
        }
    }
}