using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class ProductToReturnDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string NutrientContent { get; set; }
        public string Features { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string PictureUrl { get; set; }
        public int? ViewCount { get; set; }
        public int? NumberOfSold { get; set; }

        //    Related Entities  
        public string ProductType { get; set; }
        public string ProductBrand { get; set; }
    }
}