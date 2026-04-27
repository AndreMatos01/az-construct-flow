package com.az.dataflow;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CalculoObraRequest(
        @NotBlank String nomeObra,
        @NotNull @Positive Double valorContrato,
        Double inssEstimado) {
}

