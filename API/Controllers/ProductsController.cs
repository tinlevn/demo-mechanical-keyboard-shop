using Microsoft.AspNetCore.Mvc;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using API.DTOs;
using AutoMapper;
using API.Errors;
using API.Helpers;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
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

       [Cached(600)]
       [HttpGet]
       public async Task<ActionResult<Pagination<ProductToReturnDto>>> GetProducts
       ([FromQuery]ProductSpecParams productParams)
       {
           var spec = new ProductsWithTypesAndBrandsSpecification(productParams);

           var countSpec= new ProductWithFiltersForCountSpecification(productParams);
           
           var totalItems =await _productsRepo.CountAsync(countSpec); 

           var products = await _productsRepo.ListAsync(spec);

           var data=_mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductToReturnDto>>(products);

           return Ok(new Pagination<ProductToReturnDto>(productParams.PageIndex, productParams.PageSize, totalItems, data));
       }
       
       
       [Cached(600)]
       [HttpGet("{id}")]
       [ProducesResponseType(StatusCodes.Status200OK)]
       [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
       public async Task<ActionResult<ProductToReturnDto>> getProduct(int id){
           var spec = new ProductsWithTypesAndBrandsSpecification(id);

           var product = await _productsRepo.getEntityWithSpec(spec);
           if (product == null) return NotFound(new ApiResponse(404)); 
           return _mapper.Map<Product, ProductToReturnDto>(product);
       }
       
        [Cached(600)]
       [HttpGet("brands")]
       public async Task<ActionResult<ProductBrand>> getProductBrands()
       {
           return Ok(await _productsBrandRepo.ListAllAsync());
       }

        [Cached(600)]
       [HttpGet("types")]
       public async Task<ActionResult<ProductType>> getProductTypes()
       {
           return Ok(await _productsTypeRepo.ListAllAsync());
       }
    }
}