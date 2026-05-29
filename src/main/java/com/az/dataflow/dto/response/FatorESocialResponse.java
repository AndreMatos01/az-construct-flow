package com.az.dataflow.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.az.dataflow.domain.enums.FatorESocialStatus;

public record FatorESocialResponse(
        Long id,
        String identificador,
        String nomeVinculo,
        Double areaInformada,
        Double rmtInformada,
        String horaMin,
        LocalDate dataInicio,
        LocalDate dataFim,
        LocalDateTime calculadoEm,
        FatorESocialStatus status) {
}
