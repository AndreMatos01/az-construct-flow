package com.az.dataflow.domain.model;

import com.az.dataflow.domain.entity.Obra;
import com.az.dataflow.domain.enums.ObraCategoria;
import com.az.dataflow.domain.enums.ObraDestinacao;
import com.az.dataflow.domain.enums.ObraTipo;

/**
 * Dados da obra usados nas regras de INSS (domínio), sem acoplamento à entidade JPA.
 */
public record DadosObraInss(
        ObraCategoria categoria,
        ObraDestinacao destinacao,
        ObraTipo tipo,
        double area,
        double vau,
        double percentualEquivalente) {

    public static DadosObraInss from(Obra obra) {
        return new DadosObraInss(
                obra.getCategoria(),
                obra.getDestinacao(),
                obra.getTipo(),
                nullToZero(obra.getArea()),
                nullToZero(obra.getVau()),
                nullToZero(obra.getPercentalEquivalente()));
    }

    /** Aplica regras de percentual equivalente conforme destinação e demais atributos. */
    public DadosObraInss comPercentualEquivalenteCalculado() {
        if (destinacao == ObraDestinacao.UNIFAMILIAR) {
            return new DadosObraInss(categoria, destinacao, tipo, area, vau, area * 1.89);
        }
        return this;
    }

    private static double nullToZero(Double value) {
        return value != null ? value : 0.0;
    }
}
