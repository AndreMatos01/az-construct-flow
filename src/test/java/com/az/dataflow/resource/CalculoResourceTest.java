package com.az.dataflow.resource;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

@QuarkusTest
class CalculoResourceTest {

    @Test
    void restituicaoInssComParametrosPadrao() {
        given()
                .queryParam("valorContrato", 100000)
                .when()
                .get("/calculo/restituicao-inss")
                .then()
                .statusCode(200)
                .body("valorContrato", equalTo(100000.0F))
                .body("valorMateriais", equalTo(0.0F))
                .body("valorConsiderado", equalTo(100000.0F))
                .body("percentualBase", equalTo(40.0F))
                .body("aliquotaInss", equalTo(11.0F))
                .body("baseCalculo", equalTo(40000.0F))
                .body("restituicaoInss", equalTo(4400.0F));
    }

    @Test
    void restituicaoInssExigeValorContrato() {
        given()
                .when()
                .get("/calculo/restituicao-inss")
                .then()
                .statusCode(400);
    }
}
