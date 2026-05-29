package com.az.dataflow.dto.request;

import java.time.LocalDate;

import com.az.dataflow.domain.enums.Estado;
import com.az.dataflow.domain.enums.ObraDestinacao;
import com.az.dataflow.domain.enums.ObraTipo;
import com.az.dataflow.domain.enums.TipoPessoa;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public record CalculoSeroRequest(
        @NotBlank String nomeObra,
        @NotBlank String nomeCliente,
        @NotBlank String cpf,
        @NotBlank String telefone,
        @NotNull @Positive Double areaPrincipal,
        @NotNull @PositiveOrZero Double areaPiscinaDescoberta,
        @NotNull ObraDestinacao destinacao,
        @NotNull ObraTipo tipoObra,
        @NotNull Boolean concretoUsinado,
        @NotNull Estado estado,
        @NotNull TipoPessoa tipoPessoa,
        @NotNull LocalDate dataInicio,
        @NotNull LocalDate dataFim) {
}
