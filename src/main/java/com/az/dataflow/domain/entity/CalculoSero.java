package com.az.dataflow.domain.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.az.dataflow.domain.enums.Estado;
import com.az.dataflow.domain.enums.ObraDestinacao;
import com.az.dataflow.domain.enums.ObraTipo;
import com.az.dataflow.domain.enums.TipoPessoa;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;

@Entity
@Table(name = "calculoSero")
public class CalculoSero extends PanacheEntity {

    // --- identificação / filtros ---
    @Column(nullable = false)
    public String nomeObra;

    @Column(nullable = false)
    public String nomeCliente;

    @Column(nullable = false)
    public String cpf;

    @Column(nullable = false)
    public String telefone;

    // --- dados da obra ---
    @Column(nullable = false)
    public Double areaPrincipal;

    @Column(nullable = false)
    public Double areaPiscinaDescoberta;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public ObraDestinacao destinacao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public ObraTipo tipoObra;

    @Column(nullable = false)
    public boolean concretoUsinado;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public Estado estado;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public TipoPessoa tipoPessoa;

    @Column(nullable = false)
    public LocalDate dataInicio;

    @Column(nullable = false)
    public LocalDate dataFim;

    // --- resultado calculado ---
    @Column(nullable = false)
    public Double baseCalculo;

    @Column(nullable = false)
    public Double valorInss;

    @Column(nullable = false)
    public LocalDateTime calculadoEm = LocalDateTime.now();
}
