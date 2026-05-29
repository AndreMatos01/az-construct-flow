package com.az.dataflow.resource;

import java.math.BigDecimal;

import com.az.dataflow.dto.response.RestituicaoInssResponse;
import com.az.dataflow.service.CalculoObraService;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

@Path("/calculo")
@Produces(MediaType.APPLICATION_JSON)
public class CalculoResource {

    @Inject
    CalculoObraService calculoObraService;

    @GET
    @Path("/restituicao-inss")
    public RestituicaoInssResponse calcularRestituicaoInss(
            @QueryParam("valorContrato") BigDecimal valorContrato,
            @QueryParam("valorMateriais") BigDecimal valorMateriais,
            @QueryParam("percentualBase") BigDecimal percentualBase,
            @QueryParam("aliquotaInss") BigDecimal aliquotaInss) {
        return calculoObraService.calcularRestituicaoInss(
                valorContrato, valorMateriais, percentualBase, aliquotaInss);
    }
}
