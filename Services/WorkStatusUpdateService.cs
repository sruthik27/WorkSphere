using WorkManagement.Db;

namespace WorkManagement.Services;

public class WorkStatusUpdateService : BackgroundService
{
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly ILogger<WorkStatusUpdateService> _logger;

    public WorkStatusUpdateService(IServiceScopeFactory serviceScopeFactory, ILogger<WorkStatusUpdateService> logger)
    {
        _serviceScopeFactory = serviceScopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using (var scope = _serviceScopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<DefaultDbContext>();
                await UpdateWorkStatus(context);
            }

            var now = DateTime.Now;
            var midnight = new DateTime(now.Year, now.Month, now.Day).AddDays(1);
            var delay = midnight - now;

            if (delay.TotalMilliseconds > 0)
            {
                await Task.Delay((int)delay.TotalMilliseconds, stoppingToken);
            }
        }
    }

    private async Task UpdateWorkStatus(DefaultDbContext context)
    {
        var now = DateTime.UtcNow;
        var works = context.Works
            .Where(w => w.due_date < now && w.work_status != 'C')
            .ToList();
        
        foreach (var work in works)
        {
            work.work_status = 'I';
        }

        await context.SaveChangesAsync();

        _logger.LogInformation("Updated work statuses.");
    }
}