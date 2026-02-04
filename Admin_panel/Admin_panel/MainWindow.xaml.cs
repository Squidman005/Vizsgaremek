using System.Windows;

namespace Admin_panel
{
    public partial class MainWindow : Window
    {
        private UsersViewModel usersViewModel;

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

            LoginGrid.Visibility = Visibility.Collapsed;
            UsersGrid.Visibility = Visibility.Visible;

            usersViewModel.SetToken(token);

            await usersViewModel.LoadUsers();
        }
    }
}
