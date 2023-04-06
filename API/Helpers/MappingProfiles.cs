using API.Dtos;
using API.Dtos.EntityDtos;
using AutoMapper;
using Core.Entities;
using Core.Entities.Identity;
using Core.Entities.OrderAggregate;
using UserDto = API.Dtos.UserDto;

namespace API.Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
             CreateMap<Product, ProductToReturnDto>()
                .ForMember(d => d.ProductBrand, o => o.MapFrom(s => s.ProductBrand.Name))
                .ForMember(d => d.ProductType, o => o.MapFrom(s => s.ProductType.Name))
                .ForMember(d => d.PictureUrl, o => o.MapFrom<ProductUrlResolver>());
            CreateMap<Product, ProductDto>()
               .ForMember(d => d.ProductBrand, o => o.MapFrom(s => s.ProductBrand.Name))
               .ForMember(d => d.ProductType, o => o.MapFrom(s => s.ProductType.Name));
            CreateMap<ProductDto, Product>()
                .ForMember(dest => dest.ProductBrand, opt => opt.MapFrom(src => new ProductBrand { Name = src.ProductBrand }))
                .ForMember(dest => dest.ProductType, opt => opt.MapFrom(src => new ProductType { Name = src.ProductType }));

            CreateMap<ProductType, TypeDto>().ReverseMap();
            CreateMap<ProductBrand, BrandDto>().ReverseMap();
            CreateMap<Core.Entities.Identity.Address, AddressDto>().ReverseMap();
            CreateMap<CustomerBasketDto, CustomerBasket>();
            CreateMap<BasketItemDto, BasketItem>();
            CreateMap<AddressDto, Core.Entities.OrderAggregate.Address>();
            CreateMap<Order, OrderToReturnDto>()
                .ForMember(d => d.DeliveryMethod, o => o.MapFrom(s => s.DeliveryMethod.ShortName))
                .ForMember(d => d.ShippingPrice, o => o.MapFrom(s => s.DeliveryMethod.Price));
            CreateMap<OrderItem, OrderItemDto>()
                .ForMember(d => d.ProductId, o => o.MapFrom(s => s.ItemOrdered.ProductItemId))
                .ForMember(d => d.ProductName, o => o.MapFrom(s => s.ItemOrdered.ProductName))
                .ForMember(d => d.PictureUrl, o => o.MapFrom(s => s.ItemOrdered.PictureUrl))
                .ForMember(d => d.PictureUrl, o => o.MapFrom<OrderItemUrlResolver>());
            CreateMap<AppUser, UserDtoResult>()
            .ForMember(dto => dto.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dto => dto.DisplayName, opt => opt.MapFrom(src => src.UserName))
            .ForMember(dest => dest.RoleName, opt => opt.MapFrom(src => src.UserRoles.FirstOrDefault().Role.Name))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
             .ForMember(dest => dest.Address, opt => opt.MapFrom(src => new AddressDto
             {
                 FirstName = src.Address.FirstName,
                 LastName = src.Address.LastName,
                 Street = src.Address.Street,
                 City = src.Address.City,
                 State = src.Address.State,
                 ZipCode = src.Address.ZipCode
             }));
            CreateMap<AppUser, UsersWithRoleDto>()
                .ForMember(dest => dest.Roles, opt => opt
                .MapFrom(src => src.UserRoles.Select(ur => new RoleDto
                {
                    Id = ur.Role.Id,
                    Name = ur.Role.Name
                }).ToList()));
            CreateMap<AppUser, UpdateUserDto>().ReverseMap();
            CreateMap<AppUser, AddUserDto>().ReverseMap();
        }
    }
}