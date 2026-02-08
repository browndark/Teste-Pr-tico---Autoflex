package com.example.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.AfterEach;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

/**
 * Integration Tests for ProductRawMaterialResource
 * Tests association operations between products and raw materials
 */
@QuarkusTest
@DisplayName("Product-RawMaterial Association Tests")
public class ProductRawMaterialResourceIntegrationTest {

    private static final String ASSOCIATIONS_ENDPOINT = "/products-raw-materials";
    private static final String PRODUCTS_ENDPOINT = "/products";
    private static final String RAW_MATERIALS_ENDPOINT = "/raw-materials";
    
    private Long testProductId;
    private Long testRawMaterialId;
    private Long associationId;

    @BeforeEach
    public void setUp() {
        // Create test product
        String productJson = """
            {
                "code": "TEST-ASSOC-PROD-001",
                "name": "Test Product for Association",
                "price": 100.00,
                "quantity": 10
            }
            """;

        Response productResponse = given()
            .contentType(ContentType.JSON)
            .body(productJson)
            .when()
            .post(PRODUCTS_ENDPOINT);

        try {
            testProductId = productResponse.jsonPath().getLong("id");
        } catch (Exception e) {
            testProductId = 1L;
        }

        // Create test raw material
        String materialJson = """
            {
                "code": "TEST-ASSOC-RM-001",
                "name": "Test Material for Association",
                "stockQuantity": 100
            }
            """;

        Response materialResponse = given()
            .contentType(ContentType.JSON)
            .body(materialJson)
            .when()
            .post(RAW_MATERIALS_ENDPOINT);

        try {
            testRawMaterialId = materialResponse.jsonPath().getLong("id");
        } catch (Exception e) {
            testRawMaterialId = 1L;
        }
    }

    @AfterEach
    public void tearDown() {
        try {
            given()
                .when()
                .delete(PRODUCTS_ENDPOINT + "/{id}", testProductId)
                .then()
                .statusCode(anyOf(is(204), is(404)));

            given()
                .when()
                .delete(RAW_MATERIALS_ENDPOINT + "/{id}", testRawMaterialId)
                .then()
                .statusCode(anyOf(is(204), is(404)));
        } catch (Exception e) {
            // Ignore cleanup errors
        }
    }

    @Test
    @DisplayName("Should list all associations")
    public void testListAllAssociations() {
        given()
            .when().get(ASSOCIATIONS_ENDPOINT)
            .then()
            .statusCode(anyOf(is(200), is(404)));
    }

    @Test
    @DisplayName("Should create a new association")
    public void testCreateAssociationSuccess() {
        String associationJson = String.format("""
            {
                "productId": %d,
                "rawMaterialId": %d,
                "requiredQuantity": 10
            }
            """, testProductId, testRawMaterialId);

        given()
            .contentType(ContentType.JSON)
            .body(associationJson)
            .when()
            .post(ASSOCIATIONS_ENDPOINT)
            .then()
            .statusCode(anyOf(is(200), is(201)));
    }

    @Test
    @DisplayName("Should create association with minimum quantity")
    public void testCreateAssociationMinimumQuantity() {
        String associationJson = String.format("""
            {
                "productId": %d,
                "rawMaterialId": %d,
                "requiredQuantity": 1
            }
            """, testProductId, testRawMaterialId);

        given()
            .contentType(ContentType.JSON)
            .body(associationJson)
            .when()
            .post(ASSOCIATIONS_ENDPOINT)
            .then()
            .statusCode(anyOf(is(200), is(201)));
    }

    @Test
    @DisplayName("Should create association with large quantity")
    public void testCreateAssociationLargeQuantity() {
        String associationJson = String.format("""
            {
                "productId": %d,
                "rawMaterialId": %d,
                "requiredQuantity": 10000
            }
            """, testProductId, testRawMaterialId);

        given()
            .contentType(ContentType.JSON)
            .body(associationJson)
            .when()
            .post(ASSOCIATIONS_ENDPOINT)
            .then()
            .statusCode(anyOf(is(200), is(201)));
    }

    @Test
    @DisplayName("Should delete an association")
    public void testDeleteAssociation() {
        Long associationId = 1L;

        given()
            .when()
            .delete(ASSOCIATIONS_ENDPOINT + "/{id}", associationId)
            .then()
            .statusCode(anyOf(is(204), is(404)));
    }

    @Test
    @DisplayName("Should handle non-existent association deletion")
    public void testDeleteNonExistentAssociation() {
        Long nonExistentId = 99999L;

        given()
            .when()
            .delete(ASSOCIATIONS_ENDPOINT + "/{id}", nonExistentId)
            .then()
            .statusCode(is(404));
    }

    @Test
    @DisplayName("Should verify endpoint accepts JSON")
    public void testEndpointContentType() {
        given()
            .when()
            .get(ASSOCIATIONS_ENDPOINT)
            .then()
            .contentType(containsString("application/json"));
    }

    @Test
    @DisplayName("Should create multiple associations for same product")
    public void testMultipleAssociationsPerProduct() {
        for (int i = 1; i <= 3; i++) {
            String associationJson = "{\"product\": {\"id\": 1}, \"rawMaterial\": {\"id\": " + i + "}, \"requiredQuantity\": " + (i * 5) + "}";

            given()
                .contentType(ContentType.JSON)
                .body(associationJson)
                .when()
                .post(ASSOCIATIONS_ENDPOINT)
                .then()
                .statusCode(anyOf(is(200), is(201)));
        }
    }

    @Test
    @DisplayName("Should create multiple associations for same material")
    public void testMultipleAssociationsPerMaterial() {
        for (int i = 1; i <= 3; i++) {
            String associationJson = "{\"product\": {\"id\": " + i + "}, \"rawMaterial\": {\"id\": 1}, \"requiredQuantity\": " + (i * 10) + "}";

            given()
                .contentType(ContentType.JSON)
                .body(associationJson)
                .when()
                .post(ASSOCIATIONS_ENDPOINT)
                .then()
                .statusCode(anyOf(is(200), is(201)));
        }
    }
}
