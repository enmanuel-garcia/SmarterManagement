using SmarterManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SmarterManagement.Controllers
{
    public class ProjectController : Controller
    {
        
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public string Finder(string name)
        {

            Manager man = Manager.getInstance();
            string result = man.projectFind(name);
            return result;

        }

        [HttpPost]
        public string Get(int id)
        {

            Manager man = Manager.getInstance();
            string result = man.projectGet(id);
            return result;

        }

        [HttpPost]
        public bool Add(string name, string startDate)
        {

            Manager man = Manager.getInstance();
            bool result = man.projectAdd(name, startDate);
            return result;

        }

        [HttpPost]
        public bool Set(int id, string name, string startDate)
        {

            Manager man = Manager.getInstance();
            bool result = man.projectSet(id, name, startDate);
            return result;

        }

        [HttpPost]
        public bool Delete(int id)
        {

            Manager man = Manager.getInstance();
            bool result = man.projectDelete(id);
            return result;

        }

        [HttpPost]
        public bool Exist(string name, int id = 0)
        {

            Manager man = Manager.getInstance();
            bool result = man.projectExist(name, id);
            return result;

        }

    }
}