using Microsoft.AspNetCore.Mvc;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using API.DTOs;
using AutoMapper;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : Controller
    {
        private readonly IGenericRepository<Product> _productsRepo;
        private readonly IGenericRepository<ProductBrand> _productsBrandRepo; 
        private readonly IGenericRepository<ProductType> _productsTypeRepo;
        private readonly IMapper _mapper;
        public ProductsController(IGenericRepository<Product> productsRepo, IGenericRepository<ProductBrand> productsBrandRepo,
        IGenericRepository<ProductType> productsTypeRepo, IMapper mapper){
            _mapper = mapper;
            _productsTypeRepo = productsTypeRepo;
            _productsBrandRepo = productsBrandRepo;
            _productsRepo = productsRepo;
        }

       [HttpGet]
       public async Task<ActionResult<IReadOnlyList<ProductToReturnDto>>> GetProducts(){
           var spec = new ProductsWithTypesAndBrandsSpecification();
           
           var products = await _productsRepo.ListAsync(spec);

           return Ok(_mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductToReturnDto>>(products));
       }

       [HttpGet("{id}")]
       public async Task<ActionResult<ProductToReturnDto>> getProduct(int id){
           var spec = new ProductsWithTypesAndBrandsSpecification(id);

           var product = await _productsRepo.getEntityWithSpec(spec);

           return _mapper.Map<Product, ProductToReturnDto>(product);
       }

       [HttpGet("brands")]
       public async Task<ActionResult<ProductBrand>> getProductBrands(){
           return Ok(await _productsBrandRepo.ListAllAsync());
       }

       [HttpGet("types")]
       public async Task<ActionResult<ProductType>> getProductTypes(){
           return Ok(await _productsTypeRepo.ListAllAsync());
       }
    }
}