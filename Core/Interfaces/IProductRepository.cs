
using Core.Entities;

namespace Core.Interfaces
{
    public interface IProductRepository : IGenericRepository<Product>
    {
        Task<Product> GetProductByIdAsync(int id);
        Task<IReadOnlyList<Product>> GetProductsAsync();
        Task<IReadOnlyList<ProductBrand>> GetProductBrandsAsync();
        Task<IReadOnlyList<ProductType>> GetProductTypesAsync();
        Task<ProductBrand> GetProductBrandByNameAsync(string productBrandName);
        Task<ProductType> GetProductTypeByNameAsync(string productTypeName);
        Task<Product> GetProductByNameAsync(string productName);

    }
}