using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;
using System.Windows;

namespace Admin_panel
{
    public class ScoreWindowcs
    {
        public partial class ScoreWindow : Window
        {
            private readonly ScoreViewModel viewModel = new ScoreViewModel();
            private readonly string userId;

            public ScoreWindow(string userId)
            {
                InitializeComponent();
                this.userId = userId;
                DataContext = viewModel;
                LoadData();
            }

            private async void LoadData()
            {
                await viewModel.LoadPlayerBest(userId);
            }

            private async void Add_Click(object sender, RoutedEventArgs e)
            {
                if (!int.TryParse(ScoreTextBox.Text, out int scoreValue)) return;

                var score = new Score
                {
                    UserID = userId,
                    Gamename = GamenameTextBox.Text,
                    ScoreValue = scoreValue
                };

                await viewModel.AddScore(score);
                await viewModel.LoadPlayerBest(userId);
            }

            private async void Update_Click(object sender, RoutedEventArgs e)
            {
                if (ScoreGrid.SelectedItem is not Score selected) return;
                if (!int.TryParse(ScoreTextBox.Text, out int scoreValue)) return;

                selected.Gamename = GamenameTextBox.Text;
                selected.ScoreValue = scoreValue;

                await viewModel.UpdateScore(selected.ID, selected);
                await viewModel.LoadPlayerBest(userId);
            }

            private async void Delete_Click(object sender, RoutedEventArgs e)
            {
                if (ScoreGrid.SelectedItem is not Score selected) return;

                await viewModel.DeleteScore(selected.ID);
                await viewModel.LoadPlayerBest(userId);
            }

            private void ScoreGrid_SelectionChanged(object sender, SelectionChangedEventArgs e)
            {
                if (ScoreGrid.SelectedItem is Score selected)
                {
                    GamenameTextBox.Text = selected.Gamename;
                    ScoreTextBox.Text = selected.ScoreValue.ToString();
                }
            }
        }
    }
}
