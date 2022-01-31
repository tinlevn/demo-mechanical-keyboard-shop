using Microsoft.AspNetCore.Mvc;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : Controller
    {
        private readonly IGenericRepository<Product> _productsRepo;
        private readonly IGenericRepository<ProductBrand> _productsBrandRepo; 
        private readonly IGenericRepository<ProductType> _productsTypeRepo;
        public ProductsController(IGenericRepository<Product> productsRepo, IGenericRepository<ProductBrand> productsBrandRepo,
        
        IGenericRepository<ProductType> productsTypeRepo){
            _productsTypeRepo = productsTypeRepo;
            _productsBrandRepo = productsBrandRepo;
            _productsRepo = productsRepo;
           
        }
       [HttpGet]
       public async Task<ActionResult<List<Product>>> GetProducts(){
           var spec = new ProductsWithTypesAndBrandsSpecification();
           var products = await _productsRepo.ListAsync(spec);
           return Ok(products);
       }

       [HttpGet("{id}")]
       public async Task<ActionResult<Product>> getProduct(int id){
           return await _productsRepo.GetByIdAsync(id);
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