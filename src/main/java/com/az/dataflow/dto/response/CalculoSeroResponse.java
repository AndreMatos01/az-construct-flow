package com.az.dataflow.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.az.dataflow.domain.enums.Estado;
import com.az.dataflow.domain.enums.ObraDestinacao;
import com.az.dataflow.domain.enums.ObraTipo;
import com.az.dataflow.domain.enums.TipoPessoa;

public record CalculoSeroResponse(
        Long id,
        String nomeObra,
        String nomeCliente,
        String cpf,
        String telefone,
        Double areaPrincipal,
        Double areaComplementarDescoberta,
        Double areaComplementarCoberta,
        ObraDestinacao destinacao,
        ObraTipo tipoObra,
        boolean concretoUsinado,
        Estado estado,
        TipoPessoa tipoPessoa,
        LocalDate dataInicio,
        LocalDate dataFim,
        Double baseCalculo,
        Double valorInss,
        LocalDateTime calculadoEm) {
}
