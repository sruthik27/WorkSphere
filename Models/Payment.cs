using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

[Table("payment", Schema = "public")]
public class Payment
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public long payment_id { get; set; }

    public char? payment_type { get; set; }

    public long? paid_amount { get; set; }

    public DateTime? paid_date { get; set; }

    public long? work { get; set; }

    [JsonIgnore]
    [ForeignKey("work")]
    public Work? WorkNavigation { get; set; }
}