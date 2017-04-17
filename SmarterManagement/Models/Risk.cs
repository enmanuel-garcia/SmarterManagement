using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace SmarterManagement.Models
{
    public class Risk
    {

        private int
            _id,
            _project,
            _impact;
        private string
            _name,
            _description;
        private decimal
            _probability,
            _priority;
        private bool
            _isNew;

        public int id
        {
            get { return _id; }
        }

        public int project
        {
            get { return _project; }
            set { _project = value; }
        }

        public int impact
        {
            get { return _impact; }
            set { _impact = value; }
        }

        public string name
        {
            get { return _name; }
            set { _name = value; }
        }

        public string description
        {
            get { return _description; }
            set { _description = value; }
        }

        public decimal probability
        {
            get { return _probability; }
            set { _probability = value; }
        }
        
        public decimal priority
        {
            get { return _priority; }
            set { _priority = value; }
        }

        public bool isNew
        {
            get { return _isNew; }
            set { _isNew = value; }
        }

        public Risk()
        {

            _isNew = true;

        }

        public Risk(int pid)
        {

            Dal dal = new Dal();
            string sql = "SP_GetRisk " + pid;
            SqlDataReader result = dal.ExecuteQuery(sql, System.Data.CommandType.Text);
            if (result.Read())
            {
                _id = pid;
                name = result["rkname"].ToString();
                description = result["rkdescription"].ToString();
                probability = decimal.Parse(result["rkprobability"].ToString());
                impact = int.Parse(result["rkimpact"].ToString());
                priority = decimal.Parse(result["rkpriority"].ToString());
                _isNew = false;
                _project = int.Parse(result["rkproject"].ToString());
            }
            dal.close();

        }

        public Risk(SqlDataReader result, bool isForDropDownList = false)
        {

            if (result.HasRows)
            {

                _id = int.Parse(result["rkid"].ToString());
                name = result["rkname"].ToString();
                if (!isForDropDownList)
                {
                    description = result["rkdescription"].ToString();
                    probability = decimal.Parse(result["rkprobability"].ToString());
                    impact = int.Parse(result["rkimpact"].ToString());
                    project = result["rkProject"] != null ? int.Parse(result["rkProject"].ToString()) : 0;
                    _isNew = false;
                    //Calculate Risk Priority
                    priority = probability * impact;

                }
            }

        }

        public void save()
        {
            try
            {
                Dal dal = new Dal();
                string sql = string.Empty;
                if (isNew)
                {
                    sql = "SP_AddRisk '" + name + "', '" + description + "', " + probability + ", " + impact + ", " + priority + ", " + project;
                    SqlDataReader result = dal.ExecuteQuery(sql, System.Data.CommandType.Text);
                    if (result.Read())
                    {
                        _id = int.Parse(result["id"].ToString());
                        _isNew = false;
                    }
                    dal.close();
                }
                else
                {
                    sql = "SP_SetRisk " + id + ", '" + name + "', '" + description + "', " + probability + ", " + impact + ", " + priority;
                    dal.ExecuteScalar(sql, System.Data.CommandType.Text);
                    dal.close();
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error has occurred.");
            }

        }

        public void delete()
        {

            try
            {
                Dal dal = new Dal();
                string sql = string.Empty;
                sql = "SP_DeleteRisk " + id;
                dal.ExecuteScalar(sql, System.Data.CommandType.Text);
                dal.close();
            }
            catch (Exception ex)
            {
                throw new Exception("Error has occurred.");
            }

        }

    }
}