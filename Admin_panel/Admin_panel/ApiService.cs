using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
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
        public ApiService() { }
        //________________USER_______________________
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
        //________________SCORE_______________________
        private readonly HttpClient httpClientScore = new HttpClient();

        public async Task<List<Score>> GetScoresAsync() {
            try
            {
                var response = await httpClientScore.GetFromJsonAsync<List<Score>>("http://localhost:5000/api/score");
                return response ?? new();
            }
            catch (Exception ex) {
                Console.WriteLine($"Hiba történt: {ex.Message}");
                return new();
            }
        }
        public async Task<List<Score>> GetTopTenAsync(string gamename)
        {
            try
            {
                var response = await httpClientScore.GetFromJsonAsync<List<Score>>($"http://localhost:5000/api/score/{gamename}");
                return response ?? new();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba: {ex.Message}");
                return new();
            }
        }
        public async Task<List<Score>> GetPlayerBestScoresAsync(string playername)
        {
            try
            {
                var response = await httpClientScore.GetFromJsonAsync<List<Score>>($"http://localhost:5000/api/score/player/{playername}");
                return response ?? new();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba: {ex.Message}");
                return new();
            }
        }
        public async Task<Score?> GetScoreByIdAsync(int id)
        {
            try
            {
                return await httpClientScore.GetFromJsonAsync<Score>($"http://localhost:5000/api/score/{id}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba: {ex.Message}");
                return new();
            }
        }
        public async Task<bool> AddScoreAsync(Score score)
        {
            try
            {
                var response = await httpClientScore.PostAsJsonAsync("http://localhost:5000/api/score//", score);
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba: {ex.Message}");
                return new();
            }
            catch
            {
                return false;
            }
        }
        public async Task<bool> UpdateScoreAsync(int id, Score score)
        {
            try
            {
                var response = await httpClientScore.PatchAsJsonAsync($"http://localhost:5000/api/score/{id}", score);
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba: {ex.Message}");
                return new();
            }
        }

        public async Task<bool> DeleteScoreAsync(int id)
        {
            try
            {
                var response = await httpClientScore.DeleteAsync($"http://localhost:5000/api/score/{id}");
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba: {ex.Message}");
                return new();
            }
        }



    }
}
