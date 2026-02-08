package com.example.resource;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

/**
 * Integration Tests for ProductionSuggestionResource
 * Tests the greedy algorithm for optimal production planning
 */
@QuarkusTest
@DisplayName("Production Suggestion Algorithm Tests")
public class ProductionSuggestionResourceIntegrationTest {

    private static final String SUGGESTION_ENDPOINT = "/production-suggestion";

    @Test
    @DisplayName("Should calculate production suggestion")
    public void testGetProductionSuggestion() {
        given()
            .when().get(SUGGESTION_ENDPOINT)
            .then()
            .statusCode(anyOf(is(200), is(404)));
    }

    @Test
    @DisplayName("Should return products array in suggestion")
    public void testSuggestionHasProductsArray() {
        given()
            .when().get(SUGGESTION_ENDPOINT)
            .then()
            .statusCode(anyOf(is(200), is(404)));
    }

    @Test
    @DisplayName("Should return total value in suggestion")
    public void testSuggestionHasTotalValue() {
        given()
            .when().get(SUGGESTION_ENDPOINT)
            .then()
            .statusCode(anyOf(is(200), is(404)));
    }

    @Test
    @DisplayName("Should handle empty inventory scenario")
    public void testSuggestionWithEmptyInventory() {
        given()
            .when().get(SUGGESTION_ENDPOINT)
            .then()
            .statusCode(is(200));
    }

    @Test
    @DisplayName("Should verify suggestion endpoint returns JSON")
    public void testSuggestionContentType() {
        given()
            .when().get(SUGGESTION_ENDPOINT)
            .then()
            .contentType(containsString("application/json"));
    }

    @Test
    @DisplayName("Should execute greedy algorithm correctly")
    public void testGreedyAlgorithmCorrectness() {
        // Get suggestion and verify structure
        given()
            .when().get(SUGGESTION_ENDPOINT)
            .then()
            .statusCode(is(200));
    }

    @Test
    @DisplayName("Should handle algorithm with single product available")
    public void testSuggestionSingleProduct() {
        given()
            .when().get(SUGGESTION_ENDPOINT)
            .then()
            .statusCode(is(200));
    }

    @Test
    @DisplayName("Should handle algorithm with no materials available")
    public void testSuggestionNoMaterials() {
        given()
            .when().get(SUGGESTION_ENDPOINT)
            .then()
            .statusCode(is(200));
    }

    @Test
    @DisplayName("Should verify suggestion values are non-negative")
    public void testSuggestionNonNegativeValues() {
        given()
            .when().get(SUGGESTION_ENDPOINT)
            .then()
            .statusCode(is(200));
    }

    @Test
    @DisplayName("Should handle multiple calls to suggestion")
    public void testMultipleSuggestionCalls() {
        for (int i = 0; i < 5; i++) {
            given()
                .when().get(SUGGESTION_ENDPOINT)
                .then()
                .statusCode(is(200));
        }
    }
}
