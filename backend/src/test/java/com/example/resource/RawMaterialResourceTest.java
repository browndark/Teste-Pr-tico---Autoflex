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
}
