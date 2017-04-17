using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace SmarterManagement.Models
{

    public class Project
    {

        private int _id;
        private string _name;
        private DateTime _startDate;
        private bool _isNew;

        public int id
        {
            get { return _id; }
        }

        public string name
        {
            get { return _name; }
            set { _name = value; }
        }

        public DateTime startDate
        {
            get { return _startDate; }
            set { _startDate = value; }
        }

        public bool isNew
        {
            get { return _isNew; }
            set { _isNew = value; }
        }

        public Project()
        {

            _isNew = true;
            startDate = DateTime.Now;

        }

        public Project(int pid)
        {

            Dal dal = new Dal();
            string sql = "SP_GetProject " + pid;
            SqlDataReader result = dal.ExecuteQuery(sql, System.Data.CommandType.Text);
            if (result.Read())
            {
                _id = pid;
                name = result["name"].ToString();
                startDate = Convert.ToDateTime(result["startDate"].ToString());
                _isNew = false;
            }
            dal.close();

        }

        public Project(SqlDataReader result, bool isForDropDownList = false)
        {

            if (result.HasRows)
            {
                _id = int.Parse(result["id"].ToString());
                name = result["name"].ToString();
                if (!isForDropDownList)
                {
                    startDate = Convert.ToDateTime(result["startDate"].ToString());
                    _isNew = false;
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
                    sql = "SP_AddProject '" + name + "', '" + startDate.ToShortDateString() + "'";
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
                    sql = "SP_SetProject " + id + ", '" + name + "', '" + startDate.ToShortDateString() + "'";
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
                sql = "SP_DeleteProject " + id;
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