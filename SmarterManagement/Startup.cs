using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(SmarterManagement.Startup))]
namespace SmarterManagement
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
