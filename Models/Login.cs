using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WorkManagement.Models;

[Table("login", Schema = "public")]
public class Login
{
    [Key]
    public string email { get; set; }
    public string password { get; set; }
    public char designation { get; set; }
    
}