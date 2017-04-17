using SmarterManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using System.Data;
using System.Data.OleDb;
namespace SmarterManagement.Controllers
{
    public class ActivityController : Controller
    {

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult EVM(EVMModel data)
        {
            object temp = TempData["byWeek"];
            ViewBag.byWeek = temp;
            TempData["byWeek"] = temp;
            return View(data);
        }
        private EVMModel ProcessEVM(string fileName)
        {

            string connectionString = string.Format("Provider=Microsoft.Jet.OLEDB.4.0; data source={0}; Extended Properties= Excel 8.0;", fileName);
            OleDbConnection conn = new OleDbConnection(connectionString);
            conn.Open();

            var adapter = new OleDbDataAdapter("select * from [Planeation$]", conn);
            var ds = new DataSet();
            //Fill the planeation data
            adapter.Fill(ds, "planeation");

            //Fill the Real data
            adapter.SelectCommand = new OleDbCommand("select * from [Real$]", conn);
            adapter.Fill(ds, "real");

            //Fill the Config
            adapter.SelectCommand = new OleDbCommand("select * from [Config$]", conn);
            adapter.Fill(ds, "config");
            conn.Close();

            var totalHours = ds.Tables["config"].Rows[0][1].ToString();
            var weeks = Int32.Parse(ds.Tables["config"].Rows[1][1].ToString());
            var taskCost = Double.Parse(ds.Tables["config"].Rows[2][1].ToString());

            DataTable planeation = ds.Tables["planeation"];
            int[] weeksHours = new int[planeation.Columns.Count];
            Double totalHoursPlaned = 0;
            for (int col = 1; col < planeation.Columns.Count; col++)
            {
                int sumCols = 0;
                for (int row = 0; row < planeation.Rows.Count; row++)
                {
                   sumCols += Int32.Parse(planeation.Rows[row][col].ToString());
                }

                weeksHours[col] = sumCols;
                totalHoursPlaned += sumCols;
            }

            //Budget
            Double planedValue = totalHoursPlaned * taskCost;
            DataTable real = ds.Tables["real"];
            int[] realHours = new int[real.Columns.Count];
            Double totalRealHours = 0;
            for(int col =1; col < real.Columns.Count; col++)
            {
                int sumCols = 0;
                for(int row =0; row< real.Rows.Count;row++)
                {
                    sumCols += Int32.Parse(real.Rows[row][col].ToString());
                }
                realHours[col] = sumCols;
                totalRealHours += sumCols;
            }

            EVMModel model = new EVMModel();
          
            Double ac = totalRealHours * taskCost;
            Double ev = planedValue * (totalRealHours / totalHoursPlaned);
            Double sv = ev - planedValue;
            Double cv = ev - ac;
            Double spi = ev / planedValue;
            Double cpi = ev / ac;

            model.pv = planedValue;
            model.ac = ac;
            model.ev = ev;
            model.sc = sv;
            model.cv = cv;
            model.spi = spi;
            model.cpi = cpi;

            List<EVMModel> byWeek = new List<EVMModel>();
            for (int col = 1; col < planeation.Columns.Count; col++)
            {
                int hoursPlanedWeek = 0;
                int realHoursWeek = 0;
                for (int row = 0; row < planeation.Rows.Count; row++)
                {
                    int hoursPlanedTemp = 0;
                    int realHoursTemp = 0;
                    Int32.TryParse(planeation.Rows[row][col].ToString(), out hoursPlanedTemp);
                    Int32.TryParse(real.Rows[row][col].ToString(), out realHoursTemp);
                    hoursPlanedWeek += hoursPlanedTemp;
                    realHoursWeek += realHoursTemp;
                }
                Double planedValueTemp = hoursPlanedWeek * taskCost;
                EVMModel temp = new EVMModel();
                temp.ac = hoursPlanedWeek * taskCost;
                temp.ev = planedValueTemp * (realHoursWeek / hoursPlanedWeek);
                temp.sc = temp.ev - planedValueTemp;
                temp.cv = temp.ev - temp.ac;
                temp.spi = temp.ev / planedValueTemp;
                temp.cpi = temp.ev / temp.ac;
                byWeek.Add(temp);
            }
            TempData["byWeek"] = byWeek;
            return model;

        }
        
        [HttpPost]
        public ActionResult UploadFile(HttpPostedFileBase file)
        {
            EVMModel data = null;
            if (file.ContentLength > 0)
            {
                var fileName = Path.GetFileName(file.FileName);
                var path = Path.Combine(Server.MapPath("~/App_Data/Uploads"), fileName);
                file.SaveAs(path);

                //Process the EVM
                data = ProcessEVM(path);

            }

            return RedirectToAction("EVM", data);
        }
    }
}