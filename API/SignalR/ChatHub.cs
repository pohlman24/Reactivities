using System.Security.Cryptography.X509Certificates;
using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IMediator _mediator;
        public ChatHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task SendComment(Create.Command command) 
        {
            // sending properties that are contained inside the Create: ActivityID and body
            var comment = await _mediator.Send(command);

            // Clients is the people connected to hub, we specficy a group that will recieve the info -- group we will make later
            // then send it over using the a name we make - we will use this name later on the client side
            await Clients.Group(command.ActivityId.ToString())
                .SendAsync("RecieveComment", comment.Value);
        }
        
        // when user joins hub we want them to join the group
        public override async Task OnConnectedAsync()
        {
            // get httpContext -- url info
            var httpContext = Context.GetHttpContext();
            // need to make sure that we send a query that contains the activityID
            var activityId = httpContext.Request.Query["activityId"];
            // add client to group we made
            await Groups.AddToGroupAsync(Context.ConnectionId, activityId);
            // get list of comments and send to client
            var results = await _mediator.Send(new List.Query{ActivityId = Guid.Parse(activityId)});
            await Clients.Caller.SendAsync("LoadComments", results.Value);
        }
    }
}