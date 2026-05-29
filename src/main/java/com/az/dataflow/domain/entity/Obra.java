package com.az.dataflow.domain.entity;

import java.time.LocalDateTime;

import com.az.dataflow.domain.enums.ObraCategoria;
import com.az.dataflow.domain.enums.ObraDestinacao;
import com.az.dataflow.domain.enums.ObraTipo;
import com.az.dataflow.domain.model.DadosObraInss;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;

@Entity
public class Obra extends PanacheEntity {
    private String identificador;
    private String nomeResponsavel;
    private String cidade;
    private String estado;
    private int mesInicioObra;
    private int anoInicioObra;
    private String responsavel;
    private ObraCategoria categoria;
    private ObraDestinacao destinacao;
    private ObraTipo tipo;
    private Double area;
    private Double percentalEquivalente;
    private String observacao;
    private Double vau;
    private LocalDateTime dataCriacao = LocalDateTime.now();
    private LocalDateTime dataAtualizacao = LocalDateTime.now();

    public String getIdentificador() {
        return identificador;
    }

    public void setIdentificador(String identificador) {
        this.identificador = identificador;
    }

    public String getNomeResponsavel() {
        return nomeResponsavel;
    }

    public void setNomeResponsavel(String nomeResponsavel) {
        this.nomeResponsavel = nomeResponsavel;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public int getMesInicioObra() {
        return mesInicioObra;
    }

    public void setMesInicioObra(int mesInicioObra) {
        this.mesInicioObra = mesInicioObra;
    }

    public int getAnoInicioObra() {
        return anoInicioObra;
    }

    public void setAnoInicioObra(int anoInicioObra) {
        this.anoInicioObra = anoInicioObra;
    }

    public String getResponsavel() {
        return responsavel;
    }

    public void setResponsavel(String responsavel) {
        this.responsavel = responsavel;
    }

    public ObraCategoria getCategoria() {
        return categoria;
    }

    public void setCategoria(ObraCategoria categoria) {
        this.categoria = categoria;
    }

    public ObraDestinacao getDestinacao() {
        return destinacao;
    }

    public void setDestinacao(ObraDestinacao destinacao) {
        this.destinacao = destinacao;
    }

    public ObraTipo getTipo() {
        return tipo;
    }

    public void setTipo(ObraTipo tipo) {
        this.tipo = tipo;
    }

    public Double getArea() {
        return area;
    }

    public void setArea(Double area) {
        this.area = area;
    }

    public Double getPercentalEquivalente() {
        return percentalEquivalente;
    }

    public void setPercentalEquivalente(Double percentalEquivalente) {
        this.percentalEquivalente = percentalEquivalente;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }

    public Double getVau() {
        return vau;
    }

    public void setVau(Double vau) {
        this.vau = vau;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    public LocalDateTime getDataAtualizacao() {
        return dataAtualizacao;
    }

    public void setDataAtualizacao(LocalDateTime dataAtualizacao) {
        this.dataAtualizacao = dataAtualizacao;
    }

    public void aplicarDadosInss(DadosObraInss dados) {
        setCategoria(dados.categoria());
        setDestinacao(dados.destinacao());
        setTipo(dados.tipo());
        setArea(dados.area());
        setVau(dados.vau());
        setPercentalEquivalente(dados.percentualEquivalente());
    }
}
