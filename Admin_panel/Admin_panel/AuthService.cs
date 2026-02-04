using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Admin_panel
{
    internal class AuthService
    {
        private readonly HttpClient httpClient;

        public AuthService()
        {
            httpClient = new HttpClient();
        }

        public async Task<string?> LoginAsync(string userID, string password)
        {
            try
            {
                string jsonPayload = $"{{\"userID\":\"{userID}\",\"password\":\"{password}\"}}";
                var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                var response = await httpClient.PostAsync("http://localhost:5000/api/auth/login-wpf", content);

                if (!response.IsSuccessStatusCode)
                    return null;

                string responseJson = await response.Content.ReadAsStringAsync();

                using var doc = JsonDocument.Parse(responseJson);
                return doc.RootElement.GetProperty("token").GetString();
            }
            catch
            {
                return null;
            }
        }
    }
}
