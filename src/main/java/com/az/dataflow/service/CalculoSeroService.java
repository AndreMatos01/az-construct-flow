package com.az.dataflow.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.az.dataflow.domain.entity.CalculoSero;
import com.az.dataflow.dto.request.CalculoSeroRequest;
import com.az.dataflow.dto.response.CalculoSeroResponse;
import com.az.dataflow.dto.response.PageResponse;
import com.az.dataflow.mapper.CalculoSeroMapper;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Page;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;

@ApplicationScoped
public class CalculoSeroService {

    @Inject
    CalculoSeroMapper mapper;

    public PageResponse<CalculoSeroResponse> listar(
            String nomeObra, String nomeCliente, String cpf, String telefone,
            Integer page, Integer perPage) {
        int p = normalizePage(page);
        int pp = normalizePerPage(perPage);

        List<String> clauses = new ArrayList<>();
        Map<String, Object> params = new HashMap<>();
        addLike(clauses, params, "nomeObra", nomeObra);
        addLike(clauses, params, "nomeCliente", nomeCliente);
        addLike(clauses, params, "cpf", cpf);
        addLike(clauses, params, "telefone", telefone);

        String where = clauses.isEmpty() ? "" : String.join(" and ", clauses) + " ";
        String query = where + "order by calculadoEm desc";

        PanacheQuery<CalculoSero> panache = params.isEmpty()
                ? CalculoSero.find(query)
                : CalculoSero.find(query, params);

        long total = panache.count();
        List<CalculoSeroResponse> items = panache.page(Page.of(p - 1, pp)).list().stream()
                .map(mapper::toResponse)
                .toList();
        return new PageResponse<>(items, total, p, pp);
    }

    @Transactional
    public CalculoSeroResponse simular(CalculoSeroRequest req) {
        validar(req);
        CalculoSero e = mapper.toEntity(req);
        aplicarCalculo(e);
        e.persist();
        return mapper.toResponse(e);
    }

    @Transactional
    public CalculoSeroResponse atualizar(Long id, CalculoSeroRequest req) {
        validar(req);
        CalculoSero existing = findByIdOrThrow(id);
        mapper.applyRequest(existing, req);
        aplicarCalculo(existing);
        return mapper.toResponse(existing);
    }

    public CalculoSeroResponse buscarPorId(Long id) {
        return mapper.toResponse(findByIdOrThrow(id));
    }

    @Transactional
    public boolean deletar(Long id) {
        if (id == null) {
            throw new BadRequestException("'id' inválido.");
        }
        return CalculoSero.deleteById(id);
    }

    /**
     * Regra de cálculo do SERO/INSS — PLACEHOLDER.
     * Substitua pela fórmula oficial (tabelas de CUB, fatores por destinação/estado, etc.).
     */
    private static void aplicarCalculo(CalculoSero e) {
        double areaTotal = e.areaPrincipal + e.areaPiscinaDescoberta;

        double fatorTipo = switch (e.tipoObra) {
            case ALVENARIA, ALVENARIA_PROJETO_SOCIAL -> 1.0;
            case MADEIRA, MISTA, MISTA_MADEIRA_PROJETO_SOCIAL -> 0.8;
        };
        double fatorConcreto = e.concretoUsinado ? 0.9 : 1.0;
        double aliquota = 0.20; // 20% — exemplo

        double base = round2(areaTotal * fatorTipo * fatorConcreto);
        e.baseCalculo = base;
        e.valorInss = round2(base * aliquota);
    }

    private static void validar(CalculoSeroRequest req) {
        if (req.dataFim().isBefore(req.dataInicio())) {
            throw new BadRequestException("A data final não pode ser anterior à data de início.");
        }
    }

    private CalculoSero findByIdOrThrow(Long id) {
        if (id == null) {
            throw new BadRequestException("'id' inválido.");
        }
        CalculoSero existing = CalculoSero.findById(id);
        if (existing == null) {
            throw new NotFoundException();
        }
        return existing;
    }

    private static void addLike(List<String> clauses, Map<String, Object> params, String campo, String valor) {
        if (valor != null && !valor.isBlank()) {
            clauses.add("lower(" + campo + ") like :" + campo);
            params.put(campo, "%" + valor.trim().toLowerCase() + "%");
        }
    }

    private static int normalizePage(Integer page) {
        int p = page == null ? 1 : page;
        return p < 1 ? 1 : p;
    }

    private static int normalizePerPage(Integer perPage) {
        int pp = perPage == null ? 10 : perPage;
        if (pp < 1) {
            pp = 10;
        }
        if (pp > 100) {
            pp = 100;
        }
        return pp;
    }

    private static double round2(double v) {
        return Math.round(v * 100.0) / 100.0;
    }
}
