using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

[Table("query",Schema = "public")]
public class Query
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public long query_id { get; set; }

    [Required]
    public long work { get; set; }

    [Column(TypeName = "date")]
    [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
    public DateTime query_date { get; set; }

    [Column(TypeName = "time")]
    [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
    public TimeSpan query_time { get; set; }

    [Required]// Adjust the maximum length as needed
    public string message { get; set; }

    [Required]
    [MaxLength(1)] // Assuming it's a single character
    public string who { get; set; }

    [JsonIgnore]
    [ForeignKey("work")]
    public Work? WorkNavigation { get; set; }
}