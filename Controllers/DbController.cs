using Microsoft.EntityFrameworkCore;
using WorkManagement.Db;
using WorkManagement.Models;
using Microsoft.AspNetCore.Mvc;
using MailKit.Net.Smtp;
using System.IO;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using ClosedXML.Excel;
using MailKit.Security;
using MimeKit;
using Newtonsoft.Json.Linq;

namespace WorkManagement.Controllers;

[ApiController]
[Route("[controller]")]
public class DbController : ControllerBase
{
    private readonly DefaultDbContext _context;

    // Specify the TimeZoneId for IST (Indian Standard Time)
    static string istTimeZoneId = "India Standard Time";

    // Use TimeZoneInfo to convert from UTC to IST
    TimeZoneInfo istTimeZone = TimeZoneInfo.FindSystemTimeZoneById(istTimeZoneId);

    public DbController(DefaultDbContext context)
    {
        _context = context;
    }
    
    
    [HttpPost("checkuserexists")]
    public async Task<IActionResult> CheckUser([FromBody] int userId){
        return Ok(new {found = _context.Users.Find(userId)});
    }

    [HttpPost("adduser")]
    public async Task<IActionResult> AddUser([FromBody] User user)
    {
        if (user==null)
        {
            return BadRequest("Invalid user data.");
        }
        _context.Add(user);
        _context.SaveChanges();
        return Ok(new { message = "User added succesfully" });
    }
}