using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("coordinator",Schema = "public")]
public class Coordinator
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public long coordinator_id { get; set; }

    [Required]
    public string coordinator_name { get; set; }

    public long? works_done { get; set; }

    public List<long> current_works { get; set; }

    [Required]
    public string email { get; set; }

    [Required]
    public string phone_number { get; set; }
}