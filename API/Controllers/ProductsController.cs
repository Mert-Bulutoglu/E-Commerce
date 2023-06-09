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
using Product = Core.Entities.Product;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly IProductRepository _productRepo;
        private readonly IGenericRepository<ProductBrand> _productBrandRepo;
        private readonly IGenericRepository<ProductType> _productTypeRepo;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMailService _mailService;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ProductsController(IProductRepository productRepo,
        IGenericRepository<ProductBrand> productBrandRepo,
        IGenericRepository<ProductType> productTypeRepo,
        IMapper mapper,
        IMailService mailService,
        IUnitOfWork unitOfWork,
        IWebHostEnvironment webHostEnvironment)
        {
            this._productRepo = productRepo;
            this._productBrandRepo = productBrandRepo;
            this._productTypeRepo = productTypeRepo;
            this._mapper = mapper;
            _mailService = mailService;
            _unitOfWork = unitOfWork;
            _webHostEnvironment = webHostEnvironment;
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

            return Ok(new Pagination<ProductToReturnDto>(productParams.PageIndex, productParams.PageSize, totalItems, data));
        }

        [HttpGet("[action]")]
        public async Task<ActionResult> GetProductOnly()
        {
            var products = await _productRepo.GetProductsAsync();

            var productDtos = products.Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                NutrientContent = p.NutrientContent,
                Features = p.Features,
                Price = p.Price,
                ViewCount = p.ViewCount,
                NumberOfSold = p.NumberOfSold,
                Stock = p.Stock,
                PictureUrl = p.PictureUrl,
                ProductType = p.ProductType != null ? p.ProductType.Name : null,
                ProductBrand = p.ProductBrand != null ? p.ProductBrand.Name : null
            }).ToList();

            return Ok(productDtos);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductToReturnDto>> GetProduct(int id)
        {
            var spec = new ProductsWithTypesAndBrandsSpecification(id);
            var product = await _productRepo.GetEntityWithSpec(spec);

            if (product == null) return NotFound(new ApiResponse(404));

            product.ViewCount++;
            _productRepo.Update(product);
            await _unitOfWork.Complete();

            return _mapper.Map<Core.Entities.Product, ProductToReturnDto>(product);
        }


        [HttpGet("details/{id}")]
        public async Task<ActionResult<ProductDto>> GetProductById(int id)
        {
            var spec = new ProductsWithTypesAndBrandsSpecification(id);
            var product = await _productRepo.GetEntityWithSpec(spec);

            if (product == null) return NotFound(new ApiResponse(404));

            return _mapper.Map<Core.Entities.Product, ProductDto>(product);
        }

        [HttpGet("brands")]
        public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetProductBrands()
        {
            return Ok(await _productBrandRepo.ListAllAsync());

        }

        [HttpGet("types")]
        public async Task<ActionResult<IReadOnlyList<ProductType>>> GetProductTypes()
        {
            return Ok(await _productTypeRepo.ListAllAsync());
        }


        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost]
        public async Task<ActionResult> Save(ProductDto productDto)
        {
            var productType = await _productRepo.GetProductTypeByNameAsync(productDto.ProductType);
            var productBrand = await _productRepo.GetProductBrandByNameAsync(productDto.ProductBrand);

            if (productType == null)
                return BadRequest($"Product type {productDto.ProductType} not found");
            if (productBrand == null)
                return BadRequest($"Product brand {productDto.ProductBrand} not found");

            var existingProduct = await _productRepo.GetProductByNameAsync(productDto.Name);
            if (existingProduct != null)
            {
                return BadRequest($"Product with name '{productDto.Name}' already exists");
            }

            var newProduct = new Product
            {
                Name = productDto.Name,
                Description = productDto.Description,
                NutrientContent = productDto.NutrientContent,
                Features = productDto.Features,
                Price = productDto.Price,
                Stock = productDto.Stock,
                ViewCount = productDto.ViewCount,
                NumberOfSold = productDto.NumberOfSold,
                PictureUrl = productDto.PictureUrl,
                ProductTypeId = productType.Id,
                ProductType = productType,
                ProductBrandId = productBrand.Id,
                ProductBrand = productBrand
            };

            _productRepo.Add(newProduct);
            await _unitOfWork.Complete();

            var newProductDto = _mapper.Map<ProductDto>(newProduct);

            return Ok(newProductDto);
        }


        [Authorize(Policy = "RequireAdminRole")]
        [HttpPut("{id}")]
        public async Task<ActionResult> Update(ProductDto productDto)
        {
            var databaseProduct = await _productRepo.GetProductByIdAsync(productDto.Id);
            if (databaseProduct == null)
            {
                return NotFound();
            }
            var productType = await _productRepo.GetProductTypeByNameAsync(productDto.ProductType);
            var productBrand = await _productRepo.GetProductBrandByNameAsync(productDto.ProductBrand);

            if (productType == null)
                return BadRequest($"Product type {productDto.ProductType} not found");
            if (productBrand == null)
                return BadRequest($"Product brand {productDto.ProductBrand} not found");

            _mapper.Map(productDto, databaseProduct);
            databaseProduct.ProductBrand= productBrand;
            databaseProduct.ProductType = productType;

            _productRepo.Update(databaseProduct);
            await _unitOfWork.Complete();

            return Ok(_mapper.Map<ProductDto>(databaseProduct));
        }

        [Authorize(Policy = "RequireAdminRole")]
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

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("[action]")]
        public async Task<IActionResult> Upload()
        {
            string uploadPath = Path.Combine(_webHostEnvironment.WebRootPath, "photos/product");

            if (!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath);
            }
            Random r = new();

            foreach (var file in Request.Form.Files)
            {
                string fileName = $"{r.Next()}{Path.GetExtension(file.FileName)}";
                string fullPath = Path.Combine(uploadPath, fileName);

                using FileStream fileStream = new(fullPath, FileMode.Create, FileAccess.Write, FileShare.None, 1024 * 1024, useAsync: false);
                await file.CopyToAsync(fileStream);
                await fileStream.FlushAsync();

                string url = "photos/product/" + fileName;

                return Ok(new { url });
            }

            return BadRequest();
        }
    }
}