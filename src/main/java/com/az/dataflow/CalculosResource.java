package com.az.dataflow;

import java.math.BigDecimal;
import java.util.List;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Page;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
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

    @GET
    public List<CalculoObra> listar() {
        PanacheQuery<CalculoObra> q = CalculoObra.find("order by dataCriacao desc");
        return q.list();
    }

    @GET
    @Path("/all")
    public List<CalculoObraResponse> listarAll() {
        PanacheQuery<CalculoObra> q = CalculoObra.find("order by dataCriacao desc");
        return q.list().stream().map(CalculoObraResponse::from).toList();
    }

    @GET
    @Path("/paged")
    public PageResponse<CalculoObraResponse> listarPaginado(@QueryParam("page") Integer page,
            @QueryParam("perPage") Integer perPage) {
        int p = page == null ? 1 : page;
        int pp = perPage == null ? 10 : perPage;
        if (p < 1)
            p = 1;
        if (pp < 1)
            pp = 10;
        if (pp > 100)
            pp = 100;

        PanacheQuery<CalculoObra> q = CalculoObra.find("order by dataCriacao desc");
        long total = q.count();
        List<CalculoObraResponse> items = q.page(Page.of(p - 1, pp)).list().stream()
                .map(CalculoObraResponse::from)
                .toList();
        return new PageResponse<>(items, total, p, pp);
    }

    @POST
    @Transactional
    public CalculoObraResponse criar(@Valid CalculoObraRequest req) {
        if (req == null) {
            throw new BadRequestException("Body JSON é obrigatório.");
        }
        BigDecimal vc = BigDecimal.valueOf(req.valorContrato());
        BigDecimal mat = req.valorMateriais() != null ? BigDecimal.valueOf(req.valorMateriais()) : BigDecimal.ZERO;
        BigDecimal pct = req.percentualBase() != null ? BigDecimal.valueOf(req.percentualBase()) : null;
        BigDecimal ali = req.aliquotaInss() != null ? BigDecimal.valueOf(req.aliquotaInss()) : null;

        final InssObraConstrucaoCivil.Result r;
        try {
            r = InssObraConstrucaoCivil.calcular(vc, mat, pct, ali);
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException(ex.getMessage());
        }

        CalculoObra calculo = CalculoObra.from(req.nomeObra(), r);
        calculo.persist();
        return CalculoObraResponse.from(calculo);
    }
}
