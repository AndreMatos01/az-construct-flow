package com.az.dataflow.service;

import java.math.BigDecimal;
import java.util.List;

import com.az.dataflow.domain.entity.CalculoObra;
import com.az.dataflow.dto.request.CalculoObraRequest;
import com.az.dataflow.dto.response.CalculoObraResponse;
import com.az.dataflow.dto.response.PageResponse;
import com.az.dataflow.dto.response.RestituicaoInssResponse;
import com.az.dataflow.mapper.CalculoObraMapper;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Page;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;

@ApplicationScoped
public class CalculoObraService {

    @Inject
    InssObraConstrucaoCivil inssObraConstrucaoCivil;

    @Inject
    CalculoObraMapper calculoObraMapper;

    public List<CalculoObra> listar() {
        return CalculoObra.find("order by dataCriacao desc").list();
    }

    public List<CalculoObraResponse> listarAll() {
        PanacheQuery<CalculoObra> query = CalculoObra.find("order by dataCriacao desc");
        return query.list().stream()
                .map(calculoObraMapper::toResponse)
                .toList();
    }

    public PageResponse<CalculoObraResponse> listarPaginado(Integer page, Integer perPage) {
        int p = normalizePage(page);
        int pp = normalizePerPage(perPage);

        PanacheQuery<CalculoObra> query = CalculoObra.find("order by dataCriacao desc");
        long total = query.count();
        List<CalculoObraResponse> items = query.page(Page.of(p - 1, pp)).list().stream()
                .map(calculoObraMapper::toResponse)
                .toList();
        return new PageResponse<>(items, total, p, pp);
    }

    @Transactional
    public CalculoObraResponse criar(CalculoObraRequest request) {
        if (request == null) {
            throw new BadRequestException("Body JSON é obrigatório.");
        }

        BigDecimal valorContrato = BigDecimal.valueOf(request.valorContrato());
        BigDecimal valorMateriais = request.valorMateriais() != null
                ? BigDecimal.valueOf(request.valorMateriais())
                : BigDecimal.ZERO;
        BigDecimal percentualBase = request.percentualBase() != null
                ? BigDecimal.valueOf(request.percentualBase())
                : null;
        BigDecimal aliquotaInss = request.aliquotaInss() != null
                ? BigDecimal.valueOf(request.aliquotaInss())
                : null;

        final InssObraConstrucaoCivil.Result result;
        try {
            result = inssObraConstrucaoCivil.calcular(valorContrato, valorMateriais, percentualBase, aliquotaInss);
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException(ex.getMessage());
        }

        CalculoObra calculo = calculoObraMapper.toEntity(request.nomeObra(), result);
        calculo.persist();
        return calculoObraMapper.toResponse(calculo);
    }

    public RestituicaoInssResponse calcularRestituicaoInss(
            BigDecimal valorContrato,
            BigDecimal valorMateriais,
            BigDecimal percentualBase,
            BigDecimal aliquotaInss) {
        if (valorContrato == null) {
            throw new BadRequestException("Informe o parâmetro 'valorContrato'.");
        }
        if (valorContrato.signum() < 0) {
            throw new BadRequestException("'valorContrato' não pode ser negativo.");
        }

        final InssObraConstrucaoCivil.Result result;
        try {
            result = inssObraConstrucaoCivil.calcular(valorContrato, valorMateriais, percentualBase, aliquotaInss);
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException(ex.getMessage());
        }

        return new RestituicaoInssResponse(
                result.valorContrato(),
                result.valorMateriais(),
                result.valorConsiderado(),
                result.percentualBase(),
                result.aliquotaInss(),
                result.baseInss(),
                result.inss());
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
}
