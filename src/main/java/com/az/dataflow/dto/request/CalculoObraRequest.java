package com.az.dataflow.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public record CalculoObraRequest(
        @NotBlank String nomeObra,
        @NotNull @Positive Double valorContrato,
        @PositiveOrZero Double valorMateriais,
        /** Percentual sobre o valor considerado (ex.: 40). Opcional — padrão 40. */
        Double percentualBase,
        /** Alíquota sobre a base (ex.: 11). Opcional — padrão 11. */
        Double aliquotaInss,
        /** Ignorado no servidor: o INSS é sempre recalculado com a fórmula oficial. */
        Double inssEstimado) {
}
