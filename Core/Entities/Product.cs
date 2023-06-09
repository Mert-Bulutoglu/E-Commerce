using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class Product : BaseEntity
    {
       public string Name { get; set; }     
       public string Description { get; set; }
       public string NutrientContent { get; set; }
       public string Features { get; set; }
       public decimal Price { get; set; }
       public int Stock { get; set; }
       public string PictureUrl { get; set; }
       public int ViewCount { get; set; }
       public int NumberOfSold { get; set; }

        //Related Entities  
       public ProductType ProductType { get; set; } 
       public int? ProductTypeId { get; set; }   
       public ProductBrand ProductBrand { get; set; }   
       public int? ProductBrandId { get; set; }
    }
}