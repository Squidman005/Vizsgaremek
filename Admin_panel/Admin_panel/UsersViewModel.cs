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
    }
}
