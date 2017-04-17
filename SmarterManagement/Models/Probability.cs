using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace SmarterManagement.Models
{
    public class Probability
    {
        private String _name;
        private double _value;

        public Probability() { }

        public Probability(string _name, double _value)
        {
            Name = _name;
            Value = _value;
        }

        public Probability(SqlDataReader result)
        {
            if (result.HasRows)
            {
                Name = result["name"].ToString();
                Value = double.Parse(result["value"].ToString());
            }
        }

        public String Name
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