package com.az.dataflow.resource;

import com.az.dataflow.dto.request.FatorESocialRequest;
import com.az.dataflow.dto.response.FatorESocialRelatorioResponse;
import com.az.dataflow.dto.response.FatorESocialResponse;
import com.az.dataflow.dto.response.PageResponse;
import com.az.dataflow.service.FatorESocialService;

import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.validation.Valid;

@Path("/fator-esocial")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class FatorESocialResource {

    @Inject
    FatorESocialService fatorESocialService;

    @GET
    public PageResponse<FatorESocialResponse> listar(
            @QueryParam("q") String q,
            @QueryParam("page") Integer page,
            @QueryParam("perPage") Integer perPage) {
        return fatorESocialService.listar(q, page, perPage);
    }

    @POST
    public FatorESocialResponse criar(@Valid FatorESocialRequest req) {
        return fatorESocialService.criar(req);
    }

    @PUT
    @Path("/{id}")
    public FatorESocialResponse atualizar(@PathParam("id") Long id, @Valid FatorESocialRequest body) {
        return fatorESocialService.atualizar(id, body);
    }

    @GET
    @Path("/{id}")
    public FatorESocialResponse getById(@PathParam("id") Long id) {
        return fatorESocialService.buscarPorId(id);
    }

    @GET
    @Path("/{id}/relatorio")
    public FatorESocialRelatorioResponse relatorio(@PathParam("id") Long id) {
        return fatorESocialService.gerarRelatorio(id);
    }

    @DELETE
    @Path("/{id}")
    public Response deletar(@PathParam("id") Long id) {
        boolean deleted = fatorESocialService.deletar(id);
        if (!deleted) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.noContent().build();
    }
}
