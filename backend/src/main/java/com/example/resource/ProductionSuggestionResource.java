package com.example.resource;

import com.example.model.Product;
import com.example.model.ProductRawMaterial;
import com.example.repository.ProductRepository;
import com.example.repository.ProductRawMaterialRepository;
import com.example.repository.RawMaterialRepository;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Path("/production-suggestion")
@Produces(MediaType.APPLICATION_JSON)
public class ProductionSuggestionResource {
    @Inject
    ProductRepository productRepository;
    @Inject
    RawMaterialRepository rawMaterialRepository;
    @Inject
    ProductRawMaterialRepository productRawMaterialRepository;

    @GET
    public Map<String, Object> suggest() {
        List<Product> products = productRepository.listAll();
        products.sort(Comparator.comparing(Product::getPrice).reversed());
        Map<Long, Integer> rawMaterialStock = rawMaterialRepository.listAll().stream()
                .collect(Collectors.toMap(rm -> rm.getId(), rm -> rm.getStockQuantity()));
        Map<Product, Integer> producible = new LinkedHashMap<>();
        BigDecimal totalValue = BigDecimal.ZERO;
        for (Product product : products) {
            int maxQty = Integer.MAX_VALUE;
            for (ProductRawMaterial prm : product.getRawMaterials()) {
                int stock = rawMaterialStock.getOrDefault(prm.getRawMaterial().getId(), 0);
                int possible = stock / prm.getRequiredQuantity();
                if (possible < maxQty) {
                    maxQty = possible;
                }
            }
            if (maxQty > 0 && maxQty != Integer.MAX_VALUE) {
                producible.put(product, maxQty);
                totalValue = totalValue.add(product.getPrice().multiply(BigDecimal.valueOf(maxQty)));
                for (ProductRawMaterial prm : product.getRawMaterials()) {
                    int used = prm.getRequiredQuantity() * maxQty;
                    rawMaterialStock.put(prm.getRawMaterial().getId(), rawMaterialStock.get(prm.getRawMaterial().getId()) - used);
                }
            }
        }
        Map<String, Object> result = new HashMap<>();
        result.put("products", producible.entrySet().stream().map(e -> Map.of(
                "product", e.getKey(),
                "quantity", e.getValue()
        )).collect(Collectors.toList()));
        result.put("totalValue", totalValue);
        return result;
    }
}
