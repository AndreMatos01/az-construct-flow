package com.az.dataflow;

import java.time.LocalDateTime;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;

@Entity
public class CalculoObra extends PanacheEntity {
    private String nomeObra;
    private Double valorContrato;
    /** Materiais fornecidos pela contratada e segregados no contrato (reduz o valor considerado). */
    private Double valorMateriais;
    /** Percentual de incidência sobre o valor considerado (padrão 40). */
    private Double percentualBase;
    /** Alíquota de retenção sobre a base (padrão 11). */
    private Double aliquotaInss;
    /** Base de cálculo do INSS (valor considerado × percentualBase / 100). */
    private Double baseInss;
    private Double inssEstimado;
    private LocalDateTime dataCriacao = LocalDateTime.now();

    public static CalculoObra from(String nomeObra, InssObraConstrucaoCivil.Result resultado) {
        CalculoObra calculo = new CalculoObra();
        calculo.setNomeObra(nomeObra);
        calculo.setValorContrato(resultado.valorContrato().doubleValue());
        calculo.setValorMateriais(resultado.valorMateriais().doubleValue());
        calculo.setPercentualBase(resultado.percentualBase().doubleValue());
        calculo.setAliquotaInss(resultado.aliquotaInss().doubleValue());
        calculo.setBaseInss(resultado.baseInss().doubleValue());
        calculo.setInssEstimado(resultado.inss().doubleValue());
        return calculo;
    }

    public String getNomeObra() {
        return nomeObra;
    }

    public void setNomeObra(String nomeObra) {
        this.nomeObra = nomeObra;
    }

    public Double getValorContrato() {
        return valorContrato;
    }

    public void setValorContrato(Double valorContrato) {
        this.valorContrato = valorContrato;
    }

    public Double getValorMateriais() {
        return valorMateriais;
    }

    public void setValorMateriais(Double valorMateriais) {
        this.valorMateriais = valorMateriais;
    }

    public Double getPercentualBase() {
        return percentualBase;
    }

    public void setPercentualBase(Double percentualBase) {
        this.percentualBase = percentualBase;
    }

    public Double getAliquotaInss() {
        return aliquotaInss;
    }

    public void setAliquotaInss(Double aliquotaInss) {
        this.aliquotaInss = aliquotaInss;
    }

    public Double getBaseInss() {
        return baseInss;
    }

    public void setBaseInss(Double baseInss) {
        this.baseInss = baseInss;
    }

    public Double getInssEstimado() {
        return inssEstimado;
    }

    public void setInssEstimado(Double inssEstimado) {
        this.inssEstimado = inssEstimado;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }
}
