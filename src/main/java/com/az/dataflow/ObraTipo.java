package com.az.dataflow;

public enum ObraTipo {
    ALVENARIA("Alvenaria"),
    MADEIRA("Madeira"),
    MISTA("Mista"),
    ALVENARIA_PROJETO_SOCIAL("Alvenaria Interesse Social"),
    MISTA_MADEIRA_PROJETO_SOCIAL("Mista/Madeira Interesse Social");

    private final String descricao;

    ObraTipo(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
