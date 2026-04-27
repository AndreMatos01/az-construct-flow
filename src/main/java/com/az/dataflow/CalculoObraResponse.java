package com.az.dataflow;

import java.time.LocalDateTime;

public record CalculoObraResponse(Long id, String nomeObra, Double valorContrato, Double inssEstimado, LocalDateTime dataCriacao) {
    public static CalculoObraResponse from(CalculoObra e) {
        return new CalculoObraResponse(e.id, e.nomeObra, e.valorContrato, e.inssEstimado, e.dataCriacao);
    }
}

