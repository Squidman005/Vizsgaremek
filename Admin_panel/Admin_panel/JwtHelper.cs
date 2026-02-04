using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Admin_panel
{
    internal static class JwtHelper
    {
        public static bool IsAdmin(string token)
        {
            var parts = token.Split('.');
            if (parts.Length < 2)
                return false;

            var payload = parts[1];

            payload = payload.Replace('-', '+').Replace('_', '/');
            switch (payload.Length % 4)
            {
                case 2: payload += "=="; break;
                case 3: payload += "="; break;
            }

            var jsonBytes = Convert.FromBase64String(payload);
            var json = Encoding.UTF8.GetString(jsonBytes);

            using var doc = JsonDocument.Parse(json);

            if (doc.RootElement.TryGetProperty("isAdmin", out var isAdmin))
            {
                return isAdmin.GetBoolean();
            }

            return false;
        }
    }
}
