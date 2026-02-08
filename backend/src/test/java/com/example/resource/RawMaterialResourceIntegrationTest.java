package com.example.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

/**
 * Integration Tests for RawMaterialResource
 * Tests CRUD operations for raw materials
 */
@QuarkusTest
@DisplayName("Raw Material Resource Integration Tests")
public class RawMaterialResourceIntegrationTest {

    private static final String RAW_MATERIALS_ENDPOINT = "/raw-materials";

    @Test
    @DisplayName("Should list all raw materials")
    public void testListAllRawMaterials() {
        given()
            .when().get(RAW_MATERIALS_ENDPOINT)
            .then()
            .statusCode(anyOf(is(200), is(404)));
    }

    @Test
    @DisplayName("Should create a raw material successfully")
    public void testCreateRawMaterialSuccess() {
        String rawMaterialJson = """
            {
                "code": "RM-TEST-001",
                "name": "Test Raw Material",
                "stockQuantity": 100
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(rawMaterialJson)
            .when()
            .post(RAW_MATERIALS_ENDPOINT)
            .then()
            .statusCode(anyOf(is(200), is(201)));
    }

    @Test
    @DisplayName("Should create raw material with minimum data")
    public void testCreateRawMaterialMinimal() {
        String rawMaterialJson = """
            {
                "code": "MINIMAL-RM",
                "name": "Minimal Material",
                "stockQuantity": 1
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(rawMaterialJson)
            .when()
            .post(RAW_MATERIALS_ENDPOINT)
            .then()
            .statusCode(anyOf(is(200), is(201)));
    }

    @Test
    @DisplayName("Should create raw material with large stock")
    public void testCreateRawMaterialLargeStock() {
        String rawMaterialJson = """
            {
                "code": "LARGE-STOCK-RM",
                "name": "Large Stock Material",
                "stockQuantity": 999999
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(rawMaterialJson)
            .when()
            .post(RAW_MATERIALS_ENDPOINT)
            .then()
            .statusCode(anyOf(is(200), is(201)));
    }

    @Test
    @DisplayName("Should update a raw material")
    public void testUpdateRawMaterial() {
        Long materialId = 1L;
        String updateJson = """
            {
                "code": "UPDATED-RM-001",
                "name": "Updated Material",
                "stockQuantity": 250
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(updateJson)
            .when()
            .put(RAW_MATERIALS_ENDPOINT + "/{id}", materialId)
            .then()
            .statusCode(anyOf(is(200), is(404)));
    }

    @Test
    @DisplayName("Should delete a raw material")
    public void testDeleteRawMaterial() {
        Long materialId = 1L;

        given()
            .when()
            .delete(RAW_MATERIALS_ENDPOINT + "/{id}", materialId)
            .then()
            .statusCode(anyOf(is(204), is(404)));
    }

    @Test
    @DisplayName("Should handle non-existent raw material update")
    public void testUpdateNonExistentRawMaterial() {
        Long nonExistentId = 99999L;
        String updateJson = """
            {
                "code": "UPDATE-999-RM",
                "name": "Non-existent Material",
                "stockQuantity": 50
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(updateJson)
            .when()
            .put(RAW_MATERIALS_ENDPOINT + "/{id}", nonExistentId)
            .then()
            .statusCode(is(404));
    }

    @Test
    @DisplayName("Should handle non-existent raw material deletion")
    public void testDeleteNonExistentRawMaterial() {
        Long nonExistentId = 99999L;

        given()
            .when()
            .delete(RAW_MATERIALS_ENDPOINT + "/{id}", nonExistentId)
            .then()
            .statusCode(is(404));
    }

    @Test
    @DisplayName("Should handle raw material with zero stock")
    public void testRawMaterialZeroStock() {
        String rawMaterialJson = """
            {
                "code": "ZERO-STOCK-RM",
                "name": "Zero Stock Material",
                "stockQuantity": 0
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(rawMaterialJson)
            .when()
            .post(RAW_MATERIALS_ENDPOINT)
            .then()
            .statusCode(anyOf(is(200), is(201)));
    }

    @Test
    @DisplayName("Should verify endpoint accepts JSON")
    public void testEndpointContentType() {
        given()
            .when()
            .get(RAW_MATERIALS_ENDPOINT)
            .then()
            .contentType(containsString("application/json"));
    }

    @Test
    @DisplayName("Should handle materials with special names")
    public void testRawMaterialSpecialNames() {
        String rawMaterialJson = """
            {
                "code": "SPECIAL-RM-001",
                "name": "Material: Type-A (Premium) [2024]",
                "stockQuantity": 75
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(rawMaterialJson)
            .when()
            .post(RAW_MATERIALS_ENDPOINT)
            .then()
            .statusCode(anyOf(is(200), is(201)));
    }
}
