package com.az.dataflow;

import java.time.LocalDate;
import java.time.LocalDateTime;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Convert;

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

    // V3: coluna tipada (mantém a String por compatibilidade com dados antigos)
    public LocalDate dataInicioDate;

    @Column(nullable = false)
    public String dataFim;

    // V3: coluna tipada (mantém a String por compatibilidade com dados antigos)
    public LocalDate dataFimDate;

    @Column(nullable = false)
    public LocalDateTime calculadoEm = LocalDateTime.now();

    @Column(nullable = false)
    @Convert(converter = FatorESocialStatusConverter.class)
    public FatorESocialStatus status;
}

