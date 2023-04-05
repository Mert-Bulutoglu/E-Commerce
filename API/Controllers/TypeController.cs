using API.Dtos.EntityDtos;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class TypeController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ITypeRepository _typeRepository;
        private readonly IMapper _mapper;
        public TypeController(ITypeRepository typeRepository, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _typeRepository = typeRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<ProductType>>> GetTypes()
        {
            var types = await _typeRepository.ListAllAsync();
            return Ok(types);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductType>> GetType(int id)
        {
            var type = await _typeRepository.GetByIdAsync(id);
            if (type == null)
            {
                return NotFound();
            }           
            return Ok(type);

        }

        [HttpPost]
        public async Task<ActionResult> Save(TypeDto typeDto)
        {
            var mapped = _mapper.Map<Core.Entities.ProductType>(typeDto);
            _typeRepository.Add(mapped);
            await _unitOfWork.Complete();
            return Ok(typeDto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(TypeDto typeDto)
        {
            var databaseType = await _typeRepository.GetByIdAsync(typeDto.Id);
            if (databaseType == null)
            {
                return NotFound();
            }
            _mapper.Map(typeDto, databaseType);

            _typeRepository.Update(databaseType);
            await _unitOfWork.Complete();

            return Ok(_mapper.Map<TypeDto>(databaseType));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var databaseType = await _typeRepository.GetByIdAsync(id);
            if (databaseType == null)
            {
                return NotFound();
            }
            _typeRepository.Delete(databaseType);
            await _unitOfWork.Complete();
            return Ok();
        }
    }
}
