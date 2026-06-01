package com.az.dataflow.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.az.dataflow.domain.entity.CalculoSero;
import com.az.dataflow.domain.enums.Estado;
import com.az.dataflow.domain.enums.ObraDestinacao;
import com.az.dataflow.domain.enums.ObraTipo;
import com.az.dataflow.domain.enums.TipoPessoa;
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
    
    private static final double LIMITE_AREA_FAMILIAR_M2 = 1000.0;
    private static final double LIMITE_AREA_COMERCIAL_SALAS_LOJAS_M2 = 3000.0;

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
        double areaEquivalente = percentualEquivalencia(e.destinacao, e.areaPrincipal) * e.areaPrincipal;
        double areaTotal = areaEquivalente;
        double valoCod = calculoCod(e.estado, areaTotal);
        double valorBase = e.tipoPessoa == TipoPessoa.PF ? valoCod * fatorSocial(areaTotal) : valoCod;
        double RMT = valorBase * fatorTipo(e.tipoObra);
        double aliquota = buscaValorAliquota(e.tipoPessoa);
       e.valorInss = round2(RMT * aliquota);
       e.baseCalculo = RMT;
    }

    /** Fator de equivalência por destinação (tabela SERO). */
    private static double percentualEquivalencia(ObraDestinacao destinacao, double areaPrincipal) {
        return switch (destinacao) {
            case UNIFAMILIAR   -> areaPrincipal > LIMITE_AREA_FAMILIAR_M2 ? 0.85 : 0.89;
            case MULTIFAMILIAR -> areaPrincipal > LIMITE_AREA_FAMILIAR_M2 ? 0.86 : 0.90;
            case COMERCIAL_SALAS_LOJAS, EDIFICIO_GARAGEM  -> areaPrincipal > LIMITE_AREA_COMERCIAL_SALAS_LOJAS_M2 ? 0.83 : 0.86;
            case  GALPAO_INDUSTRIAL -> 0.95;
            case CASA_POPULAR, CONJUNTO_HABITACIONAL_POPULAR -> 0.98;
        };
    }

     /** Valor Aliquota (tabela SERO). */
     private static double buscaValorAliquota(TipoPessoa tipoPessoa) {
        return switch (tipoPessoa) {
            case PF -> 0.368;
            case PJ -> 0.368;
            default -> 0.0;
        };
    }

    /** COD (tabela SERO). */
    private static double calculoCod(Estado estado, double areaPrincipal) {
        return buscaVau(estado) * areaPrincipal;
    }

    /** COD (tabela SERO). */
    private static double buscaVau(Estado estado) {
        return 2391.01;
    }
    /** Fator Social (tabela SERO). */
    private static double fatorSocial(double areaPrincipal) {
        if (areaPrincipal > 400) {
            return 0.90;
        }
        if (areaPrincipal > 300) {
            return 0.70;
        }
        if (areaPrincipal > 200) {
            return 0.55;
        }
        if (areaPrincipal > 100) {
            return 0.45;
        }
        return 0.20; // <= 100
    }
    
    /** Fator Tipo (tabela SERO). */
    private static double fatorTipo(ObraTipo tipoObra) {
        return switch (tipoObra) {
            case ALVENARIA -> 0.20;
            case MADEIRA, MISTA -> 0.15;
            case ALVENARIA_PROJETO_SOCIAL -> 0.12;
            case MISTA_MADEIRA_PROJETO_SOCIAL -> 0.07;
        };
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
