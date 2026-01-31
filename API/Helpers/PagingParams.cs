using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers
{
    public class PagingParams
    {
        private const int MaxPageSize = 5;
        public int PageNumber { get; set; }=1;
        private int _pageSize = 5;
        public int PageSize
        {
            get { return _pageSize; }
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }

    }
}