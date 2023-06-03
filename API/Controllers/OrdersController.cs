using API.Dtos;
using API.Dtos.EntityDtos;
using API.Errors;
using API.Extensions;
using AutoMapper;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    //[Authorize]
    public class OrdersController : BaseApiController
    {
        private readonly IOrderService _orderService;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IBasketRepository _basketRepository;
        private readonly IProductRepository _productRepository;
        public OrdersController(IOrderService orderService, IMapper mapper, IUnitOfWork unitOfWork, IBasketRepository basketRepository, IProductRepository productRepository)
        {
            _mapper = mapper;
            _orderService = orderService;
            _unitOfWork = unitOfWork;
            _basketRepository = basketRepository;
            _productRepository = productRepository;
        }

        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(OrderDto orderDto)
        {
            var email = HttpContext.User.RetrieveEmailFromPrincipal();
            
            var basket = await _basketRepository.GetBasketAsync(orderDto.BasketId);

            var address = _mapper.Map<AddressDto, Address>(orderDto.ShipToAddress);

            foreach (var item in basket.Items)
            {
                var productItem = await _productRepository.GetProductByIdAsync(item.Id);
                if (productItem == null || productItem.Stock < item.Quantity)
                {
                    return BadRequest(new ApiResponse(400, $"Not enough stock for product {item.ProductName}; enough stock is {productItem.Stock}"));
                }            
                productItem.Stock -= item.Quantity;
                _productRepository.Update(productItem);
            }

            var order = await _orderService.CreateOrderAsync(email, orderDto.DeliveryMethodId, orderDto.BasketId, address);

            if (order == null) return BadRequest(new ApiResponse(400, "Problem creating order"));

            foreach (var item in basket.Items)
            {
                var productItem = await _productRepository.GetProductByIdAsync(item.Id);
                productItem.NumberOfSold += item.Quantity;
                _productRepository.Update(productItem);
            }

            await _unitOfWork.Complete();

            await _basketRepository.DeleteBasketAsync(orderDto.BasketId);

            return Ok(order);
        }
        
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<OrderDto>>> GetOrdersForUser()
        {
            var email = User.RetrieveEmailFromPrincipal();

            var orders = await _orderService.GetOrdersForUserAsync(email);

            return Ok(_mapper.Map<IReadOnlyList<OrderToReturnDto>>(orders));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderToReturnDto>> GetOrderByIdForUser(int id)
        {
            //var email = User.RetrieveEmailFromPrincipal();
            var order = await _orderService.GetOrderByIdSpecAsync(id);

            if (order == null) return NotFound(new ApiResponse(404));

            return _mapper.Map<OrderToReturnDto>(order);
        }

        [HttpGet("deliveryMethods")]
        public async Task<ActionResult<IReadOnlyList<DeliveryMethod>>> GetDeliveryMethods()
        {
            return Ok(await _orderService.GetDeliveryMethodsAsync());
        }

        [HttpGet("[action]")]
        public async Task<ActionResult> GetOrders()
        {

            var orders = await _orderService.GetAllOrdersAsync();

            return Ok(_mapper.Map<IReadOnlyList<OrderToReturnDto>>(orders));
        }

        [HttpGet("getOrders/{id}")]
        public async Task<ActionResult<OrderToReturnDto>> GetOrder(int id)
        {
            var order = await _orderService.GetByIdAsync(id);
            var orderById = await _orderService.GetOrderByIdAsync(id, order.BuyerEmail);
            if (orderById == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<OrderToReturnDto> (orderById));
        }


        [HttpPut("{id}")]
        public async Task<ActionResult<OrderToReturnDto>> Update(UpdateOrderDto updateOrderDto)
        {
            var order = await _orderService.GetByIdAsync(updateOrderDto.Id);
            var orderById = await _orderService.GetOrderByIdAsync(updateOrderDto.Id, order.BuyerEmail);

            if (orderById == null) return NotFound();


            if (Enum.TryParse(updateOrderDto.Status.Replace(" ", ""), out OrderStatus status))
            {
                order.Status = status;
            }
            else
            {
                return BadRequest("Invalid status value.");
            }

            _mapper.Map(updateOrderDto, order);
            _orderService.Update(order);

            await _unitOfWork.Complete();

            return _mapper.Map<Order, OrderToReturnDto>(order);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var databaseOrder = await _orderService.GetByIdAsync(id);
            if (databaseOrder == null)
            {
                return NotFound();
            }
            _orderService.Delete(databaseOrder);
            await _unitOfWork.Complete();

            return Ok();
        }

    }
}