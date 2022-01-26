using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using API.Data;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Data;
using Core.Entities;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : Controller
    {
        private readonly StoreContext _context;
        public ProductsController(StoreContext context){
            _context=context;
        }
       [HttpGet]
       public async Task<ActionResult<List<Product>>> GetProducts(){
           var products = await _context.Products.ToListAsync();
           return Ok(products);
       }

       [HttpGet("{id}")]
       public async Task<ActionResult<Product>> getProduct(int id){
           return await _context.Products.FindAsync(id);
       }
    }
}