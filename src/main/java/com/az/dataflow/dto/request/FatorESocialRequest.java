package com.az.dataflow.dto.request;

import java.time.LocalDate;

import com.az.dataflow.domain.enums.FatorESocialStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record FatorESocialRequest(
        @NotBlank String identificador,
        @NotBlank String nomeVinculo,
        @NotNull @PositiveOrZero Double areaInformada,
        @NotNull @PositiveOrZero Double rmtInformada,
        @NotBlank String horaMin,
        @NotNull LocalDate dataInicio,
        @NotNull LocalDate dataFim,
        @NotNull FatorESocialStatus status) {
}
