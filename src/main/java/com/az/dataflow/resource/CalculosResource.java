package com.az.dataflow.resource;

import java.util.List;

import com.az.dataflow.domain.entity.CalculoObra;
import com.az.dataflow.dto.request.CalculoObraRequest;
import com.az.dataflow.dto.response.CalculoObraResponse;
import com.az.dataflow.dto.response.PageResponse;
import com.az.dataflow.service.CalculoObraService;

import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.validation.Valid;

@Path("/calculos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CalculosResource {

    @Inject
    CalculoObraService calculoObraService;

    @GET
    public List<CalculoObra> listar() {
        return calculoObraService.listar();
    }

    @GET
    @Path("/all")
    public List<CalculoObraResponse> listarAll() {
        return calculoObraService.listarAll();
    }

    @GET
    @Path("/paged")
    public PageResponse<CalculoObraResponse> listarPaginado(
            @QueryParam("page") Integer page,
            @QueryParam("perPage") Integer perPage) {
        return calculoObraService.listarPaginado(page, perPage);
    }

    @POST
    public CalculoObraResponse criar(@Valid CalculoObraRequest req) {
        return calculoObraService.criar(req);
    }
}
