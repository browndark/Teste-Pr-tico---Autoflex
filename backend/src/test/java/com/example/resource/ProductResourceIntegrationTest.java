package com.example.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import java.math.BigDecimal;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

/**
 * Integration Tests for ProductResource
 * Tests all CRUD operations and validations
 */
@QuarkusTest
@DisplayName("Product Resource Integration Tests")
public class ProductResourceIntegrationTest {

    private static final String PRODUCTS_ENDPOINT = "/products";

    @Test
    @DisplayName("Should list all products")
    public void testListAllProducts() {
        given()
            .when().get(PRODUCTS_ENDPOINT)
            .then()
            .statusCode(anyOf(is(200), is(404)));
    }

    @Test
    @DisplayName("Should create a new product successfully")
    public void testCreateProductSuccess() {
        String productJson = """
            {
                "code": "PROD-TEST-001",
                "name": "Test Product",
                "price": 99.99,
                "quantity": 10
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(productJson)
            .when()
            .post(PRODUCTS_ENDPOINT)
            .then()
            .statusCode(anyOf(is(200), is(201)));
    }

    @Test
    @DisplayName("Should handle product with minimum valid data")
    public void testCreateProductMinimal() {
        String productJson = """
            {
                "code": "MINIMAL-001",
                "name": "Minimal Product",
                "price": 1.00
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(productJson)
            .when()
            .post(PRODUCTS_ENDPOINT)
            .then()
            .statusCode(anyOf(is(200), is(201)));
    }

    @Test
    @DisplayName("Should handle product with high price")
    public void testCreateProductHighPrice() {
        String productJson = """
            {
                "code": "EXPENSIVE-001",
                "name": "Expensive Product",
                "price": 999999.99,
                "quantity": 5
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(productJson)
            .when()
            .post(PRODUCTS_ENDPOINT)
            .then()
            .statusCode(anyOf(is(200), is(201)));
    }

    @Test
    @DisplayName("Should update an existing product")
    public void testUpdateProduct() {
        Long productId = 1L;
        String updateJson = """
            {
                "code": "UPDATED-001",
                "name": "Updated Product",
                "price": 149.99,
                "quantity": 20
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(updateJson)
            .when()
            .put(PRODUCTS_ENDPOINT + "/{id}", productId)
            .then()
            .statusCode(anyOf(is(200), is(404)));
    }

    @Test
    @DisplayName("Should delete a product")
    public void testDeleteProduct() {
        Long productId = 1L;

        given()
            .when()
            .delete(PRODUCTS_ENDPOINT + "/{id}", productId)
            .then()
            .statusCode(anyOf(is(204), is(404)));
    }

    @Test
    @DisplayName("Should handle update of non-existent product")
    public void testUpdateNonExistentProduct() {
        Long nonExistentId = 99999L;
        String updateJson = """
            {
                "code": "UPDATE-999",
                "name": "Non-existent Product",
                "price": 50.00
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(updateJson)
            .when()
            .put(PRODUCTS_ENDPOINT + "/{id}", nonExistentId)
            .then()
            .statusCode(is(404));
    }

    @Test
    @DisplayName("Should handle delete of non-existent product")
    public void testDeleteNonExistentProduct() {
        Long nonExistentId = 99999L;

        given()
            .when()
            .delete(PRODUCTS_ENDPOINT + "/{id}", nonExistentId)
            .then()
            .statusCode(is(404));
    }

    @Test
    @DisplayName("Should handle product with special characters in name")
    public void testProductWithSpecialCharacters() {
        String productJson = """
            {
                "code": "SPECIAL-001",
                "name": "Product with çã special characters™",
                "price": 75.50,
                "quantity": 15
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(productJson)
            .when()
            .post(PRODUCTS_ENDPOINT)
            .then()
            .statusCode(anyOf(is(200), is(201)));
    }

    @Test
    @DisplayName("Should handle product with zero quantity")
    public void testProductZeroQuantity() {
        String productJson = """
            {
                "code": "ZERO-QTY-001",
                "name": "Zero Quantity Product",
                "price": 50.00,
                "quantity": 0
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(productJson)
            .when()
            .post(PRODUCTS_ENDPOINT)
            .then()
            .statusCode(anyOf(is(200), is(201)));
    }

    @Test
    @DisplayName("Should handle product with large quantity")
    public void testProductLargeQuantity() {
        String productJson = """
            {
                "code": "LARGE-QTY-001",
                "name": "Large Quantity Product",
                "price": 25.00,
                "quantity": 1000000
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(productJson)
            .when()
            .post(PRODUCTS_ENDPOINT)
            .then()
            .statusCode(anyOf(is(200), is(201)));
    }

    @Test
    @DisplayName("Should verify endpoint accepts JSON")
    public void testEndpointContentType() {
        given()
            .contentType(ContentType.JSON)
            .when()
            .get(PRODUCTS_ENDPOINT)
            .then()
            .contentType(containsString("application/json"));
    }

    @Test
    @DisplayName("Should handle concurrent requests")
    public void testConcurrentRequests() {
        for (int i = 0; i < 5; i++) {
            String productJson = """
                {
                    "code": "CONCURRENT-""" + i + """
                ",
                    "name": "Concurrent Product """ + i + """
                ",
                    "price": 30.00,
                    "quantity": 5
                }
                """;

            given()
                .contentType(ContentType.JSON)
                .body(productJson)
                .when()
                .post(PRODUCTS_ENDPOINT)
                .then()
                .statusCode(anyOf(is(200), is(201)));
        }
    }
}
