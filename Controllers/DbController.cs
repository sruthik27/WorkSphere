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
    
    //To check if user already exists or new user
    [HttpPost("checkgoogleuserexists")]
    public async Task<IActionResult> CheckUser([FromBody] string userId)
    {
        var found = _context.Users.Find(userId);
        if (found!=null)
        {
            var response = new { exists = true, found.role };
            return Ok(response);
        }
        return Ok(new {exists = false});
    }

    //To add new user to db
    [HttpPost("adduser")]
    public async Task<IActionResult> AddUser([FromBody] User user)
    {
        if (user.user_id == user.password)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok(new { done = true });
        }
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.password);
        var newUser = new User
            {
                email = user.email,
                password = hashedPassword,
                role = user.role
            };
        _context.Users.Add(newUser);
        _context.SaveChanges();
        return Ok(new { done = true});
    }

    //To authenticate and login a user
    public class LoginCred
    {
        public string useremail { get; set; }
        public string userpassword { get; set; }
    }

    [Route("login")]
    [HttpPost]
    public async Task<IActionResult> Login([FromBody] LoginCred cred)
    {
        // Get the WLogin object for the given email.
        var user = _context.Users.FirstOrDefault(u => u.email == cred.useremail);
        // If the User object is null, then the user does not exist.
        if (user == null)
        {
            return NotFound();
        }
        // Verify the password.
        bool isPasswordValid = BCrypt.Net.BCrypt.Verify(cred.userpassword, user.password);

        // If the password is not valid, then the user is not authorized.
        if (!isPasswordValid)
        {
            return Unauthorized();
        }

        // Return the worker ID.
        return Ok(new {exists=true,id=user.user_id});
    }

}