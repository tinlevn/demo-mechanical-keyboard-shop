using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Data;
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
    }
}