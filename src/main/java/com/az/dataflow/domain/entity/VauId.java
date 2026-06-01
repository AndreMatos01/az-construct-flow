package com.az.dataflow.domain.entity;

import java.io.Serializable;
import java.util.Objects;

import com.az.dataflow.domain.enums.Estado;

/** Chave composta da entidade {@link Vau}: período + estado. */
public class VauId implements Serializable {

    public String periodo;
    public Estado estado;

    public VauId() {
    }

    public VauId(String periodo, Estado estado) {
        this.periodo = periodo;
        this.estado = estado;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof VauId other)) {
            return false;
        }
        return Objects.equals(periodo, other.periodo) && estado == other.estado;
    }

    @Override
    public int hashCode() {
        return Objects.hash(periodo, estado);
    }
}
