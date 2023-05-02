using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Core.Entities.Identity
{
    public class Address
    {
        public int Id { get; set; } 
        public string FirstName { get; set; } 
        public string LastName { get; set; } 
        public string Street { get; set; } 
        public string City { get; set; } 
        public string State { get; set; } 
        public string ZipCode { get; set; }

        [JsonIgnore]
        [Required]
        public int AppUserId { get; set; }   
        public AppUser AppUser { get; set; }   
    }
}