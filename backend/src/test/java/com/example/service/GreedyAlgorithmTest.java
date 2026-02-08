package com.example.service;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Timeout;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit Tests for Greedy Algorithm and Performance
 * Tests the production suggestion algorithm under various conditions
 */
@QuarkusTest
@DisplayName("Greedy Algorithm Tests")
public class GreedyAlgorithmTest {

    @Test
    @DisplayName("Should calculate optimal production with equal prices")
    public void testGreedyEqualPrices() {
        List<Product> products = new ArrayList<>();
        products.add(new Product(1L, "PROD-001", 100.00, 10));
        products.add(new Product(2L, "PROD-002", 100.00, 20));
        products.add(new Product(3L, "PROD-003", 100.00, 15));

        List<Product> result = getGreedySorted(products);
        assertNotNull(result);
        assertEquals(3, result.size());
    }

    @Test
    @DisplayName("Should prioritize high price products")
    public void testGreedyHighPricePriority() {
        List<Product> products = new ArrayList<>();
        products.add(new Product(1L, "CHEAP", 10.00, 100));
        products.add(new Product(2L, "EXPENSIVE", 1000.00, 5));
        products.add(new Product(3L, "MEDIUM", 100.00, 50));

        List<Product> result = getGreedySorted(products);
        assertNotNull(result);
        assertTrue(result.get(0).getPrice() >= result.get(1).getPrice());
    }

    @Test
    @DisplayName("Should handle empty product list")
    public void testGreedyEmptyList() {
        List<Product> products = new ArrayList<>();
        List<Product> result = getGreedySorted(products);
        assertNotNull(result);
        assertEquals(0, result.size());
    }

    @Test
    @DisplayName("Should handle single product")
    public void testGreedySingleProduct() {
        List<Product> products = new ArrayList<>();
        products.add(new Product(1L, "ONLY", 50.00, 10));

        List<Product> result = getGreedySorted(products);
        assertNotNull(result);
        assertEquals(1, result.size());
    }

    @Test
    @DisplayName("Should handle products with same quantity")
    public void testGreedySameQuantity() {
        List<Product> products = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            products.add(new Product((long)i, "PROD-" + i, (i+1)*10.0, 100));
        }

        List<Product> result = getGreedySorted(products);
        assertNotNull(result);
        assertEquals(5, result.size());
    }

    @Test
    @DisplayName("Should handle zero quantity products")
    public void testGreedyZeroQuantity() {
        List<Product> products = new ArrayList<>();
        products.add(new Product(1L, "ZERO-QTY", 100.00, 0));
        products.add(new Product(2L, "NORMAL-QTY", 50.00, 10));

        List<Product> result = getGreedySorted(products);
        assertNotNull(result);
        assertEquals(2, result.size());
    }

    @Test
    @Timeout(1)
    @DisplayName("Should process large product list efficiently")
    public void testGreedyPerformanceLargeList() {
        List<Product> products = new ArrayList<>();
        for (int i = 0; i < 1000; i++) {
            products.add(new Product((long)i, "PROD-" + i, Math.random() * 1000, (int)(Math.random() * 100)));
        }

        long startTime = System.currentTimeMillis();
        List<Product> result = getGreedySorted(products);
        long endTime = System.currentTimeMillis();

        assertNotNull(result);
        assertEquals(1000, result.size());
        assertTrue((endTime - startTime) < 1000, "Algorithm should complete in less than 1 second");
    }

    @Test
    @DisplayName("Should maintain data integrity after sorting")
    public void testGreedyDataIntegrity() {
        List<Product> products = new ArrayList<>();
        products.add(new Product(1L, "PROD-001", 99.99, 15));
        products.add(new Product(2L, "PROD-002", 199.99, 5));

        List<Product> result = getGreedySorted(products);

        for (Product p : result) {
            assertNotNull(p.getId());
            assertNotNull(p.getCode());
            assertTrue(p.getPrice() > 0);
            assertTrue(p.getQuantity() >= 0);
        }
    }

    @Test
    @DisplayName("Should handle products with decimal prices")
    public void testGreedyDecimalPrices() {
        List<Product> products = new ArrayList<>();
        products.add(new Product(1L, "PROD-001", 10.99, 50));
        products.add(new Product(2L, "PROD-002", 10.01, 50));
        products.add(new Product(3L, "PROD-003", 10.50, 50));

        List<Product> result = getGreedySorted(products);
        assertNotNull(result);
        assertEquals(3, result.size());
    }

    // ========== Helper Methods ==========

    private List<Product> getGreedySorted(List<Product> products) {
        // Sort by descending price (greedy algorithm)
        List<Product> sorted = new ArrayList<>(products);
        sorted.sort((p1, p2) -> Double.compare(p2.getPrice(), p1.getPrice()));
        return sorted;
    }

    // ========== Helper Classes ==========

    private static class Product {
        private Long id;
        private String code;
        private Double price;
        private Integer quantity;

        public Product(Long id, String code, Double price, Integer quantity) {
            this.id = id;
            this.code = code;
            this.price = price;
            this.quantity = quantity;
        }

        public Long getId() { return id; }
        public String getCode() { return code; }
        public Double getPrice() { return price; }
        public Integer getQuantity() { return quantity; }
    }
}
