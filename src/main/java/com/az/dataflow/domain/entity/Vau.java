package com.az.dataflow.domain.entity;

import java.time.LocalDateTime;

import com.az.dataflow.domain.enums.Estado;
import com.az.dataflow.domain.enums.ObraDestinacao;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

/** Tabela VAU (valor por m² por estado/destinação), versionada por período. */
@Entity
@Table(name = "vau")
@IdClass(VauId.class)
public class Vau extends PanacheEntityBase {

    /** Período de referência. Use formato ordenável (ex.: "yyyy-MM"). */
    @Id
    @Column(nullable = false)
    public String periodo;

    @Id
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public Estado estado;

    @Column(name = "casa_popular")
    public Double casaPopular;

    @Column(name = "comercial_salas_lojas")
    public Double comercialSalasLojas;

    @Column(name = "conjunto_habitacional_popular")
    public Double conjuntoHabitacionalPopular;

    @Column(name = "galpao_industrial")
    public Double galpaoIndustrial;

    @Column(name = "residencial_multifamiliar")
    public Double residencialMultifamiliar;

    @Column(name = "residencial_unifamiliar")
    public Double residencialUnifamiliar;

    @Column(name = "edificio_garagem")
    public Double edificioGaragem;

    @Column(name = "data_inclusao")
    public LocalDateTime dataInclusao;

    @Column(name = "data_alteracao")
    public LocalDateTime dataAlteracao;

    @PrePersist
    void aoInserir() {
        LocalDateTime agora = LocalDateTime.now();
        if (dataInclusao == null) {
            dataInclusao = agora;
        }
        dataAlteracao = agora;
    }

    @PreUpdate
    void aoAtualizar() {
        dataAlteracao = LocalDateTime.now();
    }

    /** Retorna o valor VAU correspondente à destinação da obra. */
    public Double valorPara(ObraDestinacao destinacao) {
        return switch (destinacao) {
            case CASA_POPULAR -> casaPopular;
            case COMERCIAL_SALAS_LOJAS -> comercialSalasLojas;
            case CONJUNTO_HABITACIONAL_POPULAR -> conjuntoHabitacionalPopular;
            case GALPAO_INDUSTRIAL -> galpaoIndustrial;
            case MULTIFAMILIAR -> residencialMultifamiliar;
            case UNIFAMILIAR -> residencialUnifamiliar;
            case EDIFICIO_GARAGEM -> edificioGaragem;
        };
    }

    /** VAU do período mais recente para o estado informado (ou null se inexistente). */
    public static Vau buscarMaisRecente(Estado estado) {
        return find("estado = ?1 order by periodo desc", estado).firstResult();
    }
}
