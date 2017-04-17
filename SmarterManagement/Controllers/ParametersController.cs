using Newtonsoft.Json;
using SmarterManagement.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SmarterManagement.Controllers
{
    public class ParametersController : Controller
    {
        public ActionResult Index()
        {
            Manager man = Manager.getInstance();
            return View(man.getMatrixParameters());
        }

        [HttpGet]
        public string GetMatrixParameters()
        {
            Manager man = Manager.getInstance();
            return JsonConvert.SerializeObject(man.getMatrixParameters());
        }

        [HttpPost]
        public bool UpdateMatrix(string matrix)
        {
            Manager man = Manager.getInstance();
            return man.updateMatrix(JsonConvert.DeserializeObject<Matrix>(matrix));
        }
    }
}

public class JsonFilter : ActionFilterAttribute
{
    public string Param { get; set; }
    public Type JsonDataType { get; set; }
    public override void OnActionExecuting(ActionExecutingContext filterContext)
    {
        if (filterContext.HttpContext.Request.ContentType.Contains("application/json"))
        {
            string inputContent;
            using (var sr = new StreamReader(filterContext.HttpContext.Request.InputStream))
            {
                inputContent = sr.ReadToEnd();
            }
            var result = JsonConvert.DeserializeObject(inputContent, JsonDataType);
            filterContext.ActionParameters[Param] = result;
        }
    }
}
