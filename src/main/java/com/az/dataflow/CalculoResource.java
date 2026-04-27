package com.az.dataflow;

import java.math.BigDecimal;
import java.math.RoundingMode;

import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

@Path("/calculo")
@Produces(MediaType.APPLICATION_JSON)
public class CalculoResource {

    private static final BigDecimal PERCENTUAL_BASE_INSS = new BigDecimal("0.40");
    private static final BigDecimal ALIQUOTA_INSS = new BigDecimal("0.11");

    @GET
    @Path("/restituicao-inss")
    public RestituicaoInssResponse calcularRestituicaoInss(@QueryParam("valorContrato") BigDecimal valorContrato) {
        if (valorContrato == null) {
            throw new BadRequestException("Informe o parâmetro 'valorContrato'.");
        }
        if (valorContrato.signum() < 0) {
            throw new BadRequestException("'valorContrato' não pode ser negativo.");
        }

        BigDecimal baseCalculo = valorContrato.multiply(PERCENTUAL_BASE_INSS);
        BigDecimal restitucao = baseCalculo.multiply(ALIQUOTA_INSS);

        return new RestituicaoInssResponse(
                valorContrato.setScale(2, RoundingMode.HALF_UP),
                baseCalculo.setScale(2, RoundingMode.HALF_UP),
                restitucao.setScale(2, RoundingMode.HALF_UP)
        );
    }

    public record RestituicaoInssResponse(BigDecimal valorContrato, BigDecimal baseCalculo, BigDecimal restitucaoInss) {
    }
}

