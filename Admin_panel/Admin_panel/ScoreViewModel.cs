using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Admin_panel
{
    internal class ScoreViewModel
    {
        private readonly ApiService apiService = new ApiService();

        public event PropertyChangedEventHandler? PropertyChanged;

        public ObservableCollection<Score> Scores { get; set; } = new();

        public async Task LoadScores()
        {
            Scores.Clear();
            var adatok = await apiService.GetScoresAsync();
            foreach (var score in adatok)
            {
                Scores.Add(score);
            }
        }

        public async Task LoadTopTen(string gamename)
        {
            Scores.Clear();
            var adatok = await apiService.GetTopTenAsync(gamename);
            foreach (var score in adatok)
            {
                Scores.Add(score);
            }
        }

        public async Task LoadPlayerBest(string playername)
        {
            Scores.Clear();
            var adatok = await apiService.GetPlayerScoresAsync(playername);
            foreach (var score in adatok)
            {
                Scores.Add(score);
            }
        }

        public async Task<Score?> LoadById(int id)
        {
            return await apiService.GetScoreByIdAsync(id);
        }

        public async Task<bool> AddScore(Score score)
        {
            return await apiService.AddScoreAsync(score);
        }

        public async Task<bool> UpdateScore(int id, Score score)
        {
            return await apiService.UpdateScoreAsync(id, score);
        }

        public async Task<bool> DeleteScore(int id)
        {
            return await apiService.DeleteScoreAsync(id);
        }
    }
}
