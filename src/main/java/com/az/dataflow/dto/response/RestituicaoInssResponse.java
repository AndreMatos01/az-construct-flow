package com.az.dataflow.dto.response;

import java.math.BigDecimal;

public record RestituicaoInssResponse(
        BigDecimal valorContrato,
        BigDecimal valorMateriais,
        BigDecimal valorConsiderado,
        BigDecimal percentualBase,
        BigDecimal aliquotaInss,
        BigDecimal baseCalculo,
        BigDecimal restituicaoInss) {
}
