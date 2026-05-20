package com.az.dataflow;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CalculoObraResponse(
        Long id,
        String nomeObra,
        Double valorContrato,
        Double valorMateriais,
        Double percentualBase,
        Double aliquotaInss,
        Double baseInss,
        Double inssEstimado,
        LocalDateTime dataCriacao) {

    public static CalculoObraResponse from(CalculoObra e) {
        BigDecimal vc = e.getValorContrato() != null ? BigDecimal.valueOf(e.getValorContrato()) : BigDecimal.ZERO;
        BigDecimal mat = e.getValorMateriais() != null ? BigDecimal.valueOf(e.getValorMateriais()) : BigDecimal.ZERO;
        BigDecimal pct = e.getPercentualBase() != null ? BigDecimal.valueOf(e.getPercentualBase())
                : InssObraConstrucaoCivil.PERCENTUAL_BASE_PADRAO;
        BigDecimal ali = e.getAliquotaInss() != null ? BigDecimal.valueOf(e.getAliquotaInss())
                : InssObraConstrucaoCivil.ALIQUOTA_INSS_PADRAO;

        InssObraConstrucaoCivil.Result r = InssObraConstrucaoCivil.calcular(vc, mat, pct, ali);

        return new CalculoObraResponse(
                e.id,
                e.getNomeObra(),
                r.valorContrato().doubleValue(),
                r.valorMateriais().doubleValue(),
                r.percentualBase().doubleValue(),
                r.aliquotaInss().doubleValue(),
                r.baseInss().doubleValue(),
                r.inss().doubleValue(),
                e.getDataCriacao());
    }
}
