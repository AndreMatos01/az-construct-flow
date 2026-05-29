package com.az.dataflow.mapper;

import java.math.BigDecimal;

import com.az.dataflow.domain.entity.CalculoObra;
import com.az.dataflow.dto.response.CalculoObraResponse;
import com.az.dataflow.service.InssObraConstrucaoCivil;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class CalculoObraMapper {

    @Inject
    InssObraConstrucaoCivil inssObraConstrucaoCivil;

    public CalculoObraResponse toResponse(CalculoObra entity) {
        BigDecimal vc = entity.getValorContrato() != null ? BigDecimal.valueOf(entity.getValorContrato())
                : BigDecimal.ZERO;
        BigDecimal mat = entity.getValorMateriais() != null ? BigDecimal.valueOf(entity.getValorMateriais())
                : BigDecimal.ZERO;
        BigDecimal pct = entity.getPercentualBase() != null ? BigDecimal.valueOf(entity.getPercentualBase())
                : InssObraConstrucaoCivil.PERCENTUAL_BASE_PADRAO;
        BigDecimal ali = entity.getAliquotaInss() != null ? BigDecimal.valueOf(entity.getAliquotaInss())
                : InssObraConstrucaoCivil.ALIQUOTA_INSS_PADRAO;

        InssObraConstrucaoCivil.Result result = inssObraConstrucaoCivil.calcular(vc, mat, pct, ali);

        return new CalculoObraResponse(
                entity.id,
                entity.getNomeObra(),
                result.valorContrato().doubleValue(),
                result.valorMateriais().doubleValue(),
                result.percentualBase().doubleValue(),
                result.aliquotaInss().doubleValue(),
                result.baseInss().doubleValue(),
                result.inss().doubleValue(),
                entity.getDataCriacao());
    }

    public CalculoObra toEntity(String nomeObra, InssObraConstrucaoCivil.Result resultado) {
        CalculoObra calculo = new CalculoObra();
        calculo.setNomeObra(nomeObra);
        calculo.setValorContrato(resultado.valorContrato().doubleValue());
        calculo.setValorMateriais(resultado.valorMateriais().doubleValue());
        calculo.setPercentualBase(resultado.percentualBase().doubleValue());
        calculo.setAliquotaInss(resultado.aliquotaInss().doubleValue());
        calculo.setBaseInss(resultado.baseInss().doubleValue());
        calculo.setInssEstimado(resultado.inss().doubleValue());
        return calculo;
    }
}
