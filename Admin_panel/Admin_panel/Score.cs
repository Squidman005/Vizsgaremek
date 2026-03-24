using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Admin_panel
{
    public class Score
    {
        [JsonPropertyName("ID")]
        public int ID { get; set; }

        [JsonPropertyName("userId")]
        public string UserID { get; set; }

        [JsonPropertyName("score")]
        public string Email { get; set; }

        [JsonPropertyName("gamename")]
        public string Gamename { get; set; }
    }
}
