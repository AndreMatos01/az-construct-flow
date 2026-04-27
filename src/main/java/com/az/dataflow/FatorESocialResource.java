package com.az.dataflow;

import java.time.LocalDate;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Page;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.NotFoundException;
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

    @GET
    public PageResponse<FatorESocialResponse> listar(@QueryParam("q") String q,
            @QueryParam("page") Integer page,
            @QueryParam("perPage") Integer perPage) {

        int p = page == null ? 1 : page;
        int pp = perPage == null ? 10 : perPage;
        if (p < 1)
            p = 1;
        if (pp < 1)
            pp = 10;
        if (pp > 100)
            pp = 100;

        String query = "order by calculadoEm desc";
        Map<String, Object> params = new HashMap<>();
        if (q != null && !q.isBlank()) {
            query = "(lower(identificador) like :q or lower(nomeVinculo) like :q or lower(status) like :q) order by calculadoEm desc";
            params.put("q", "%" + q.trim().toLowerCase() + "%");
        }

        PanacheQuery<FatorESocialSimulacao> panache = params.isEmpty()
                ? FatorESocialSimulacao.find(query)
                : FatorESocialSimulacao.find(query, params);

        long total = panache.count();
        List<FatorESocialResponse> items = panache.page(Page.of(p - 1, pp)).list().stream()
                .map(FatorESocialResponse::from)
                .toList();
        return new PageResponse<>(items, total, p, pp);
    }

    @POST
    @Transactional
    public FatorESocialResponse criar(@Valid FatorESocialRequest req) {
        FatorESocialSimulacao s = new FatorESocialSimulacao();
        s.identificador = req.identificador();
        s.nomeVinculo = req.nomeVinculo();
        s.areaInformada = req.areaInformada();
        s.rmtInformada = req.rmtInformada();
        s.horaMin = req.horaMin();
        s.dataInicioDate = req.dataInicio();
        s.dataFimDate = req.dataFim();
        // mantém também o texto (legado) para dados antigos/prints
        s.dataInicio = req.dataInicio().toString();
        s.dataFim = req.dataFim().toString();
        s.status = req.status();
        s.persist();
        return FatorESocialResponse.from(s);
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public FatorESocialResponse atualizar(@PathParam("id") Long id, @Valid FatorESocialRequest body) {
        if (id == null) {
            throw new BadRequestException("'id' inválido.");
        }
        FatorESocialSimulacao existing = FatorESocialSimulacao.findById(id);
        if (existing == null) {
            throw new NotFoundException();
        }

        existing.identificador = body.identificador();
        existing.nomeVinculo = body.nomeVinculo();
        existing.areaInformada = body.areaInformada();
        existing.rmtInformada = body.rmtInformada();
        existing.horaMin = body.horaMin();
        existing.dataInicioDate = body.dataInicio();
        existing.dataFimDate = body.dataFim();
        existing.dataInicio = body.dataInicio().toString();
        existing.dataFim = body.dataFim().toString();
        existing.status = body.status();

        return FatorESocialResponse.from(existing);
    }

    @GET
    @Path("/{id}")
    public FatorESocialResponse getById(@PathParam("id") Long id) {
        if (id == null) {
            throw new BadRequestException("'id' inválido.");
        }
        FatorESocialSimulacao existing = FatorESocialSimulacao.findById(id);
        if (existing == null) {
            throw new NotFoundException();
        }
        // migração leve: tenta preencher as colunas LocalDate se estiverem null
        if (existing.dataInicioDate == null && existing.dataInicio != null) {
            try {
                existing.dataInicioDate = LocalDate.parse(existing.dataInicio);
            } catch (Exception ignored) {
            }
        }
        if (existing.dataFimDate == null && existing.dataFim != null) {
            try {
                existing.dataFimDate = LocalDate.parse(existing.dataFim);
            } catch (Exception ignored) {
            }
        }
        return FatorESocialResponse.from(existing);
    }

    @GET
    @Path("/{id}/relatorio")
    public FatorESocialRelatorioResponse relatorio(@PathParam("id") Long id) {
        FatorESocialResponse e = getById(id);

        BigDecimal rmt100 = BigDecimal.valueOf(e.rmtInformada() == null ? 0d : e.rmtInformada());
        BigDecimal rmt50 = rmt100.multiply(new BigDecimal("0.50"));

        // Modelo determinístico (placeholder): mantém coerência e tira mocks do frontend.
        BigDecimal remAtualizada = rmt50;
        BigDecimal remOriginal = rmt100.multiply(new BigDecimal("0.473"));
        BigDecimal cpp20 = remAtualizada.multiply(new BigDecimal("0.20"));
        BigDecimal multa20 = cpp20.multiply(new BigDecimal("0.20"));
        BigDecimal selicPct = new BigDecimal("5.59");
        BigDecimal jurosMora = remAtualizada.multiply(new BigDecimal("0.01059"));
        BigDecimal multaMaed = new BigDecimal("100.00");
        BigDecimal total = cpp20.add(multa20).add(jurosMora).add(multaMaed);

        BigDecimal custoServico = remAtualizada.multiply(new BigDecimal("0.0992"));
        BigDecimal inssDevido = remAtualizada.multiply(new BigDecimal("0.736"));
        BigDecimal economiaGerada = inssDevido.subtract(total);
        BigDecimal economiaReal = economiaGerada.subtract(custoServico);

        BigDecimal economiaGeradaPct = safePct(economiaGerada, inssDevido);
        BigDecimal economiaRealPct = safePct(economiaReal, inssDevido);

        String titulo = "Simulação PF - ESocial - " + e.identificador();
        var obra = new FatorESocialRelatorioResponse.DadosObra(
                e.id(),
                e.identificador(),
                e.nomeVinculo(),
                BigDecimal.valueOf(e.areaInformada() == null ? 0d : e.areaInformada()),
                e.dataInicio(),
                e.dataFim(),
                rmt100,
                rmt50,
                1,
                e.status());

        String mesAno = formatMesAno(e.dataInicio());
        var linha = new FatorESocialRelatorioResponse.Linha(
                mesAno,
                scale2(remAtualizada),
                scale2(remOriginal),
                scale2(cpp20),
                scale2(multa20),
                selicPct,
                scale2(jurosMora),
                scale2(multaMaed),
                scale2(total));

        var situacao = new FatorESocialRelatorioResponse.SituacaoObra(
                scale2(total),
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                scale2(total));

        var resumo = new FatorESocialRelatorioResponse.Resumo(
                scale2(inssDevido),
                scale2(total),
                scale2(economiaGerada),
                scale2(custoServico),
                scale2(economiaReal),
                economiaGeradaPct,
                economiaRealPct);

        String obs = "Para reduzir o valor do INSS, é necessário comprovar um valor mínimo de " + scale2(remAtualizada)
                + " pago a mão de obra autônoma ou MEI. Esses serviços podem incluir atividades como pedreiro, pintor, eletricista, carpinteiro ou encanador.";

        var rodape = new FatorESocialRelatorioResponse.Rodape(
                "LF SOLUÇÕES FINANCEIRAS",
                "Urubici - SC",
                "(47) 9 8856-4033",
                "https://www.instagram.com/luciaferrariconsultoria/");

        return new FatorESocialRelatorioResponse(
                titulo,
                java.time.LocalDateTime.now(),
                obra,
                List.of(linha),
                situacao,
                resumo,
                obs,
                rodape);
    }

    private static BigDecimal scale2(BigDecimal v) {
        return v.setScale(2, RoundingMode.HALF_UP);
    }

    private static BigDecimal safePct(BigDecimal numerador, BigDecimal denominador) {
        if (denominador == null || denominador.signum() == 0) {
            return BigDecimal.ZERO;
        }
        return numerador.multiply(new BigDecimal("100")).divide(denominador, 2, RoundingMode.HALF_UP);
    }

    private static String formatMesAno(LocalDate d) {
        if (d == null) {
            return "-";
        }
        // ex.: "Outubro de 2025" (pt-BR)
        java.util.Locale pt = new java.util.Locale("pt", "BR");
        String mes = d.getMonth().getDisplayName(java.time.format.TextStyle.FULL, pt);
        String mesCap = mes.substring(0, 1).toUpperCase(pt) + mes.substring(1);
        return mesCap + " de " + d.format(DateTimeFormatter.ofPattern("yyyy"));
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response deletar(@PathParam("id") Long id) {
        if (id == null) {
            throw new BadRequestException("'id' inválido.");
        }
        boolean deleted = FatorESocialSimulacao.deleteById(id);
        if (!deleted) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.noContent().build();
    }
}

