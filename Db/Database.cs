using Microsoft.EntityFrameworkCore;
using WorkManagement.Models;

namespace WorkManagement.Db;

public class DefaultDbContext : DbContext
{
    public DefaultDbContext(DbContextOptions<DefaultDbContext> options)
        : base(options)
    {
    }
    
    public DbSet<User> Users { get; set; }
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
        optionsBuilder.UseNpgsql(@"Host=workmanagement-3927.7s5.aws-ap-south-1.cockroachlabs.cloud;Port=26257;Database=workmanagement;Username=developers;Password=WNF8dqh-e7aPTACG0DEJUQ;
        SSL Mode = VerifyCA;");
    }
}