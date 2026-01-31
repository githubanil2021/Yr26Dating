using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using API.Helpers;

 
namespace API.Interfaces
{
    public interface ILikesRepository
    {
        Task<MemberLike> GetMemberLike(string SourceMemberId, string TargetMemberId);
        Task<PaginatedResult<Member>> GetMemberLikes(LikesParams likesParams);
        Task<IReadOnlyList<string>> GetCurrentMemberLikeIds(string memberId);
        void DeleteLike(MemberLike like);
        Task<bool> SaveAllChanges();
        void AddLike(MemberLike like);
    }
}