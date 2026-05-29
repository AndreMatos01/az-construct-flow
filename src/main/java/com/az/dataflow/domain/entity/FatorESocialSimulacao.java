package com.az.dataflow.domain.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.az.dataflow.domain.enums.FatorESocialStatus;
import com.az.dataflow.persistence.converter.FatorESocialStatusConverter;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;

@Entity
public class FatorESocialSimulacao extends PanacheEntity {

    @Column(nullable = false)
    public String identificador;

    @Column(nullable = false)
    public String nomeVinculo;

    @Column(nullable = false)
    public Double areaInformada;

    @Column(nullable = false)
    public Double rmtInformada;

    @Column(nullable = false)
    public String horaMin;

    @Column(nullable = false)
    public String dataInicio;

    public LocalDate dataInicioDate;

    @Column(nullable = false)
    public String dataFim;

    public LocalDate dataFimDate;

    @Column(nullable = false)
    public LocalDateTime calculadoEm = LocalDateTime.now();

    @Column(nullable = false)
    @Convert(converter = FatorESocialStatusConverter.class)
    public FatorESocialStatus status;
}
