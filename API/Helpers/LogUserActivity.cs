using System;
using System.Collections.Generic;
using System.Linq;
// using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using System.Xml.Schema;
using Microsoft.AspNetCore.Mvc.Filters;
using API.Data;
using API.Extensions;
using Microsoft.EntityFrameworkCore;




namespace API.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context,ActionExecutionDelegate next)
        {
            var resultContext = await next();

            if(context.HttpContext.User.Identity.IsAuthenticated!=true) return;

            var memberId = resultContext.HttpContext.User.GetMemberId();
            if (memberId == null) return;

            var dbContext = resultContext.HttpContext.RequestServices.GetRequiredService<AppDbContext>();

            await dbContext.Members
                .Where(m => m.Id==memberId)
                .ExecuteUpdateAsync(setters=>setters.SetProperty(x=>x.LastActive, DateTime.UtcNow));
        }
        
    }
}