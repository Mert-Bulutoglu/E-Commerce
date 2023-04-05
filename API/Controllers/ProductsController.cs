using API.Dtos;
using API.Dtos.EntityDtos;
using API.Errors;
using API.Helpers;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;
using static StackExchange.Redis.Role;

namespace API.Controllers
{

    public class ProductsController : BaseApiController
    {
        private readonly IProductRepository _productRepo;
        private readonly IGenericRepository<ProductBrand> _productBrandRepo;
        private readonly IGenericRepository<ProductType> _productTypeRepo;
        private readonly IMapper _mapper;
        private readonly ILogger _logger;
        private readonly IUnitOfWork _unitOfWork;

        private readonly IMailService _mailService;

        public ProductsController(IProductRepository productRepo,
        IGenericRepository<ProductBrand> productBrandRepo,
        IGenericRepository<ProductType> productTypeRepo,
        IMapper mapper,
        ILogger<ProductsController> logger
,
        IMailService mailService,
        IUnitOfWork unitOfWork)
        {
            this._productRepo = productRepo;
            this._productBrandRepo = productBrandRepo;
            this._productTypeRepo = productTypeRepo;
            this._mapper = mapper;
            this._logger = logger;
            _mailService = mailService;
            _unitOfWork = unitOfWork;
        }

        //[Authorize(Policy = "RequireAdminRole")]
        [HttpGet]
        public async Task<ActionResult<Pagination<ProductToReturnDto>>> GetProducts(
            [FromQuery] ProductSpecParams productParams)
        {
            var spec = new ProductsWithTypesAndBrandsSpecification(productParams);

            var countSpec = new ProductWithFiltersCountSpecification(productParams);

            var totalItems = await _productRepo.CountAsync(countSpec);

            var products = await _productRepo.ListAsync(spec);

            var data = _mapper.Map<IReadOnlyList<Core.Entities.Product>, IReadOnlyList<ProductToReturnDto>>(products);

            _logger.LogInformation("Başariyla getirildi.");

            return Ok(new Pagination<ProductToReturnDto>(productParams.PageIndex, productParams.PageSize, totalItems, data));
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductToReturnDto>> GetProduct(int id)
        {
            var spec = new ProductsWithTypesAndBrandsSpecification(id);
            var product = await _productRepo.GetEntityWithSpec(spec);

            if (product == null) return NotFound(new ApiResponse(404));

            return _mapper.Map<Core.Entities.Product, ProductToReturnDto>(product);
        }

        [HttpGet("brands")]
        public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetProductBrands()
        {
            return Ok(await _productBrandRepo.ListAllAsync());

        }

        [HttpGet("types")]
        public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetProductTypes()
        {
            return Ok(await _productTypeRepo.ListAllAsync());

        }

        [HttpPost]
        public async Task<ActionResult> Save(ProductDto productDto)
        {
            var mapped = _mapper.Map<Core.Entities.Product>(productDto);
            _productRepo.Add(mapped);
            await _unitOfWork.Complete();
            return Ok(productDto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(ProductDto productDto)
        {
            var databaseProduct = await _productRepo.GetProductByIdAsync(productDto.Id);
            if (databaseProduct == null)
            {
                return NotFound();
            }
            _mapper.Map(productDto, databaseProduct);

            _productRepo.Update(databaseProduct);
            await _unitOfWork.Complete();

            return Ok(_mapper.Map<ProductDto>(databaseProduct));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var databaseProduct = await _productRepo.GetProductByIdAsync(id);
            if (databaseProduct == null)
            {
                return NotFound();
            }

            _productRepo.Delete(databaseProduct);
            await _unitOfWork.Complete();

            return Ok();
        }
    }
}