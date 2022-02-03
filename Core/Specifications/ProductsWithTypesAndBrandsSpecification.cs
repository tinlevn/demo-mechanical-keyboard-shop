using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Specifications
{
    public class ProductsWithTypesAndBrandsSpecification : BaseSpecification<Product>
    {
        public ProductsWithTypesAndBrandsSpecification(string sort, int? brandId, int? typeId):
            base(x => 
                (!brandId.HasValue || x.ProductBrandId==brandId) &&
                (!typeId.HasValue || x.ProductTypeId == typeId))
        {
            AddInclude(x => x.ProductBrand);
            AddInclude(x => x.ProductType);
            AddOrdereBy(x => x.Name);
            
            switch(sort){
                case "priceAsc":
                    AddOrdereBy(p => p.Price);
                    break;
                case "priceDesc":
                    AddOrdereByDesc(p =>p.Price);
                    break;
                default:
                    AddOrdereBy(p=>p.Name);
                    break;
            }
        }

        public ProductsWithTypesAndBrandsSpecification(int id ) : 
        base(x => x.Id == id)
        {
            AddInclude(x => x.ProductBrand);
            AddInclude(x => x.ProductType);
        }
    }
}