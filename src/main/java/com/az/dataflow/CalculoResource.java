package com.az.dataflow;

import java.math.BigDecimal;

import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

@Path("/calculo")
@Produces(MediaType.APPLICATION_JSON)
public class CalculoResource {

    @GET
    @Path("/restituicao-inss")
    public RestituicaoInssResponse calcularRestituicaoInss(
            @QueryParam("valorContrato") BigDecimal valorContrato,
            @QueryParam("valorMateriais") BigDecimal valorMateriais,
            @QueryParam("percentualBase") BigDecimal percentualBase,
            @QueryParam("aliquotaInss") BigDecimal aliquotaInss) {
        if (valorContrato == null) {
            throw new BadRequestException("Informe o parâmetro 'valorContrato'.");
        }
        if (valorContrato.signum() < 0) {
            throw new BadRequestException("'valorContrato' não pode ser negativo.");
        }

        final InssObraConstrucaoCivil.Result r;
        try {
            r = InssObraConstrucaoCivil.calcular(valorContrato, valorMateriais, percentualBase, aliquotaInss);
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException(ex.getMessage());
        }

        return new RestituicaoInssResponse(
                r.valorContrato(),
                r.valorMateriais(),
                r.valorConsiderado(),
                r.percentualBase(),
                r.aliquotaInss(),
                r.baseInss(),
                r.inss());
    }

    public record RestituicaoInssResponse(
            BigDecimal valorContrato,
            BigDecimal valorMateriais,
            BigDecimal valorConsiderado,
            BigDecimal percentualBase,
            BigDecimal aliquotaInss,
            BigDecimal baseCalculo,
            BigDecimal restituicaoInss) {
    }
}
