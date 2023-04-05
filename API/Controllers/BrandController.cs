using API.Dtos.EntityDtos;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BrandController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IBrandRepository _brandRepository;
        private readonly IMapper _mapper;
        public BrandController(IBrandRepository brandRepository, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _brandRepository = brandRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult> GetBrands()
        {
            var brands = await _brandRepository.ListAllAsync();
            return Ok(brands);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetBrand(int id)
        {
            var brand = await _brandRepository.GetByIdAsync(id);
            if (brand == null)
            {
                return NotFound();
            }
            return Ok(brand);
        }

        [HttpPost]
        public async Task<ActionResult> Save(BrandDto brandDto)
        {
            var mapped = _mapper.Map<Core.Entities.ProductBrand>(brandDto);
            _brandRepository.Add(mapped);
            await _unitOfWork.Complete();
            return Ok(brandDto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(BrandDto brandDto)
        {
            var databaseBrand = await _brandRepository.GetByIdAsync(brandDto.Id);
            if (databaseBrand == null)
            {
                return NotFound();
            }
            _mapper.Map(brandDto, databaseBrand);

            _brandRepository.Update(databaseBrand);
            await _unitOfWork.Complete();

            return Ok(_mapper.Map<BrandDto>(databaseBrand));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var databaseBrand = await _brandRepository.GetByIdAsync(id);
            if (databaseBrand == null)
            {
                return NotFound();
            }
            _brandRepository.Delete(databaseBrand);
            await _unitOfWork.Complete();

            return Ok();
        }
    }
}
