using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using API.Interfaces;
using System.Security.Claims;
using API.DTOs;
using API.Extensions;

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
         

        [HttpPut]
        public async Task<ActionResult> UpdateMember(MemberUpdateDTO memberUpdateDTO)
        {
            var memberId=User.GetMemberId();// .FindFirstValue(ClaimTypes.NameIdentifier);

            if(memberId == null)return BadRequest("no id found");

            var member = await memberRepository.GetMemberForUpdate(memberId);//.GetMemberByIdAsync(memberId);

            if(member == null   ) return BadRequest("Could not get memebr");

            member.DisplayName = memberUpdateDTO.DisplayName ?? member.DisplayName;
            member.Description = memberUpdateDTO.Description ?? member.Description;
            member.City = memberUpdateDTO.City ?? member.City;
            member.Country = memberUpdateDTO.Country ?? member.Country;

            member.User.DisplayName= memberUpdateDTO.DisplayName ?? member.User.DisplayName;


            memberRepository.Update(member);

            if(await memberRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to updat member");
        }



    }
}