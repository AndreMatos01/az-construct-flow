package com.az.dataflow.resource;

import com.az.dataflow.dto.request.CalculoSeroRequest;
import com.az.dataflow.dto.response.CalculoSeroResponse;
import com.az.dataflow.dto.response.PageResponse;
import com.az.dataflow.service.CalculoSeroService;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
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

@Path("/calculo-sero")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CalculoSeroResource {

    @Inject
    CalculoSeroService service;

    @GET
    public PageResponse<CalculoSeroResponse> listar(
            @QueryParam("nomeObra") String nomeObra,
            @QueryParam("nomeCliente") String nomeCliente,
            @QueryParam("cpf") String cpf,
            @QueryParam("telefone") String telefone,
            @QueryParam("page") Integer page,
            @QueryParam("perPage") Integer perPage) {
        return service.listar(nomeObra, nomeCliente, cpf, telefone, page, perPage);
    }

    @POST
    public CalculoSeroResponse simular(@Valid CalculoSeroRequest req) {
        return service.simular(req);
    }

    @GET
    @Path("/{id}")
    public CalculoSeroResponse getById(@PathParam("id") Long id) {
        return service.buscarPorId(id);
    }

    @PUT
    @Path("/{id}")
    public CalculoSeroResponse atualizar(@PathParam("id") Long id, @Valid CalculoSeroRequest req) {
        return service.atualizar(id, req);
    }

    @DELETE
    @Path("/{id}")
    public Response deletar(@PathParam("id") Long id) {
        boolean deleted = service.deletar(id);
        if (!deleted) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.noContent().build();
    }
}
