using Microsoft.EntityFrameworkCore;
using WorkManagement.Models;

namespace WorkManagement.Db;

public class DefaultDbContext : DbContext
{
    public DefaultDbContext(DbContextOptions<DefaultDbContext> options)
        : base(options)
    {
    }
    
    public DbSet<Login> Logins { get; set; }
    public DbSet<Work> Works { get; set; }

    public DbSet<SubTask> Tasks { get; set; }
    
    public DbSet<Query> Queries { get; set; }
    
    public DbSet<Coordinator> Coordinators { get; set; }
    
    public DbSet<Payment> Payments { get; set; }
    
    public DbSet<Worker> Workers { get; set; }
    
    public DbSet<WLogin> WLogins { get; set; }
    
    public DbSet<Image> Images { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql(@"Host=silly-zebu-5404.8nk.cockroachlabs.cloud;Port=26257;Database=workmanagementdb;Username=alpha;Password=sY8Y8hOdvXXYRoEyYJG_jw;
        SSL Mode = VerifyCA;");
    }
}