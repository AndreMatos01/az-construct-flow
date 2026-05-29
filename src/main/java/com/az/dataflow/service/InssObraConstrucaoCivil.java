package com.az.dataflow.service;

import java.math.BigDecimal;
import java.math.RoundingMode;

import jakarta.enterprise.context.ApplicationScoped;

/**
 * Retenção de INSS na contratação de obra de construção civil (regra geral):
 * base = percentual de incidência (usualmente 40% — Lei 8.212/1991, art. 22, III)
 * sobre o valor do contrato após eventual exclusão de materiais segregados;
 * INSS = alíquota (usualmente 11%) sobre essa base.
 * <p>
 * Valores monetários com 2 casas decimais (meio centavo arredondado HALF_UP).
 */
@ApplicationScoped
public class InssObraConstrucaoCivil {

    public static final BigDecimal PERCENTUAL_BASE_PADRAO = new BigDecimal("40");
    public static final BigDecimal ALIQUOTA_INSS_PADRAO = new BigDecimal("11");

    private static final int SCALE = 2;

    public record Result(
            BigDecimal valorContrato,
            BigDecimal valorMateriais,
            BigDecimal valorConsiderado,
            BigDecimal percentualBase,
            BigDecimal aliquotaInss,
            BigDecimal baseInss,
            BigDecimal inss) {
    }

    public Result calcular(
            BigDecimal valorContrato,
            BigDecimal valorMateriais,
            BigDecimal percentualBase,
            BigDecimal aliquotaInss) {
        if (valorContrato == null || valorContrato.signum() < 0) {
            throw new IllegalArgumentException("valorContrato inválido.");
        }
        BigDecimal mat = valorMateriais != null ? valorMateriais : BigDecimal.ZERO;
        if (mat.signum() < 0) {
            throw new IllegalArgumentException("valorMateriais não pode ser negativo.");
        }
        if (mat.compareTo(valorContrato) > 0) {
            throw new IllegalArgumentException("valorMateriais não pode exceder o valor do contrato.");
        }
        BigDecimal pct = percentualBase != null ? percentualBase : PERCENTUAL_BASE_PADRAO;
        BigDecimal ali = aliquotaInss != null ? aliquotaInss : ALIQUOTA_INSS_PADRAO;
        if (pct.signum() <= 0 || pct.compareTo(new BigDecimal("100")) > 0) {
            throw new IllegalArgumentException("percentualBase deve estar entre 0 e 100.");
        }
        if (ali.signum() <= 0 || ali.compareTo(new BigDecimal("100")) > 0) {
            throw new IllegalArgumentException("aliquotaInss deve estar entre 0 e 100.");
        }

        BigDecimal valorConsiderado = valorContrato.subtract(mat).max(BigDecimal.ZERO);
        BigDecimal baseInss = valorConsiderado
                .multiply(pct.movePointLeft(2))
                .setScale(SCALE, RoundingMode.HALF_UP);
        BigDecimal inss = baseInss
                .multiply(ali.movePointLeft(2))
                .setScale(SCALE, RoundingMode.HALF_UP);

        return new Result(
                valorContrato.setScale(SCALE, RoundingMode.HALF_UP),
                mat.setScale(SCALE, RoundingMode.HALF_UP),
                valorConsiderado.setScale(SCALE, RoundingMode.HALF_UP),
                pct.setScale(2, RoundingMode.HALF_UP),
                ali.setScale(2, RoundingMode.HALF_UP),
                baseInss,
                inss);
    }
}
