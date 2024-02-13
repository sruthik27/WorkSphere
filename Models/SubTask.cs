using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

[Table("task",Schema = "public")]
public class SubTask
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("task_id")]
    public long task_id { get; set; }

    [Column("work_id")]
    public long? work_id { get; set; }

    [Column("order_no")]
    public long? order_no { get; set; }

    [Column("completed")]
    public bool? completed { get; set; }
    
    [Column("due_date")]
    public DateTime? due_date { get; set; }
    
    [Column("task_name")] 
    public string? task_name { get; set; }
    
    [Column("weightage")]
    public int? weightage { get; set; }

    // Navigation property to represent the foreign key relationship
    [JsonIgnore]
    [ForeignKey("work_id")]
    public Work? Work { get; set; }
}