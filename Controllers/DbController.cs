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
using StackExchange.Redis;
using WorkManagement.Controllers.ControllerUtils;

namespace WorkManagement.Controllers;

[ApiController]
[Route("[controller]")]
public class DbController : ControllerBase
{
    private readonly DefaultDbContext _context;
    static readonly ConnectionMultiplexer redis = ConnectionMultiplexer.Connect("redis-14222.c330.asia-south1-1.gce.redns.redis-cloud.com:14222,password=DMOAmNMT7QMTv0SRAi8ahhGloVOKa1aH");

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
        var verificationToken = Guid.NewGuid().ToString();
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.password);
        var newUser = new User
            {
                email = user.email,
                password = hashedPassword,
                role = user.role,
                verified = false
            };
        _context.Users.Add(newUser);
        _context.SaveChanges();
        var redisDb = redis.GetDatabase();
        await redisDb.StringSetAsync($"reg_verification:{verificationToken}", user.email, TimeSpan.FromMinutes(10));
        await EmailGenerators.SendVerificationEmailAsync(user.email, verificationToken);
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

        if (!user.verified)
        {
            return Ok(new {allow=false, message="not verified"});
        }
        // Verify the password.
        bool isPasswordValid = BCrypt.Net.BCrypt.Verify(cred.userpassword, user.password);

        // If the password is not valid, then the user is not authorized.
        if (!isPasswordValid)
        {
            return Unauthorized();
        }

        // Return the worker ID.
        return Ok(new {allow=true,id=user.user_id});
    }
    
    [HttpPost("verify")]
    public async Task<IActionResult> VerifyUser([FromQuery] string token)
    {
        // Assuming you have a reference to the Redis database
        var redisDb = redis.GetDatabase();

        // Retrieve the email associated with the verification token from Redis
        var email = await redisDb.StringGetAsync($"reg_verification:{token}");
        if (email.IsNullOrEmpty)
        {
            // Token not found or expired
            return BadRequest("Invalid or expired verification token.");
        }

        // Retrieve the user from the database based on the email
        var user = await _context.Users.FirstOrDefaultAsync(u => u.email == email);
        if (user == null)
        {
            return NotFound("User not found.");
        }

        // Mark the user as verified
        user.verified = true;
        _context.Users.Update(user);
        await _context.SaveChangesAsync();

        // Clean up the Redis cache (optional)
        await redisDb.KeyDeleteAsync($"reg_verification:{token}");

        // Generate an HTML page with the desired message
        var htmlContent = @"
        <!DOCTYPE html>
        <html>
        <head>
            <meta http-equiv='refresh' content='5;url=https://localhost:7286/'>
        </head>
        <body>
            <p>You are verified. Thanks! Now you can log in.</p>
        </body>
        </html>";

        // Return the HTML content
        return Content(htmlContent, "text/html");
    }


}