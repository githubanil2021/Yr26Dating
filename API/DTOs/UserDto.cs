using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class UserDto
    {

        [Required]
        public string Id { get; set; } = "";
        [Required]
        public string Email { get; set; } = "";

        [Required]
        public string DisplayName { get; set; } = "";


        public string? ImageUrl { get; set; } = "";


        public required  string Token{ get; set; } 
        

    }
}