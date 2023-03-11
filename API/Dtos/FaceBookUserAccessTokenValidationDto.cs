using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class FaceBookUserAccessTokenValidationDto
    {
        [JsonPropertyName("data")]
        public FaceBookUserAccessTokenValidationData Data { get; set; }

        public class FaceBookUserAccessTokenValidationData
        {
            [JsonPropertyName("is_valid")]
            public bool IsValid { get; set; }
            [JsonPropertyName("user_id")]
            public string UserId { get; set; }
        }
    }
}