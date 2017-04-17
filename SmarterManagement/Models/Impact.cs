using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace SmarterManagement.Models
{
    public class Impact
    {
        private string _name;
        private double _value;

        public Impact() { }

        public Impact(string _name, double _value)
        {
            Name = _name;
            Value = _value;
        }

        public Impact(SqlDataReader result)
        {
            if (result.HasRows)
            {
                Name = result["name"].ToString();
                Value = double.Parse(result["value"].ToString());
            }
        }

        public string Name
        {
            get
            {
                return _name;
            }

            set
            {
                _name = value;
            }
        }

        public double Value
        {
            get
            {
                return _value;
            }

            set
            {
                _value = value;
            }
        }
    }
}