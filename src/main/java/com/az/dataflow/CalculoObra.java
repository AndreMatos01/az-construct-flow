package com.az.dataflow;

import java.time.LocalDateTime;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;

@Entity
public class CalculoObra extends PanacheEntity {
    public String nomeObra;
    public Double valorContrato;
    public Double inssEstimado;
    public LocalDateTime dataCriacao = LocalDateTime.now();
    }
