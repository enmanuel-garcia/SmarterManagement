using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace SmarterManagement.Models
{
    public class Manager
    {

        private static Manager man;

        private Manager() { }

        public static Manager getInstance()
        {

            if(man == null)
            {
                man = new Manager();
            }
            return man;

        }

        #region project

        public string projectFind(string name)
        {

            List<Project> lst = new List<Project>();
            string sql = "SP_FindProject '" + name + "'";
            Dal dal = new Dal();
            SqlDataReader result = dal.ExecuteQuery(sql, System.Data.CommandType.Text);
            while (result.Read())
            {
                lst.Add(new Project(result));
            }
            dal.close();
            return JsonConvert.SerializeObject(lst);

        }

        public string projectGet(int id)
        {

            Project pro = new Project(id);
            return JsonConvert.SerializeObject(pro);

        }

        public bool projectAdd(string name, string startDate)
        {

            bool result;
            try
            {
                DateTime dtStart = Convert.ToDateTime(startDate);
                Project pro = new Project();
                pro.name = name;
                pro.startDate = dtStart;
                pro.save();
                result = true;
            }
            catch (Exception ex)
            {
                result = false;
            }
            return result;

        }

        public bool projectSet(int id, string name, string startDate)
        {

            bool result;
            try
            {
                DateTime dtStart = Convert.ToDateTime(startDate);
                Project pro = new Project(id);
                pro.name = name;
                pro.startDate = dtStart;
                pro.save();
                result = true;
            }
            catch (Exception ex)
            {
                result = false;
            }
            return result;

        }

        public bool projectDelete(int id)
        {

            bool result;
            try
            {
                Project pro = new Project(id);
                pro.delete();
                result = true;
            }
            catch (Exception ex)
            {
                result = false;
            }
            return result;

        }

        public bool projectExist(string name, int id)
        {

            Dal dal = new Dal();
            string sql = "SP_ExistProject '" + name + "', " + id;
            SqlDataReader result = dal.ExecuteQuery(sql, System.Data.CommandType.Text);
            bool exist = false;
            while (result.Read())
            {
                exist = int.Parse(result["exist"].ToString()) > 0;
            }
            dal.close();
            return exist;

        }

        public string projectGetForDropDownList()
        {

            Dal dal = new Dal();
            List<Project> lst = new List<Project>();
            string sql = "SP_FindProject ''";
            SqlDataReader result = dal.ExecuteQuery(sql, System.Data.CommandType.Text);
            while (result.Read())
            {
                lst.Add(new Project(result, true));
            }
            dal.close();
            return JsonConvert.SerializeObject(lst);

        }

        public string riskGetForDropDownList(int idProject)
        {

            Dal dal = new Dal();
            List<Risk> lst = new List<Risk>();
            string sql = "SP_FindRisk " + idProject;
            SqlDataReader result = dal.ExecuteQuery(sql, System.Data.CommandType.Text);
            while (result.Read())
            {
                lst.Add(new Risk(result, true));
            }
            dal.close();
            return JsonConvert.SerializeObject(lst);

        }

        #endregion

        #region risk

        public string riskFind(int id)
        {

            Dal dal = new Dal();
            List<Risk> lst = new List<Risk>();
            string sql = "SP_FindRisk '" + id + "'";
            SqlDataReader result = dal.ExecuteQuery(sql, System.Data.CommandType.Text);
            while (result.Read())
            {
                lst.Add(new Risk(result));
            }
            dal.close();
            return JsonConvert.SerializeObject(lst);

        }

        public string riskGet(int id)
        {

            Risk pro = new Risk(id);
            return JsonConvert.SerializeObject(pro);

        }

        public bool riskAdd(string name, string description, decimal probability, int impact, decimal priority, int projectId)
        {

            bool result;
            try
            {
                Risk pro = new Risk();
                pro.name = name;
                pro.description = description;
                pro.probability = probability;
                pro.impact = impact;
                pro.priority = priority;
                pro.project = projectId;
                pro.save();
                result = true;
            }
            catch (Exception ex)
            {
                result = false;
            }
            return result;

        }

        public bool riskSet(int id, string name, string description, decimal probability, int impact, decimal priority)
        {

            bool result;
            try
            {
                Risk pro = new Risk(id);
                pro.name = name;
                pro.description = description;
                pro.probability = probability;
                pro.impact = impact;
                pro.priority = priority;
                pro.save();
                result = true;
            }
            catch (Exception ex)
            {
                result = false;
            }
            return result;

        }

        public bool riskDelete(int id)
        {

            bool result;
            try
            {
                Risk pro = new Risk(id);
                pro.delete();
                result = true;
            }
            catch (Exception ex)
            {
                result = false;
            }
            return result;

        }

        public bool riskExist(string name, int id)
        {

            Dal dal = new Dal();
            string sql = "SP_ExistRisk '" + name + "', " + id;
            SqlDataReader result = dal.ExecuteQuery(sql, System.Data.CommandType.Text);
            bool exist = false;
            while (result.Read())
            {
                exist = int.Parse(result["exist"].ToString()) > 0;
            }
            dal.close();
            return exist;

        }

        #endregion

        #region parameters
        public Matrix getMatrixParameters()
        {
            Dal dal = new Dal();
            string sql;
            SqlDataReader result;

            List<Probability> probabilityList = new List<Probability>();
            sql = "select * from T_Probability where idMatrix = 1";
            result = dal.ExecuteQuery(sql, System.Data.CommandType.Text);
            while (result.Read())
            {
                probabilityList.Add(new Probability(result));
            }

            List<Impact> impactList = new List<Impact>();
            sql = "select * from T_Impact where idMatrix = 1";
            result = dal.ExecuteQuery(sql, System.Data.CommandType.Text);
            while (result.Read())
            {
                impactList.Add(new Impact(result));
            }

            Matrix matrix = new Matrix();
            sql = "select * from T_Matrix where id = 1";
            result = dal.ExecuteQuery(sql, System.Data.CommandType.Text);
            while (result.Read())
            {
                matrix = new Matrix(result);
            }

            dal.close();

            matrix.Probabilities = probabilityList;
            matrix.Impacts = impactList;

            return matrix;
        }

        public bool updateMatrix(Matrix matrix)
        {
            try
            {
                Dal dal = new Dal();
                string sql;

                sql = "update T_Matrix set lowLimit = " + matrix.Limits[0].Value + 
                        ", midLimit = " + matrix.Limits[1].Value + "; ";

                sql += "delete from T_Probability where idMatrix = 1; ";
                foreach (Probability probability in matrix.Probabilities)
                {
                    sql += "insert into T_Probability values (1, '" + probability.Name + "', " + probability.Value + "); ";
                }

                sql += "delete from T_Impact where idMatrix = 1; ";
                foreach (Impact impact in matrix.Impacts)
                {
                    sql += "insert into T_Impact values (1, '" + impact.Name + "', " + impact.Value + "); ";
                }

                dal.ExecuteQuery(sql, System.Data.CommandType.Text);

                dal.close();

                return true;
            }
            catch
            {
                return false;
            }
        }
        #endregion
    }

}