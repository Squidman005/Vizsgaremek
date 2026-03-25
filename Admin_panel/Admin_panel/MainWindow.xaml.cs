using System.Windows;
using System.Windows.Controls;
using System.Text.Json;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;

namespace Admin_panel
{
    public partial class MainWindow : Window
    {
        private UsersViewModel usersViewModel;
        private string? currentToken;
        private User? userBeingEdited;

        public MainWindow()
        {
            InitializeComponent();

            usersViewModel = new UsersViewModel();
            this.DataContext = usersViewModel;
        }

        private async void Login_Click(object sender, RoutedEventArgs e)
        {
            string username = UsernameTextBox.Text;
            string password = PasswordBox.Password;

            var authService = new AuthService();
            string? token = await authService.LoginAsync(username, password);

            if (token == null)
            {
                MessageBox.Show("Invalid username or password", "Login failed");
                return;
            }

            currentToken = token;

            LoginGrid.Visibility = Visibility.Collapsed;
            UsersGrid.Visibility = Visibility.Visible;

            usersViewModel.SetToken(token);

            await usersViewModel.LoadUsers();
        }

        private async void CreateUser_Click(object sender, RoutedEventArgs e)
        {
            if (currentToken == null) return;

            var newUser = new
            {
                username = CreateUsernameTextBox.Text,
                email = CreateEmailTextBox.Text,
                password = CreatePasswordBox.Password,
            };

            var json = JsonSerializer.Serialize(newUser);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            using var client = new HttpClient();
            client.DefaultRequestHeaders.Add("Cookie", $"user_token={currentToken}");
            var response = await client.PostAsync("http://localhost:5000/api/users", content);

            if (response.IsSuccessStatusCode)
            {
                MessageBox.Show("User created successfully");
                await usersViewModel.LoadUsers();
                CreateUsernameTextBox.Clear();
                CreateEmailTextBox.Clear();
                CreatePasswordBox.Clear();
            }
            else
            {
                MessageBox.Show(response.ReasonPhrase);
            }
        }

        private void EditUser_Click(object sender, RoutedEventArgs e)
        {
            userBeingEdited = (User)((FrameworkElement)sender).DataContext;

            UpdateUsernameTextBox.Text = userBeingEdited.Name;
            UpdateEmailTextBox.Text = userBeingEdited.Email;
            UpdatePasswordBox.Password = userBeingEdited.Password;
            UpdateIsAdminCheckBox.IsChecked = userBeingEdited.isAdmin;

            UpdateUserGroupBox.Visibility = Visibility.Visible;
        }

        private async void UpdateUser_Click(object sender, RoutedEventArgs e)
        {
            if (userBeingEdited == null || currentToken == null) return;

            var updatedUser = new
            {
                username = UpdateUsernameTextBox.Text,
                email = UpdateEmailTextBox.Text,
                password = UpdatePasswordBox.Password,
                isAdmin = UpdateIsAdminCheckBox.IsChecked ?? false
            };

            var json = JsonSerializer.Serialize(updatedUser);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            using var client = new HttpClient();
            client.DefaultRequestHeaders.Add("Cookie", $"user_token={currentToken}");
            var response = await client.PatchAsync($"http://localhost:5000/api/users/{userBeingEdited.ID}", content);

            if (response.IsSuccessStatusCode)
            {
                MessageBox.Show("User updated successfully");
                await usersViewModel.LoadUsers();
                UpdateUserGroupBox.Visibility = Visibility.Collapsed;
                userBeingEdited = null;
            }
            else
            {
                MessageBox.Show(response.ReasonPhrase);
            }
        }

        private async void DeleteUser_Click(object sender, RoutedEventArgs e)
        {
            if (currentToken == null) return;

            var user = (User)((FrameworkElement)sender).DataContext;
            var result = MessageBox.Show($"Are you sure you want to delete user {user.Name}?", "Confirm Delete", MessageBoxButton.YesNo);

            if (result != MessageBoxResult.Yes) return;

            using var client = new HttpClient();
            client.DefaultRequestHeaders.Add("Cookie", $"user_token={currentToken}");
            var response = await client.DeleteAsync($"http://localhost:5000/api/users/{user.ID}");

            if (response.IsSuccessStatusCode)
            {
                MessageBox.Show("User deleted successfully");
                await usersViewModel.LoadUsers();
            }
            else
            {
                MessageBox.Show("Failed to delete user");
            }
        }


        private void Scores_Click(object sender, RoutedEventArgs e)
        {
            var button = sender as Button;
            var user = button.DataContext as User;

            if (user != null)
            {
                var scoreWindow = new ScoreWindow(user.Name.ToString());
                scoreWindow.Show();
            }
        }

    }
}
