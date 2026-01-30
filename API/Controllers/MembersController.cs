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
using System.Reflection.Metadata;
using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography.X509Certificates;
using API.Helpers;

namespace API.Controllers
{

    [Authorize]
    public class MembersController(IMemberRepository memberRepository,
            IPhotoService photoService) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<Member>>> GetMembers([FromQuery]MemberParams memberParams)
        {
            // var members = await context.Users.ToListAsync();
            // return members;

            memberParams.CurrentMemberId = User.GetMemberId();
            return Ok(await memberRepository.GetMembersAsync(memberParams));
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
            var memberId = User.GetMemberId();// .FindFirstValue(ClaimTypes.NameIdentifier);

            if (memberId == null) return BadRequest("no id found");

            var member = await memberRepository.GetMemberForUpdate(memberId);//.GetMemberByIdAsync(memberId);

            if (member == null) return BadRequest("Could not get memebr");

            member.DisplayName = memberUpdateDTO.DisplayName ?? member.DisplayName;
            member.Description = memberUpdateDTO.Description ?? member.Description;
            member.City = memberUpdateDTO.City ?? member.City;
            member.Country = memberUpdateDTO.Country ?? member.Country;

            member.User.DisplayName = memberUpdateDTO.DisplayName ?? member.User.DisplayName;


            memberRepository.Update(member);

            if (await memberRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to updat member");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<Photo>> AddPhoto([FromForm] IFormFile file)
        {
            var member = await memberRepository.GetMemberForUpdate(User.GetMemberId());

            if (member == null) return BadRequest("Cannot update member for add-photo");
            var result = await photoService.UploadPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
                MemberId = User.GetMemberId()
            };

            if (member.ImageUrl == null)
            {
                member.ImageUrl = photo.Url;
                member.User.ImageUrl = photo.Url;

            }

            member.Photos.Add(photo);
            if (await memberRepository.SaveAllAsync()) return photo;

            return BadRequest("Problem adding photo");
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var member = await memberRepository.GetMemberForUpdate(User.GetMemberId());

            if (member ==null) return BadRequest("Cannot get member from token");

            var photo = member.Photos.SingleOrDefault(x => x.Id == photoId);

            if (member.ImageUrl == photo?.Url || photo == null)
            {
                return BadRequest("cannot set this as main image");
            }

            member.ImageUrl = photo.Url;
            member.User.ImageUrl = photo.Url;

            if (await memberRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Problem setting main photo");
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
             var member = await memberRepository.GetMemberForUpdate(User.GetMemberId());

            if (member ==null) return BadRequest("Cannot get member from token");

            var photo = member.Photos.SingleOrDefault(x => x.Id == photoId);

            if(photo==null || photo.Url ==member.ImageUrl   )
            {
                return BadRequest("this being main photo cannot be deleted");
            }

            if (photo.PublicId != null)
            {
                var result = await photoService.DeletePhotoAsync(photo.PublicId);
                if(result.Error!=null ) return BadRequest(result.Error.Message);

            } 
            
            member.Photos.Remove(photo);

            if(await memberRepository.SaveAllAsync()) return Ok();

            return BadRequest("Deleite problem");

            
        }


    }
}