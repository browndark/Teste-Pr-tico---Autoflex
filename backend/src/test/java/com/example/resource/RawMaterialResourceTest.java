package com.example.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.RestAssured;
import org.junit.jupiter.api.Test;
import static org.hamcrest.Matchers.*;

@QuarkusTest
public class RawMaterialResourceTest {
    @Test
    public void testListRawMaterials() {
        RestAssured.given()
            .when().get("/raw-materials")
            .then()
            .statusCode(200);
    }

    @Test
    public void testCreateRawMaterial() {
        String code = "RM" + System.currentTimeMillis();
        String body = String.format("{\"code\": \"%s\", \"name\": \"Steel\", \"stockQuantity\": 100}", code);

        RestAssured.given()
            .contentType("application/json")
            .body(body)
            .when().post("/raw-materials")
            .then()
            .statusCode(200)
            .body("code", equalTo(code));
    }
}
