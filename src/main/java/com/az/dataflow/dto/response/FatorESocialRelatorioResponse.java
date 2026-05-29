package com.az.dataflow.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.az.dataflow.domain.enums.FatorESocialStatus;

public record FatorESocialRelatorioResponse(
        String titulo,
        LocalDateTime emitidoEm,
        DadosObra obra,
        List<Linha> linhas,
        SituacaoObra situacao,
        Resumo resumo,
        String observacao,
        Rodape rodape) {

    public record DadosObra(
            Long id,
            String identificador,
            String nome,
            BigDecimal metragemM2,
            LocalDate inicioObra,
            LocalDate fimObra,
            BigDecimal rmt100,
            BigDecimal rmt50,
            int periodoComDctfweb,
            FatorESocialStatus status) {
    }

    public record Linha(
            String mesAno,
            BigDecimal remAtualizada,
            BigDecimal remOriginal,
            BigDecimal cpp20,
            BigDecimal multa20,
            BigDecimal selicAcumuladaPct,
            BigDecimal jurosMora,
            BigDecimal multaMaed,
            BigDecimal total) {
    }

    public record SituacaoObra(
            BigDecimal valoresAtrasados,
            BigDecimal aPagarPorMes,
            BigDecimal aPagarFuturo,
            BigDecimal totalEstimado) {
    }

    public record Resumo(
            BigDecimal inssDevido,
            BigDecimal inssReduzido,
            BigDecimal economiaGerada,
            BigDecimal custoServico,
            BigDecimal economiaReal,
            BigDecimal economiaGeradaPct,
            BigDecimal economiaRealPct) {
    }

    public record Rodape(String empresa, String cidade, String telefone, String link) {
    }
}
