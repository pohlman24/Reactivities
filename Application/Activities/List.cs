using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    // query handler
    public class List
    {
        public class Query : IRequest<Result<List<ActivityDto>>>
        {

        }

        public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
        {
            private readonly DataContext _context;
            private IMapper _Mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _Mapper = mapper;
                _context = context;
            }

            public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                // to load related data, ie so that activites also have the attendess we do this
                var activities = await _context.Activities
                    .ProjectTo<ActivityDto>(_Mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);
                
                // // auto mapping
                // var activitiesToReturn = _Mapper.Map<List<ActivityDto>>(activities);

                // var result = await _context.Activities.ToListAsync();
                return Result<List<ActivityDto>>.Success(activities);
            }
        }
    }
}