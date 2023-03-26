using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using API.Dtos;
using API.Errors;
using API.Extensions;
using AutoMapper;
using Core.Entities.Identity;
using Core.Interfaces;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokensService _tokenService;
        private readonly IMapper _mapper;
        private readonly HttpClient _httpClient;
        private readonly IMailService _mailService;

        public AccountController(UserManager<AppUser> userManager,
         SignInManager<AppUser> signInManager,
          ITokensService tokenService,
          IMapper mapper,
          IHttpClientFactory httpClientFactory
,
          IMailService mailService)
        {
            _tokenService = tokenService;
            _mapper = mapper;
            _signInManager = signInManager;
            _userManager = userManager;
            _httpClient = httpClientFactory.CreateClient();
            _mailService = mailService;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByEmailFromClaimsPrinciple(User);

            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.CreateToken(user),
                DisplayName = user.DisplayName
            };
        }

        [HttpGet("emailexists")]
        public async Task<ActionResult<bool>> CheckEmailExistsAsync([FromQuery] string email)
        {
            return await _userManager.FindByEmailAsync(email) != null;
        }

        [Authorize]
        [HttpGet("address")]
        public async Task<ActionResult<AddressDto>> GetUserAddress()
        {
            var user = await _userManager.FindByEmailFromClaimsPrincipal(HttpContext.User);

            return _mapper.Map<Address, AddressDto>(user.Address);
        }

        [Authorize]
        [HttpPut("address")]
        public async Task<ActionResult<AddressDto>> UpdateUserAddress(AddressDto address)
        {
            var user = await _userManager.FindByEmailFromClaimsPrincipal(User);

            user.Address = _mapper.Map<AddressDto, Address>(address);


            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded) return Ok(_mapper.Map<Address, AddressDto>(user.Address));

            return BadRequest("Problem updating the user");
        }



        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if (user == null) return Unauthorized(new ApiResponse(401));

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (!result.Succeeded) return Unauthorized(new ApiResponse(401));

            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.CreateToken(user),
                DisplayName = user.DisplayName
            };
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (CheckEmailExistsAsync(registerDto.Email).Result.Value)
            {
                return new BadRequestObjectResult(new ApiValidationErrorResponse
                {
                    Errors = new[]
                {"Email address is in use"}
                });
            }
            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Email
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded) return BadRequest(new ApiResponse(400));

            var roleResult = await _userManager.AddToRoleAsync(user, "User");

            if (!roleResult.Succeeded) return BadRequest(result.Errors);

            return new UserDto
            {
                DisplayName = user.DisplayName,
                Token = await _tokenService.CreateToken(user),
                Email = user.Email
            };

        }



        [HttpPost("google-login")]
        public async Task<ActionResult<UserDto>> GoogleLogin(GoogleDto googleDto)
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings()
            {
                Audience = new List<string> { "530880028410-j4tfeh1qe8s7qtcu3hgsq55qetllur3i.apps.googleusercontent.com" }
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(googleDto.IdToken, settings);

            var info = new UserLoginInfo(googleDto.Provider, payload.Subject, googleDto.Provider);

            AppUser user = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);

            bool result = user != null;

            if (user == null)
            {
                user = await _userManager.FindByEmailAsync(payload.Email);
                if (user == null)
                {
                    user = new()
                    {
                        Email = payload.Email,
                        UserName = payload.Email,
                        DisplayName = payload.Name,
                    };
                    var identityResult = await _userManager.CreateAsync(user);
                    result = identityResult.Succeeded;
                }
            }

            if (result)
                await _userManager.AddLoginAsync(user, info);
            else
                throw new Exception("Invalid external authentication.");


            return new UserDto
            {
                DisplayName = user.DisplayName,
                Token = await _tokenService.CreateToken(user),
                Email = user.Email
            };
        }

        [HttpPost("facebook-login")]
        public async Task<ActionResult<UserDto>> FaceBookLogin(FaceBookDto faceBookDto)
        {

            string accessTokenResponse =
            await _httpClient
            .GetStringAsync
            ($"https://graph.facebook.com/oauth/access_token?client_id=1350540582456118&client_secret=8281e579f1f647af81b9e21346667162&grant_type=client_credentials");

            FaceBookAccessTokenResponseDto faceBookAccessTokenResponse = JsonSerializer.Deserialize<FaceBookAccessTokenResponseDto>(accessTokenResponse);

            string userAccessTokenValidation = await _httpClient.GetStringAsync($"https://graph.facebook.com/debug_token?input_token={faceBookDto.AuthToken}&access_token={faceBookAccessTokenResponse.AccessToken}");

            FaceBookUserAccessTokenValidationDto validation = JsonSerializer.Deserialize<FaceBookUserAccessTokenValidationDto>(userAccessTokenValidation);
            if (validation.Data.IsValid)
            {

                string userInfoResponse = await _httpClient.GetStringAsync($"https://graph.facebook.com/me?fields=email,name&access_token={faceBookDto.AuthToken}");

                FacebookUserInfoResponse userInfo = JsonSerializer.Deserialize<FacebookUserInfoResponse>(userInfoResponse);

                var info = new UserLoginInfo("FACEBOOK", validation.Data.UserId, "FACEBOOK");

                Core.Entities.Identity.AppUser user = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);

                bool result = user != null;

                if (user == null)
                {
                    user = await _userManager.FindByEmailAsync(userInfo.Email);
                    if (user == null)
                    {
                        user = new()
                        {
                            Email = userInfo.Email,
                            UserName = userInfo.Email,
                            DisplayName = userInfo.Name,
                        };
                        var identityResult = await _userManager.CreateAsync(user);
                        result = identityResult.Succeeded;
                    }
                }

                if (result)
                    await _userManager.AddLoginAsync(user, info);
                else
                    throw new Exception("Invalid external authentication.");


                return new UserDto
                {
                    DisplayName = user.DisplayName,
                    Token = await _tokenService.CreateToken(user),
                    Email = user.Email
                };
            }
            throw new Exception("Invalid external authentication.");

        }


        [HttpPost("password-reset")]
        public async Task<ActionResult<UserDto>> PasswordReset([FromBody] PasswordResetDto passwordResetDto)
        {

            AppUser user = await _userManager.FindByEmailAsync(passwordResetDto.Email);
            if (user != null)
            {
                string resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
                byte[] tokenBytes = Encoding.UTF8.GetBytes(resetToken);
                resetToken = WebEncoders.Base64UrlEncode(tokenBytes);

                await _mailService.SendPasswordResetMailAsync(passwordResetDto.Email, user.Id.ToString(), resetToken);
            }

            return Ok();

        }

        [HttpPost("verify-reset-token")]
        public async Task<ActionResult<VerifyResetTokenResponseDto>> VerifyResetToken(VerifyResetTokenDto verify)
        {

            AppUser user = await _userManager.FindByIdAsync(verify.UserId);
            if (user != null)
            {
                byte[] tokenBytes = WebEncoders.Base64UrlDecode(verify.ResetToken);
                verify.ResetToken = Encoding.UTF8.GetString(tokenBytes);

                var state = await _userManager.VerifyUserTokenAsync(user, _userManager.Options.Tokens.PasswordResetTokenProvider, "ResetPassword", verify.ResetToken);

                return new VerifyResetTokenResponseDto()
                {
                    State = state
                };

            }

            return BadRequest();

        }


        [HttpPost("update-password")]
        public async Task<bool> UpdatePassword([FromBody] UpdatePasswordCommandDto updatePassword)
        {
            if(!updatePassword.Password.Equals(updatePassword.PasswordConfirm))
                throw new Exception("Please approve your password");
            
            AppUser user = await _userManager.FindByIdAsync(updatePassword.UserId);
            if (user != null)
            {
                
                byte[] tokenBytes = WebEncoders.Base64UrlDecode(updatePassword.ResetToken);
                updatePassword.ResetToken = Encoding.UTF8.GetString(tokenBytes);

                IdentityResult result = await _userManager.ResetPasswordAsync(user, updatePassword.ResetToken, updatePassword.Password);

                if(result.Succeeded)
                {
                    await  _userManager.UpdateSecurityStampAsync(user);
                }
                else
                {
                    throw new Exception();
                }
            }
            return false;
        }

    }
}