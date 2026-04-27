package com.az.dataflow;

import java.time.LocalDate;
import java.time.LocalDateTime;

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

    public static FatorESocialResponse from(FatorESocialSimulacao e) {
        return new FatorESocialResponse(
                e.id,
                e.identificador,
                e.nomeVinculo,
                e.areaInformada,
                e.rmtInformada,
                e.horaMin,
                e.dataInicioDate,
                e.dataFimDate,
                e.calculadoEm,
                e.status);
    }
}

