using SmarterManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SmarterManagement.Controllers
{
    public class RiskController : Controller
    {
        
        public ActionResult Index()
        {
            Manager man = Manager.getInstance();
            return View(man.getMatrixParameters());
        }

        [HttpPost]
        public string Finder(int projectId)
        {

            Manager man = Manager.getInstance();
            string result = man.riskFind(projectId);
            return result;

        }

        [HttpPost]
        public string Get(int id)
        {

            Manager man = Manager.getInstance();
            string result = man.riskGet(id);
            return result;

        }

        [HttpPost]
        public bool Add(string name, string description, decimal probability, int impact, decimal priority, int projectId)
        {

            Manager man = Manager.getInstance();
            bool result = man.riskAdd(name, description, probability, impact, priority, projectId);
            return result;

        }

        [HttpPost]
        public bool Set(int id, string name, string description, decimal probability, int impact, decimal priority)
        {

            Manager man = Manager.getInstance();
            bool result = man.riskSet(id, name, description, probability, impact, priority);
            return result;

        }

        [HttpPost]
        public bool Delete(int id)
        {

            Manager man = Manager.getInstance();
            bool result = man.riskDelete(id);
            return result;

        }

        [HttpPost]
        public bool Exist(string name, int id = 0)
        {

            Manager man = Manager.getInstance();
            bool result = man.riskExist(name, id);
            return result;

        }

    }
}