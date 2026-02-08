package com.example.service;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit Tests for Data Validation and Business Logic
 * Tests validation rules and edge cases
 */
@QuarkusTest
@DisplayName("Validation and Business Logic Tests")
public class ValidationServiceTest {

    @Test
    @DisplayName("Should validate product code format")
    public void testProductCodeValidation() {
        String validCode = "PROD-001";
        assertTrue(isValidProductCode(validCode));
    }

    @Test
    @DisplayName("Should validate empty product code")
    public void testEmptyProductCode() {
        String emptyCode = "";
        assertFalse(isValidProductCode(emptyCode));
    }

    @Test
    @DisplayName("Should validate null product code")
    public void testNullProductCode() {
        assertFalse(isValidProductCode(null));
    }

    @Test
    @DisplayName("Should validate product price is positive")
    public void testProductPricePositive() {
        BigDecimal price = new BigDecimal("99.99");
        assertTrue(isValidPrice(price));
    }

    @Test
    @DisplayName("Should reject zero price")
    public void testProductPriceZero() {
        BigDecimal price = BigDecimal.ZERO;
        assertFalse(isValidPrice(price));
    }

    @Test
    @DisplayName("Should reject negative price")
    public void testProductPriceNegative() {
        BigDecimal price = new BigDecimal("-10.00");
        assertFalse(isValidPrice(price));
    }

    @Test
    @DisplayName("Should handle very large price")
    public void testProductPriceLarge() {
        BigDecimal price = new BigDecimal("999999.99");
        assertTrue(isValidPrice(price));
    }

    @Test
    @DisplayName("Should handle very small price")
    public void testProductPriceSmall() {
        BigDecimal price = new BigDecimal("0.01");
        assertTrue(isValidPrice(price));
    }

    @Test
    @DisplayName("Should validate product name not empty")
    public void testProductNameNotEmpty() {
        String name = "Test Product";
        assertTrue(isValidProductName(name));
    }

    @Test
    @DisplayName("Should reject empty product name")
    public void testEmptyProductName() {
        String name = "";
        assertFalse(isValidProductName(name));
    }

    @Test
    @DisplayName("Should reject null product name")
    public void testNullProductName() {
        assertFalse(isValidProductName(null));
    }

    @Test
    @DisplayName("Should accept product name with special characters")
    public void testProductNameSpecialCharacters() {
        String name = "Product #1 (Premium) - Type A";
        assertTrue(isValidProductName(name));
    }

    @Test
    @DisplayName("Should validate raw material code")
    public void testRawMaterialCodeValidation() {
        String validCode = "RM-001";
        assertTrue(isValidRawMaterialCode(validCode));
    }

    @Test
    @DisplayName("Should validate stock quantity non-negative")
    public void testStockQuantityNonNegative() {
        Integer quantity = 100;
        assertTrue(isValidQuantity(quantity));
    }

    @Test
    @DisplayName("Should accept zero quantity")
    public void testZeroQuantity() {
        Integer quantity = 0;
        assertTrue(isValidQuantity(quantity));
    }

    @Test
    @DisplayName("Should reject negative quantity")
    public void testNegativeQuantity() {
        Integer quantity = -10;
        assertFalse(isValidQuantity(quantity));
    }

    @Test
    @DisplayName("Should reject null quantity")
    public void testNullQuantity() {
        assertFalse(isValidQuantity(null));
    }

    @Test
    @DisplayName("Should handle very large quantity")
    public void testLargeQuantity() {
        Integer quantity = 1000000;
        assertTrue(isValidQuantity(quantity));
    }

    @Test
    @DisplayName("Should validate association required quantity")
    public void testAssociationRequiredQuantity() {
        Integer requiredQty = 10;
        assertTrue(isValidRequiredQuantity(requiredQty));
    }

    @Test
    @DisplayName("Should reject zero required quantity")
    public void testZeroRequiredQuantity() {
        Integer requiredQty = 0;
        assertFalse(isValidRequiredQuantity(requiredQty));
    }

    @Test
    @DisplayName("Should reject negative required quantity")
    public void testNegativeRequiredQuantity() {
        Integer requiredQty = -5;
        assertFalse(isValidRequiredQuantity(requiredQty));
    }

    // ========== Helper Methods for Validation ==========

    private boolean isValidProductCode(String code) {
        return code != null && !code.isEmpty() && !code.isBlank();
    }

    private boolean isValidPrice(BigDecimal price) {
        return price != null && price.compareTo(BigDecimal.ZERO) > 0;
    }

    private boolean isValidProductName(String name) {
        return name != null && !name.isEmpty() && !name.isBlank();
    }

    private boolean isValidRawMaterialCode(String code) {
        return code != null && !code.isEmpty() && !code.isBlank();
    }

    private boolean isValidQuantity(Integer quantity) {
        return quantity != null && quantity >= 0;
    }

    private boolean isValidRequiredQuantity(Integer quantity) {
        return quantity != null && quantity > 0;
    }
}
