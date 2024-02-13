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

    //TO GET ALL WORKS
    [HttpGet("getworks")]
    public async Task<IActionResult> GetWorks()
    {
        var works = _context.Works
            .AsNoTracking()
            .Select(work => new
            {
                work_id = work.work_id.ToString(),
                worker_names = string.Join(", ",
                    _context.Workers.Where(x => work.workers.Contains((x.worker_id))).Select(y => y.worker_name)),
                work.work_name,
                work.work_description,
                work.work_status,
                work.start_date,
                work.due_date,
                work.total_subtasks,
                work.completed_subtasks,
                work.wage,
                work.advance_paid,
                work.bill_paid,
                work.coordinator
            });
        return Ok(works);
    }

    //TO GET WORKS OF SPECCIFIC WORKER
    [HttpGet("getworksbyid")]
    public async Task<IActionResult> GetWorksById(long workerid)
    {
        var works = await _context.Works.Where(w => w.workers.Contains(workerid) && w.work_status == 'A').Select(work => new
        {
            work_id = work.work_id.ToString(),
            work.work_name,
            work.work_description,
            work.work_status,
            work.start_date,
            work.due_date,
            work.total_subtasks,
            work.completed_subtasks,
            work.wage,
            work.advance_paid,
            work.bill_paid,
            work.coordinator
        }).ToListAsync();
        return Ok(works);
    }

    
    private void SetCellValue(IXLCell cell, object value)
    {
        if (value == null)
        {
            cell.SetValue("");
        }
        else if (value is DateTime)
        {
            cell.SetValue((DateTime)value);
        }
        else if (value is bool)
        {
            cell.SetValue((bool)value);
        }
        else if (value is string)
        {
            cell.SetValue((string)value);
        }
        else if (value is double || value is float || value is decimal)
        {
            cell.SetValue(Convert.ToDouble(value));
        }
        else if (value is int || value is long || value is short || value is byte)
        {
            cell.SetValue(Convert.ToInt64(value));
        }
        else
        {
            cell.SetValue(value.ToString());
        }
    }
    
    [HttpGet("getexcel")]
    public IActionResult DownloadExcel()
    {
        // Define column headings
        string[] columnHeadings = { "work_id", "worker_names", "work_name", "work_description", "work_status",
            "start_date", "due_date", "total_subtasks", "completed_subtasks", "wage",
            "advance_paid", "bill_paid", "coordinator" };

        var works =  _context.Works
            .AsNoTracking()
            .Select(work => new
            {
                work_id = work.work_id.ToString(),
                worker_names = string.Join(", ", _context.Workers.Where(x => work.workers.Contains(x.worker_id)).Select(y => y.worker_name)),
                work.work_name,
                work.work_description,
                work_status = work.work_status=='A'?"Active":"Completed",
                work.start_date,
                work.due_date,
                work.total_subtasks,
                work.completed_subtasks,
                work.wage,
                advance_paid = work.advance_paid==true?"Yes":"No",
                bill_paid = work.bill_paid==true?"Yes":"No",
                work.coordinator
            }).ToList();

        var stream = new MemoryStream();

        using (var workbook = new XLWorkbook())
        {
            var worksheet = workbook.Worksheets.Add("Works");

            // Adding column headings
            for (int i = 0; i < columnHeadings.Length; i++)
            {
                worksheet.Cell(1, i + 1).Value = columnHeadings[i];
            }

            // Adding data rows
            for (int i = 0; i < works.Count; i++)
            {
                var work = works[i];
                for (int j = 0; j < columnHeadings.Length; j++)
                {
                    SetCellValue(worksheet.Cell(i + 2, j + 1), work.GetType().GetProperty(columnHeadings[j]).GetValue(work));
                }
            }

            workbook.SaveAs(stream);
        }

        stream.Position = 0;
        return File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "works.xlsx");
    }
    

    [HttpGet("gettasks")]
    public async Task<IActionResult> GetTasks(string n)
    {
        return Ok(_context.Tasks.Where(x => x.work_id == long.Parse(n)).OrderBy(t => t.order_no).Select(y =>
            new
            {
                task_id = y.task_id.ToString(), work_id = y.work_id.ToString(), y.order_no, y.completed, y.due_date,
                y.task_name, y.weightage
            }));
    }

    //get workers data
    [HttpGet("getworkers")]
    public async Task<IActionResult> GetWorkers()
    {
        var workers = _context.Workers.AsNoTracking().Select(w => new
        {
            worker_id = w.worker_id.ToString(),
            w.worker_name,
            w.email,
            w.phone_number
        });
        return Ok(workers);
    }

    //TO GET PAYMENT DETAILS OF WORK ID
    [HttpGet("getpayments")]
    public async Task<IActionResult> GetPayments(string workid)
    {
        var work_id = long.Parse(workid);
        return Ok(_context.Payments.Where(x => x.work == work_id));
    }

    //TO GET REVIEWS/QUERIES ON A WORK ID
    [HttpGet("getreviews")]
    public async Task<IActionResult> GetReviews(long workid)
    {
        return Ok(_context.Queries.Where(x => x.work == workid));
    }

    //TO GET IMAGES OF A GIVEN WORK
    [HttpGet("getimages")]
    public async Task<IActionResult> GetImageUrls()
    {
        var images = _context.Images.Select(x => new
        {
            workname = x.WorkReference.work_name,
            x.links
        });
        return Ok(images);
    }

    //TO GET VERIFICATION CODE
    [HttpGet("getverificationcode")]
    public async Task<IActionResult> GetVerification()
    {
        return Ok(_context.Logins.Find("check@verify.in").password);
    }

    [HttpGet("getresetkey")]
    public async Task<IActionResult> GetResetKey()
    {
        string key = "";
        using (StreamReader streamReader = new StreamReader(@"Files/vault.json"))
        {
            string jsonString = streamReader.ReadToEnd();

            // Parse the JSON string using JsonDocument
            JsonDocument jsonDocument = JsonDocument.Parse(jsonString);

            // Access values using the root element
            JsonElement root = jsonDocument.RootElement;

            key = root.GetProperty("reseturl").GetString()!;
        }

        return Ok(new
        {
            reset_key = key
        });
    }


    //--------------------------------------------------------

    //TO CHANGE PASSWORD FOR ADMIN/COORDINATOR

    static string GenerateRandomString(int length = 10)
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();
        StringBuilder stringBuilder = new StringBuilder(length);

        for (int i = 0; i < length; i++)
        {
            stringBuilder.Append(chars[random.Next(chars.Length)]);
        }

        return stringBuilder.ToString();
    }

    public class Who
    {
        public char who { get; set; }
    }
    
    [HttpPost("resetpasswordlink")]
    public async Task<IActionResult> SendPasswordResetEmail([FromBody] Who who)
    {
        string randomstuffing = GenerateRandomString();
        try
        {
            // Read the JSON file
            string jsonString = System.IO.File.ReadAllText(@"Files/vault.json");

            // Parse the JSON string into a JObject
            JObject jsonObject = JObject.Parse(jsonString);

            Console.WriteLine(jsonObject["reseturl"]);

            // Generate a random alphanumeric string and set it as the 'reseturl' value
            jsonObject["reseturl"] = randomstuffing; 

            // Convert the modified JObject back into a string
            string modifiedJsonString = jsonObject.ToString();

            // Write the modified JSON back to the file
            System.IO.File.WriteAllText(@"Files/vault.json", modifiedJsonString);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
        }

        var to_name = who.who == 'P' ? "Principal" : "DMDR Head";
        var to_email = who.who == 'P' ? "principal@tce.edu" : "smmroomi@tce.edu";
        // Create email message
        var emailMessage = new MimeMessage();
        emailMessage.From.Add(new MailboxAddress("TCE DMDR", "insomniadevs007@gmail.com"));
        emailMessage.To.Add(new MailboxAddress(to_name, to_email));
        emailMessage.To.Add(new MailboxAddress(to_name, "sruthik2016@gmail.com"));
        emailMessage.Subject = "Password Reset";
        emailMessage.Body = new TextPart("html")
        {
            Text = @$"
<!DOCTYPE html>
<html>
<head>
  <title>Password Reset</title>
  <style>
      body {{
          font-family: Arial, sans-serif;
      }}
      .container {{
          width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 5px;
      }}
      .button {{
          display: inline-block;
          background-color: #007BFF;
          color: #ffffff;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
          font-size: 16px;
          margin-top: 20px;
      }}
        a {{
         color: #fff;
      }}
  </style>
</head>
<body>
  <div class=""container"">
                <h2>Password Reset</h2>
                <p>Hello,</p>
                <p>We received a request to reset your password. Click the button below to reset it.</p>
                <a href=""https://tcedmdrportal.onrender.com/ResetPassword/{randomstuffing}"" class=""button"" style=""color: #ffffff; text-decoration: none;"">Reset Password</a>
                <p>If you did not request a password reset, please ignore this email or reply to let us know.</p>
                <b>This email can be used only once to change the password<b>
                </div>
                </body>
                </html>
"
        };

        // Send email
        using var smtp = new SmtpClient();
        smtp.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
        smtp.Authenticate("insomniadevs007@gmail.com", "lzhyecgavxzkcgvg");
        smtp.Send(emailMessage);
        smtp.Disconnect(true);
        
        return Ok(new { message = "sent successfully" });
    }


    //TO UPDATE ORDER OF SUBTASK
    [Route("updateorder")]
    [HttpPut]
    public async Task<IActionResult> UpdateOrder(string task_id, int new_order)
    {
        var taskid = long.Parse(task_id);
        //FindTask by taskid
        var task = _context.Tasks.FirstOrDefault(t => t.task_id == taskid);
        if (task == null)
        {
            return BadRequest("Task not found");
        }

        //Update task's order
        task.order_no = new_order;
        _context.SaveChanges();
        return Ok(new { message = "Order updated succesfully" });
    }

    //UPDATE COMPLETION OF TASKS (WORK)
    [Route("updatetaskcompletion")]
    [HttpPut]
    public async Task<IActionResult> UpdateCompletion(string task_id)
    {
        var taskid = long.Parse(task_id);
        var task = _context.Tasks.Find(taskid);
        if (task == null)
        {
            return BadRequest("Task not found");
        }

        task.completed = true;
        var workId = task.work_id;
        var work = _context.Works.Find(workId);
        work.completed_subtasks += task.weightage;
        _context.SaveChanges();

        // Check if all tasks for the same work_id are completed
        var allTasksCompleted = _context.Tasks.Where(t => t.work_id == workId && t.completed != true).Count() == 0;

        if (allTasksCompleted)
        {
            // Update work_status in the work table to true
            if (work != null)
            {
                work.work_status = 'C';
                foreach (var x in work.workers) 
                {
                    var worker = _context.Workers.Find(x);
                    worker.completed_works.Add((long)workId);
                    worker.current_works.Remove((long)workId);
                }
                _context.SaveChanges();

                var completed_queries = _context.Queries.Where(x => x.work == work.work_id);
                _context.Queries.RemoveRange(completed_queries);
                _context.SaveChanges();
            }
        }

        return Ok(new { message = "Completion updated successfully" });
    }

    [HttpPut("undotaskcomplete")]
    public async Task<IActionResult> UndoComplete(string task_id)
    {
        var taskid = long.Parse(task_id);
        var task = _context.Tasks.Find(taskid);
        if (task == null)
        {
            return BadRequest("Task not found");
        }

        task.completed = false;
        var workId = task.work_id;
        var work = _context.Works.Find(workId);
        work.completed_subtasks -= task.weightage;
        _context.SaveChanges();
        if (work.work_status=='C')
        {
            // Update work_status in the work table to true
            if (work != null)
            {
                work.work_status = 'A';
                foreach (var x in work.workers) 
                {
                    var worker = _context.Workers.Find(x);
                    worker.completed_works.Remove((long)workId);
                    worker.current_works.Add((long)workId);
                }
                _context.SaveChanges();
            }
        }
        return Ok(new { message = "Completion undoed successfully" });
    }

    //ADD NEW IMAGE URL 
    public class ImageItems
    {
        public long id { get; set; }
        public string url { get; set; }
    }

    [Route("appendimage")]
    [HttpPut]
    public async Task<IActionResult> AppendImage([FromBody] ImageItems imageitem)
    {
        var workid = imageitem.id;
        var url = imageitem.url;
        var imagebox = _context.Images.FirstOrDefault(i => i.work == workid);
        imagebox.links.Add(url);
        _context.SaveChanges();
        return Ok(new { message = "image appened sucessfully" });
    }

    //UPDATE BILL PAID
    [Route("updatebill")]
    [HttpPut]
    public async Task<IActionResult> UpdateBill(string workid)
    {
        var work_id = long.Parse(workid);
        var work = _context.Works.Find(work_id);
        work.bill_paid = true;
        _context.SaveChanges();
        return Ok(new { message = "bill updated successfully" });
    }

    //UPDATE VERIFICATION CODE
    [HttpPut("updatevcode")]
    public async Task<IActionResult> UpdateVCode()
    {
        var vcode = _context.Logins.FirstOrDefault(x => x.email == "check@verify.in");
        int randomNumber = new Random().Next(1000, 10000);
        vcode.password = randomNumber.ToString();
        _context.SaveChanges();
        return Ok();
    }

    //TO RESET PASSWORD

    //reset pass for admin/coordinator
    public class ResetDto
    {
        public string email { get; set; }
        public string newpass { get; set; }
    }

    [HttpPut("resetpass1")]
    public async Task<IActionResult> SetNewPass([FromBody] ResetDto resetDto)
    {
        var email = resetDto.email;
        var newpass = resetDto.newpass;
        var existingLogin = _context.Logins.FirstOrDefault(l => l.email == email);
        if (existingLogin == null)
        {
            // Email not found in the database, return false
            return NotFound(new { message = "Data not found" });
        }

        // Change in db
        existingLogin.password = newpass;
        _context.SaveChanges();
        
        // Refresh reset key in vault
        string newRandomstuffing = GenerateRandomString();
        try
        {
            // Read the JSON file
            string jsonString = System.IO.File.ReadAllText("Files/vault.json");

            // Parse the JSON string into a JObject
            JObject jsonObject = JObject.Parse(jsonString);

            // Generate a random alphanumeric string and set it as the 'reseturl' value
            jsonObject["reseturl"] = newRandomstuffing; 

            // Convert the modified JObject back into a string
            string modifiedJsonString = jsonObject.ToString();

            // Write the modified JSON back to the file
            System.IO.File.WriteAllText("Files/vault.json", modifiedJsonString);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return NoContent();
        }
        
        return Ok(new { success = "true" });
    }

    //reset pass for workers
    [HttpPut("resetpass")]
    public async Task<IActionResult> ResetPass([FromBody] ResetDto resetDto)
    {
        var newpass = resetDto.newpass;
        var user = _context.WLogins.FirstOrDefault(x => x.email == resetDto.email);
        string passwordHash = BCrypt.Net.BCrypt.HashPassword(newpass);
        user.password = passwordHash;
        await _context.SaveChangesAsync();
        return Ok(new { message = "success" });
    }

    //-------------------------------------------------------------------

    //ADMIN - COORDINATOR LOGIN VERIFICATION
    [Route("verify")]
    [HttpPost]
    public async Task<IActionResult> Verify([FromBody] Login login)
    {
        if (login == null)
        {
            return BadRequest("Invalid data");
        }

        var existingLogin = _context.Logins.FirstOrDefault(l => l.email == login.email);
        if (existingLogin == null)
        {
            // Email not found in the database, return false
            return Ok(new { success = false });
        }

        // Compare the provided password with the stored password
        if (existingLogin.password == login.password)
        {
            // Passwords match, and admin
            if (existingLogin.designation == 'A')
            {
                return Ok(new { redirectTo = "AdminPortal", where = 'A' });
            }

            if (existingLogin.designation == 'C')
                return Ok(new { redirectTo = "HeadPortal", where = 'C' });
            return Ok(new { redirectTo = "worker" });
        }
        else
        {
            // Passwords do not match, return false
            return Ok(new { success = "false" });
        }
    }

    //WORKER LOGIN

    public class LoginCred
    {
        public string useremail { get; set; }
        public string userpassword { get; set; }
    }

    [Route("workerlogin")]
    [HttpPost]
    public async Task<IActionResult> Login([FromBody] LoginCred cred)
    {
        // Get the WLogin object for the given email.
        WLogin wlogin = _context.WLogins.FirstOrDefault(w => w.email == cred.useremail);

        // If the WLogin object is null, then the user does not exist.
        if (wlogin == null)
        {
            return NotFound();
        }

        // Verify the password.
        bool isPasswordValid = BCrypt.Net.BCrypt.Verify(cred.userpassword, wlogin.password);

        // If the password is not valid, then the user is not authorized.
        if (!isPasswordValid)
        {
            return Unauthorized();
        }

        // Return the worker ID.
        return Ok(wlogin.wid);
    }


    //ADD QUERY
    [HttpPost("addquery")]
    public async Task<IActionResult> AddQuery([FromBody] Query newQuery)
    {
        if (newQuery == null)
        {
            return BadRequest("Invalid query data.");
        }

        newQuery.query_date = DateTime.UtcNow.Date; // Set the date to UTC date
        newQuery.query_time = DateTime.UtcNow.TimeOfDay; // Set the time to UTC time
        _context.Queries.Add(newQuery);
        _context.SaveChanges();
        DateTime istTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, istTimeZone);
        Console.WriteLine("IST Time: " + istTime.ToString("yyyy-MM-dd HH:mm:ss"));
        return Ok(new { message = "Query added successfully." });
    }

    //ADD NEW WORK ALONG WITH SUBTASKS AND IMAGES ENTRY
    public class WorkWithSubtasks
    {
        public Work Work { get; set; }
        public List<SubTask> Subtasks { get; set; }
    }

    [Route("addwork")]
    [HttpPost]
    public async Task<IActionResult> AddWork([FromBody] WorkWithSubtasks newWork)
    {
        if (newWork == null)
        {
            return BadRequest("Invalid work data.");
        }

        Work workpart = newWork.Work;
        var workers = workpart.workers;
        workers.ForEach(worker_id =>
        {
            var worker = _context.Workers.Find(worker_id);
            worker.works_done += 1;
            worker.current_works.Add(worker_id);
        });
        _context.Works.Add(workpart);
        _context.SaveChanges();
        var new_image_entry = new Image();
        new_image_entry.links = new List<string>();
        new_image_entry.work = workpart.work_id;
        _context.Images.Add(new_image_entry);
        _context.SaveChanges();

        List<SubTask> taskspart = newWork.Subtasks;
        foreach (var subtask in taskspart)
        {
            subtask.work_id = workpart.work_id;
            _context.Tasks.Add(subtask);
        }

        _context.SaveChanges();
        return Ok(new { message = "Work added successfully.", workpart.work_id });
    }

    //ADD PAYMENT
    [Route("addpayment")]
    [HttpPost]
    public async Task<IActionResult> AddPayment([FromBody] Payment newpayment)
    {
        if (newpayment == null)
        {
            return BadRequest("Invalid payment data.");
        }

        newpayment.work = (long)newpayment.work;
        _context.Payments.Add(newpayment);
        var work = _context.Works.Find(newpayment.work);
        if (work != null)
        {
            if (newpayment.payment_type == 'A')
            {
                work.advance_paid = true;
            }
            else if (newpayment.payment_type == 'B')
            {
                work.bill_paid = true;
            }
        }

        _context.SaveChanges();
        return Ok(new
        {
            message = "payment added sucessfully"
        });
    }

    //REGISTER WORKER
    public class WorkerDto
    {
        public string worker_name { get; set; }
        public string email { get; set; }
        public string phone_number { get; set; }
        public string password { get; set; }

        public string verificationcode { get; set; }
    }

    [Route("addworker")]
    [HttpPost]
    public async Task<ActionResult<Worker>> AddWorker([FromBody] WorkerDto workerDto)
    {
        // Validate the worker DTO object.
        if (workerDto == null)
        {
            return BadRequest();
        }

        var vcode = _context.Logins.Find("check@verify.in").password;
        if (workerDto.verificationcode != vcode)
        {
            return Ok("check fail");
        }

        // Create a new Worker object from the worker DTO object.
        Worker worker = new Worker()
        {
            worker_name = workerDto.worker_name,
            email = workerDto.email,
            phone_number = workerDto.phone_number,
            works_done = 0,
            current_works = new List<long>(),
            completed_works = new List<long>()
        };

        // Add the worker to the database.
        _context.Workers.Add(worker);
        await _context.SaveChangesAsync();

        // Get the worker ID generated by the database.
        long workerId = worker.worker_id;

        // Hash the password.
        string passwordHash = BCrypt.Net.BCrypt.HashPassword(workerDto.password);

        // Create a new WLogin object.
        WLogin wlogin = new WLogin()
        {
            wid = workerId,
            email = workerDto.email,
            password = passwordHash
        };

        // Add the WLogin object to the database.
        _context.WLogins.Add(wlogin);
        await _context.SaveChangesAsync();

        return Ok(new { message = "registration succesffull" });
    }
}