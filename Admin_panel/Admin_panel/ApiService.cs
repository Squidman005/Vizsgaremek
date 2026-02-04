using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows;

namespace Admin_panel
{
    internal class ApiService
    {
        private readonly HttpClient httpClient;

        public ApiService(string token)
        {
            var handler = new HttpClientHandler { UseCookies = true };
            httpClient = new HttpClient(handler);

            handler.CookieContainer.Add(new Uri("http://localhost:5000"), new Cookie("user_token", token));
        }

        public async Task<List<User>> GetUsersAsync()
        {
            try
            {
                var response = await httpClient.GetAsync("http://localhost:5000/api/users");
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                var users = JsonSerializer.Deserialize<List<User>>(content) ?? new();

                foreach (var user in users)
                {
                    MessageBox.Show(
                        $"ID: {user.ID}\n" +
                        $"Name: {user.Name}\n" +
                        $"Email: {user.Email}\n" +
                        $"IsAdmin: {user.isAdmin}\n" +
                        $"RegisteredAt: {user.RegisteredAt}",
                        "User Info"
                    );
                }

                return users;
            }
            catch (HttpRequestException httpEx)
            {
                MessageBox.Show("HTTP error: " + httpEx.Message, "Error");
                return new();
            }
            catch (JsonException jsonEx)
            {
                MessageBox.Show("JSON parse error: " + jsonEx.Message, "Error");
                return new();
            }
            catch (Exception ex)
            {
                MessageBox.Show("General error: " + ex.Message, "Error");
                return new();
            }
        }
    }
}
