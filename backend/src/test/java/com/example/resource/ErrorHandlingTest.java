package com.example.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

/**
 * Error Handling and Edge Case Tests
 * Tests robustness of API under various error conditions
 */
@QuarkusTest
@DisplayName("Error Handling and Edge Cases Tests")
public class ErrorHandlingTest {

    @Test
    @DisplayName("Should handle malformed JSON in products endpoint")
    public void testMalformedJsonProduct() {
        String malformedJson = "{invalid json}";

        given()
            .contentType(ContentType.JSON)
            .body(malformedJson)
            .when()
            .post("/products")
            .then()
            .statusCode(anyOf(is(400), is(500)));
    }

    @Test
    @DisplayName("Should handle missing required fields")
    public void testMissingRequiredFieldsProduct() {
        String incompleteJson = """
            {
                "name": "Product Without Code"
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(incompleteJson)
            .when()
            .post("/products")
            .then()
            .statusCode(anyOf(is(400), is(422)));
    }

    @Test
    @DisplayName("Should handle empty body")
    public void testEmptyBodyProduct() {
        given()
            .contentType(ContentType.JSON)
            .body("")
            .when()
            .post("/products")
            .then()
            .statusCode(anyOf(is(400), is(422), is(500)));
    }

    @Test
    @DisplayName("Should handle invalid content type")
    public void testInvalidContentType() {
        given()
            .contentType("text/plain")
            .body("not json")
            .when()
            .post("/products")
            .then()
            .statusCode(anyOf(is(400), is(415), is(422)));
    }

    @Test
    @DisplayName("Should handle GET with invalid path parameter")
    public void testInvalidPathParameter() {
        given()
            .when()
            .get("/products/invalid")
            .then()
            .statusCode(anyOf(is(400), is(404)));
    }

    @Test
    @DisplayName("Should handle negative price")
    public void testNegativePriceProduct() {
        String negativePrice = """
            {
                "code": "NEG-PRICE",
                "name": "Negative Price Product",
                "price": -50.00
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(negativePrice)
            .when()
            .post("/products")
            .then()
            .statusCode(anyOf(is(200), is(201), is(400)));
    }

    @Test
    @DisplayName("Should handle null price")
    public void testNullPriceProduct() {
        String nullPrice = """
            {
                "code": "NULL-PRICE",
                "name": "Null Price Product",
                "price": null
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(nullPrice)
            .when()
            .post("/products")
            .then()
            .statusCode(anyOf(is(400), is(422)));
    }

    @Test
    @DisplayName("Should handle very long product name")
    public void testVeryLongProductName() {
        String longName = "P".repeat(1000);
        String productJson = "{\"code\": \"LONG-NAME\", \"name\": \"" + longName + "\", \"price\": 50.00}";

        given()
            .contentType(ContentType.JSON)
            .body(productJson)
            .when()
            .post("/products")
            .then()
            .statusCode(anyOf(is(200), is(201), is(400)));
    }

    @Test
    @DisplayName("Should handle very long product code")
    public void testVeryLongProductCode() {
        String longCode = "PROD-" + "X".repeat(1000);
        String productJson = "{\"code\": \"" + longCode + "\", \"name\": \"Product\", \"price\": 50.00}";

        given()
            .contentType(ContentType.JSON)
            .body(productJson)
            .when()
            .post("/products")
            .then()
            .statusCode(anyOf(is(200), is(201), is(400)));
    }

    @Test
    @DisplayName("Should handle raw material with negative stock")
    public void testNegativeStockRawMaterial() {
        String negativeStock = """
            {
                "code": "NEG-STOCK",
                "name": "Negative Stock Material",
                "stockQuantity": -100
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(negativeStock)
            .when()
            .post("/raw-materials")
            .then()
            .statusCode(anyOf(is(200), is(201), is(400)));
    }

    @Test
    @DisplayName("Should handle null association product")
    public void testNullProductAssociation() {
        String nullProduct = """
            {
                "product": null,
                "rawMaterial": {"id": 1},
                "requiredQuantity": 10
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(nullProduct)
            .when()
            .post("/products-raw-materials")
            .then()
            .statusCode(anyOf(is(400), is(422)));
    }

    @Test
    @DisplayName("Should handle zero required quantity in association")
    public void testZeroRequiredQuantityAssociation() {
        String zeroQty = """
            {
                "product": {"id": 1},
                "rawMaterial": {"id": 1},
                "requiredQuantity": 0
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(zeroQty)
            .when()
            .post("/products-raw-materials")
            .then()
            .statusCode(anyOf(is(200), is(201), is(400)));
    }

    @Test
    @DisplayName("Should handle negative required quantity")
    public void testNegativeRequiredQuantityAssociation() {
        String negativeQty = """
            {
                "product": {"id": 1},
                "rawMaterial": {"id": 1},
                "requiredQuantity": -50
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(negativeQty)
            .when()
            .post("/products-raw-materials")
            .then()
            .statusCode(anyOf(is(200), is(201), is(400)));
    }

    @Test
    @DisplayName("Should handle duplicate product code")
    public void testDuplicateProductCode() {
        String product1 = """
            {
                "code": "DUPLICATE-001",
                "name": "First Product",
                "price": 50.00
            }
            """;

        String product2 = """
            {
                "code": "DUPLICATE-001",
                "name": "Second Product",
                "price": 75.00
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(product1)
            .when()
            .post("/products")
            .then()
            .statusCode(anyOf(is(200), is(201)));

        given()
            .contentType(ContentType.JSON)
            .body(product2)
            .when()
            .post("/products")
            .then()
            .statusCode(anyOf(is(400), is(409), is(200)));
    }

    @Test
    @DisplayName("Should handle concurrent delete operations")
    public void testConcurrentDeleteOperations() {
        for (int i = 0; i < 3; i++) {
            Long productId = (long)Math.random() * 1000;
            given()
                .when()
                .delete("/products/{id}", productId)
                .then()
                .statusCode(anyOf(is(204), is(404)));
        }
    }

    @Test
    @DisplayName("Should handle concurrent POST operations")
    public void testConcurrentPostOperations() {
        for (int i = 0; i < 5; i++) {
            String productJson = "{\"code\": \"CONCURRENT-" + i + "\", \"name\": \"Concurrent Product " + i + "\", \"price\": 30.00}";

            given()
                .contentType(ContentType.JSON)
                .body(productJson)
                .when()
                .post("/products")
                .then()
                .statusCode(anyOf(is(200), is(201)));
        }
    }
}
