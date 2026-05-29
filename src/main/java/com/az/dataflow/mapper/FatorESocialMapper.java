package com.az.dataflow.mapper;

import com.az.dataflow.domain.entity.FatorESocialSimulacao;
import com.az.dataflow.dto.request.FatorESocialRequest;
import com.az.dataflow.dto.response.FatorESocialResponse;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class FatorESocialMapper {

    public FatorESocialResponse toResponse(FatorESocialSimulacao entity) {
        return new FatorESocialResponse(
                entity.id,
                entity.identificador,
                entity.nomeVinculo,
                entity.areaInformada,
                entity.rmtInformada,
                entity.horaMin,
                entity.dataInicioDate,
                entity.dataFimDate,
                entity.calculadoEm,
                entity.status);
    }

    public FatorESocialSimulacao toEntity(FatorESocialRequest request) {
        FatorESocialSimulacao entity = new FatorESocialSimulacao();
        applyRequest(entity, request);
        return entity;
    }

    public void applyRequest(FatorESocialSimulacao entity, FatorESocialRequest request) {
        entity.identificador = request.identificador();
        entity.nomeVinculo = request.nomeVinculo();
        entity.areaInformada = request.areaInformada();
        entity.rmtInformada = request.rmtInformada();
        entity.horaMin = request.horaMin();
        entity.dataInicioDate = request.dataInicio();
        entity.dataFimDate = request.dataFim();
        entity.dataInicio = request.dataInicio().toString();
        entity.dataFim = request.dataFim().toString();
        entity.status = request.status();
    }
}
