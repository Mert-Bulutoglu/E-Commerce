using API.Dtos.EntityDtos;
using AutoMapper;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class DeliveryMethodController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IDeliveryMethodRepository _deliveryMethodRepository;
        private readonly IMapper _mapper;
        public DeliveryMethodController(IDeliveryMethodRepository deliveryMethodRepository, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _deliveryMethodRepository = deliveryMethodRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult> GetDeliveryMethods()
        {
            var deliveryMethods = await _deliveryMethodRepository.ListAllAsync();
            return Ok(deliveryMethods);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetDeliveryMethod(int id)
        {
            var deliveryMethod = await _deliveryMethodRepository.GetByIdAsync(id);
            if (deliveryMethod == null)
            {
                return NotFound();
            }
            return Ok(deliveryMethod);
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost]
        public async Task<ActionResult> Save(DeliveryDto deliveryDto)
        {
            var mapped = _mapper.Map<DeliveryMethod>(deliveryDto);
            _deliveryMethodRepository.Add(mapped);
            await _unitOfWork.Complete();
            return Ok(deliveryDto);
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPut("{id}")]
        public async Task<ActionResult> Update(DeliveryDto deliveryDto)
        {
            var databaseDelivery = await _deliveryMethodRepository.GetByIdAsync(deliveryDto.Id);
            if (databaseDelivery == null)
            {
                return NotFound();
            }
            _mapper.Map(deliveryDto, databaseDelivery);

            _deliveryMethodRepository.Update(databaseDelivery);
            await _unitOfWork.Complete();

            return Ok(_mapper.Map<DeliveryDto>(databaseDelivery));
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var databaseDelivery = await _deliveryMethodRepository.GetByIdAsync(id);
            if (databaseDelivery == null)
            {
                return NotFound();
            }
            _deliveryMethodRepository.Delete(databaseDelivery);
            await _unitOfWork.Complete();

            return Ok();
        }
    }
}
