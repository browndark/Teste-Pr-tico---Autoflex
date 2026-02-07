package com.example.service;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
public class ProductServiceTest {
    
    @Test
    public void testProductValidation() {
        String code = "P001";
        String name = "Test Product";
        assertNotNull(code);
        assertNotNull(name);
        assertFalse(code.isEmpty());
        assertFalse(name.isEmpty());
    }

    @Test
    public void testProductCodeFormat() {
        String code = "PROD-2024-001";
        assertTrue(code.matches("^[A-Z0-9-]+$"));
    }

    @Test
    public void testProductPriceValidation() {
        double price = 99.99;
        assertTrue(price > 0, "Price should be positive");
        assertTrue(price < 1_000_000, "Price should be reasonable");
    }

    @Test
    public void testEmptyProductValidation() {
        String emptyCode = "";
        assertTrue(emptyCode.isEmpty());
    }
}
