using Microsoft.AspNetCore.Mvc;
using Core.Entities;
using Core.Interfaces;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : Controller
    {
        private readonly IProductRepository _repo;
        public ProductsController(IProductRepository repo){
            _repo=repo;
        }
       [HttpGet]
       public async Task<ActionResult<List<Product>>> GetProducts(){
           var products = await _repo.GetProductsAsync();
           return Ok(products);
       }

       [HttpGet("{id}")]
       public async Task<ActionResult<Product>> getProduct(int id){
           return await _repo.GetProductByIdAsync(id);
       }

       [HttpGet("brands")]
       public async Task<ActionResult<ProductBrand>> getProductBrands(){
           return Ok(await _repo.GetProductBrandsAsync());
       }

       [HttpGet("types")]
       public async Task<ActionResult<ProductType>> getProductTypes(){
           return Ok(await _repo.GetProductTypesAsync());
       }
    }
}