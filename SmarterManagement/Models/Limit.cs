using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace SmarterManagement.Models
{
    public class Limit
    {
        private string _name;
        private double _value;

        public Limit() { }

        public Limit(string name, double value)
        {
            Name = name;
            Value = value;
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