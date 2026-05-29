package com.az.dataflow.domain.enums;

public enum ObraDestinacao {
    UNIFAMILIAR("Residência Unifamiliar"),
    MULTIFAMILIAR("Residência Multifamiliar"),
    COMERCIAL_SALAS_LOJAS("Comercial - Salas e Lojas"),
    GALPAO_INDUSTRIAL("Galpão Industrial"),
    CASA_POPULAR("Casa Popular"),
    CONJUNTO_HABITACIONAL_POPULAR("Conjunto Habitacional Popular"),
    EDIFICIO_GARAGEM("Edifício Garagem");

    private final String descricao;

    ObraDestinacao(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
