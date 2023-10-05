
using System.Net;
using System.Text.Json;
using Application.Core;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        public ILogger<ExceptionMiddleware> _logger { get; }
        public IHostEnvironment _env { get; }

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            _env = env;
            _logger = logger;
            _next = next;
        }        

        public async Task InvokeAsync(HttpContext context) 
        {
            try 
            {
                // if success then move on to next middleware
                await _next(context);
            }
            catch (Exception ex)
            {
                // if exception, log error, set http reponse info and create the AppException 
                _logger.LogError(ex, ex.Message);
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                var reponse = _env.IsDevelopment()
                    ? new AppException(context.Response.StatusCode, ex.Message, ex.StackTrace?.ToString()) 
                    : new AppException(context.Response.StatusCode, "Internal Server Erorr");

                var options = new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase};

                var json = JsonSerializer.Serialize(reponse, options);

                await context.Response.WriteAsync(json);                

            }
        }
    }
}