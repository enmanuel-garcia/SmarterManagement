using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace SmarterManagement.Models
{
    public class Matrix
    {
        private List<Probability> probabilities;
        private List<Impact> impacts;
        private List<Limit> limits;

        public Matrix() { }

        public Matrix(SqlDataReader result)
        {
            Limits = new List<Limit>();

            if (result.HasRows)
            {
                Limits.Add(new Limit("low", double.Parse(result["lowLimit"].ToString())));
                Limits.Add(new Limit("mid", double.Parse(result["midLimit"].ToString())));
            }
        }

        public List<Probability> Probabilities
        {
            get
            {
                return probabilities;
            }

            set
            {
                probabilities = value;
            }
        }

        public List<Impact> Impacts
        {
            get
            {
                return impacts;
            }

            set
            {
                impacts = value;
            }
        }

        public List<Limit> Limits
        {
            get
            {
                return limits;
            }

            set
            {
                limits = value;
            }
        }
    }
}