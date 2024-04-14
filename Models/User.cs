using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WorkManagement.Models;

[Table("users", Schema = "public")]
public class User
{
    [Key]
    public string user_id { get; set; }
    public string email { get; set; }
    public string password { get; set; }
    public string role { get; set; }
    
}