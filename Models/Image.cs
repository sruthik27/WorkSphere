namespace WorkManagement.Models;


using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


[Table("images", Schema = "public")]
public class Image
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int id {get; set;}
    
    public long work {get; set;}
    
    public List<string> links {get; set;}
    
    [ForeignKey("work")]
    public Work WorkReference {get; set;}
    
}