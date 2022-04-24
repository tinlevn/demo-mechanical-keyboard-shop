namespace Core.Interfaces
{
    public interface IResponseCacheService
    {
         Task CacheResponseAsync(string cacheKey, object resposne, TimeSpan timeToLive);
         Task<string> GetCachedResponseAsync(string cacheKey);
    }
}