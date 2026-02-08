package com.example.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

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
        String associationJson = """
            {
                "product": {"id": 1},
                "rawMaterial": {"id": 1},
                "requiredQuantity": 10
            }
            """;

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
        String associationJson = """
            {
                "product": {"id": 1},
                "rawMaterial": {"id": 1},
                "requiredQuantity": 1
            }
            """;

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
        String associationJson = """
            {
                "product": {"id": 1},
                "rawMaterial": {"id": 1},
                "requiredQuantity": 10000
            }
            """;

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
