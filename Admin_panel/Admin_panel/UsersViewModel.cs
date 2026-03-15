using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Threading.Tasks;

namespace Admin_panel
{
    public class UsersViewModel : INotifyPropertyChanged
    {
        private ApiService apiService;

        public ObservableCollection<User> Users { get; set; } = new();

        public event PropertyChangedEventHandler? PropertyChanged;

        public void SetToken(string token)
        {
            apiService = new ApiService(token);
        }

        public async Task LoadUsers()
        {
            if (apiService == null) return;

            var users = await apiService.GetUsersAsync();

            Users.Clear();
            foreach (var user in users)
            {
                Users.Add(user);
            }
        }

        public async Task<bool> CreateUser(string username, string email, string password)
        {
            if (apiService == null) return false;
            var result = await apiService.CreateUserAsync(username, email, password);
            if (result) await LoadUsers();
            return result;
        }

        public async Task<bool> UpdateUser(string userID, string username, string email, string password, bool isAdmin)
        {
            if (apiService == null) return false;
            var result = await apiService.UpdateUserAsync(userID, username, email, password, isAdmin);
            if (result) await LoadUsers();
            return result;
        }

        public async Task<bool> DeleteUser(string userID)
        {
            if (apiService == null) return false;
            var result = await apiService.DeleteUserAsync(userID);
            if (result) await LoadUsers();
            return result;
        }
    }
}
