using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using API.Interfaces;

namespace API.Controllers
{

[Authorize]
    public class MembersController(IMemberRepository memberRepository) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<Member>>> GetMembers()
        {
            // var members = await context.Users.ToListAsync();
            // return members;
            return Ok(await memberRepository.GetMembersAsync());
        }



        
        [HttpGet("{id}")]
        public async Task<ActionResult<Member>> GetMembers(string id)
        {
            var member = await memberRepository.GetMemberByIdAsync(id); //context.Users.FindAsync(id);


            return member == null ? NotFound() : member;
        }


        
        [HttpGet("{id}/photos")]
        public async Task<ActionResult<IReadOnlyList<Photo>>> GetMemberPhotos(string id)
        {
            return Ok(await memberRepository.GetPhotosForMemberAsync(id));
        }
         





    }
}