namespace WorkManagement.Models;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("wlogin",Schema = "public")]
public class WLogin
{
    [Key]
    public long wid { get; set; }

    [Required]
    [MaxLength(255)]
    public string email { get; set; }

    [Required]
    [MaxLength(255)]
    public string password { get; set; }

    [ForeignKey("wid")]
    public Worker? WorkerNavigation { get; set; }
}