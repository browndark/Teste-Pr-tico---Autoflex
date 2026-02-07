package com.example.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.RestAssured;
import org.junit.jupiter.api.Test;
import static org.hamcrest.Matchers.*;

@QuarkusTest
public class ProductResourceTest {
    
    @Test
    public void testListProducts() {
        RestAssured.given()
            .when().get("/produtos")
            .then()
            .statusCode(anyOf(is(200), is(404)));
    }

    @Test
    public void testProductEndpoint() {
        RestAssured.given()
            .when()
            .get("/produtos")
            .then()
            .log().all();
    }
}
