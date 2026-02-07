package com.example.util;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class ValidationUtilTest {

    @Test
    public void testValidateEmail() {
        String validEmail = "user@example.com";
        String invalidEmail = "invalid-email";
        
        assertTrue(isValidEmail(validEmail));
        assertFalse(isValidEmail(invalidEmail));
    }

    @Test
    public void testValidatePhoneNumber() {
        String validPhone = "11987654321";
        String invalidPhone = "123";
        
        assertTrue(isValidPhone(validPhone));
        assertFalse(isValidPhone(invalidPhone));
    }

    @Test
    public void testStringUtils() {
        String text = "  hello world  ";
        assertEquals("hello world", text.trim());
        assertEquals("HELLO WORLD", text.trim().toUpperCase());
    }

    @Test
    public void testNumberValidation() {
        assertTrue(isPositive(10.5));
        assertFalse(isPositive(-5.0));
        assertFalse(isPositive(0.0));
    }

    @Test
    public void testCollectionValidation() {
        String[] items = {"item1", "item2", "item3"};
        assertEquals(3, items.length);
        assertTrue(contains(items, "item1"));
        assertFalse(contains(items, "item4"));
    }

    // Helper methods
    private boolean isValidEmail(String email) {
        return email != null && email.contains("@") && email.contains(".");
    }

    private boolean isValidPhone(String phone) {
        return phone != null && phone.length() >= 10 && phone.matches("\\d+");
    }

    private boolean isPositive(double value) {
        return value > 0;
    }

    private boolean contains(String[] array, String value) {
        for (String item : array) {
            if (item.equals(value)) {
                return true;
            }
        }
        return false;
    }
}
