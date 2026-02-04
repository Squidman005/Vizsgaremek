using System.ComponentModel;
using System.Windows;
using System.Threading.Tasks;

namespace Admin_panel
{
    internal class LoginViewModel : INotifyPropertyChanged
    {
        private readonly AuthService authService = new AuthService();

        public string UserID { get; set; } = "";
        public string Password { get; set; } = "";

        public event PropertyChangedEventHandler? PropertyChanged;

        public async Task LoginAsync(Window loginWindow)
        {
            var token = await authService.LoginAsync(UserID, Password);

            if (token == null)
            {
                MessageBox.Show("Invalid userID or password", "Login failed");
                return;
            }

            if (!JwtHelper.IsAdmin(token))
            {
                MessageBox.Show(
                    "You are not an admin.\nAccess denied.",
                    "Admins only",
                    MessageBoxButton.OK,
                    MessageBoxImage.Warning
                );
                return;
            }

            var main = new MainWindow();
            main.Show();
            loginWindow.Close();
        }
    }
}