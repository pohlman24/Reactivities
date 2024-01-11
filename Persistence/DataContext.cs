using Microsoft.EntityFrameworkCore;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {

        public DataContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Activity> Activities { get; set; }

        public DbSet<ActivityAttendee> ActivityAttendees { get; set; }

        // this is the section where we will build out the entity relationships
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder); // boilder plate 

            // many-to-many connection
            builder.Entity<ActivityAttendee>(x => x.HasKey(aa => new {aa.AppUserId, aa.ActivityId})); // form primary key
            // configure many-to-many entity
            builder.Entity<ActivityAttendee>()
                .HasOne(u => u.AppUser)      
                .WithMany(a => a.Activities)        // activities is the name of the ICollection prop in AppUser
                .HasForeignKey(aa => aa.AppUserId); // id of the single entity 
            builder.Entity<ActivityAttendee>()
                .HasOne(a => a.Activity)
                .WithMany(u => u.Attendees)          // Attendees is the name of the ICollection prop in Activity
                .HasForeignKey(aa => aa.ActivityId); // id of the single entity 
            
        }

    }
}