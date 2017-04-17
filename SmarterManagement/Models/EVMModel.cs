using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SmarterManagement.Models
{
    public class EVMModel
    {
        public Double pv { get; set; }
        public Double ac { get; set; }
        public Double ev { get; set; }
        public Double sc { get; set; }
        public Double cv { get; set; }
        public Double spi { get; set; }
        public Double cpi { get; set; }

        public static string cast(double val)
        {

            string result = string.Empty;
            if(val == 0)
            {
                result = "0";
            }
            else
            {
                result = val.ToString("#.##");
            }
            return result;

        }

    }
}