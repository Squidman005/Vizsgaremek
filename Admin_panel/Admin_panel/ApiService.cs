using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;
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
                var response = await httpClient.GetAsync("http://localhost:5000/api/users/withpassword");
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                var users = JsonSerializer.Deserialize<List<User>>(content) ?? new();

                return users;
            }
            catch (Exception ex)
            {
                MessageBox.Show("Failed to load users: " + ex.Message, "Error");
                return new();
            }
        }

        public async Task<User?> GetUserAsync(string userID)
        {
            try
            {
                var response = await httpClient.GetAsync($"http://localhost:5000/api/users/{userID}");
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                var user = JsonSerializer.Deserialize<User>(content);

                return user;
            }
            catch (Exception ex)
            {
                MessageBox.Show("Failed to get user: " + ex.Message, "Error");
                return null;
            }
        }

        public async Task<bool> CreateUserAsync(string username, string email, string password)
        {
            try
            {
                var userObj = new { username, email, password};
                var json = JsonSerializer.Serialize(userObj);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await httpClient.PostAsync("http://localhost:5000/api/users", content);
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                MessageBox.Show("Failed to create user: " + ex.Message, "Error");
                return false;
            }
        }

        public async Task<bool> UpdateUserAsync(string userID, string username, string email, string password, bool isAdmin)
        {
            try
            {
                var userObj = new { username, email, password, isAdmin };
                var json = JsonSerializer.Serialize(userObj);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var request = new HttpRequestMessage(new HttpMethod("PATCH"), $"http://localhost:5000/api/users/{userID}")
                {
                    Content = content
                };

                var response = await httpClient.SendAsync(request);
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                MessageBox.Show("Failed to update user: " + ex.Message, "Error");
                return false;
            }
        }

        public async Task<bool> DeleteUserAsync(string userID)
        {
            try
            {
                var response = await httpClient.DeleteAsync($"http://localhost:5000/api/users/{userID}");
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                MessageBox.Show("Failed to delete user: " + ex.Message, "Error");
                return false;
            }
        }
    }
}
