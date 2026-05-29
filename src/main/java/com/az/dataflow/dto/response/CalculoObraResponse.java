package com.az.dataflow.dto.response;

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
}
