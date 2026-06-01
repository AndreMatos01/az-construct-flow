package com.az.dataflow.mapper;

import com.az.dataflow.domain.entity.CalculoSero;
import com.az.dataflow.dto.request.CalculoSeroRequest;
import com.az.dataflow.dto.response.CalculoSeroResponse;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class CalculoSeroMapper {

    public CalculoSero toEntity(CalculoSeroRequest req) {
        CalculoSero e = new CalculoSero();
        applyRequest(e, req);
        return e;
    }

    public void applyRequest(CalculoSero e, CalculoSeroRequest req) {
        e.nomeObra = req.nomeObra().trim();
        e.nomeCliente = req.nomeCliente().trim();
        e.cpf = req.cpf().trim();
        e.telefone = req.telefone().trim();
        e.areaPrincipal = req.areaPrincipal();
        e.areaComplementarDescoberta = req.areaComplementarDescoberta();
        e.areaComplementarCoberta = req.areaComplementarCoberta();
        e.destinacao = req.destinacao();
        e.tipoObra = req.tipoObra();
        e.concretoUsinado = Boolean.TRUE.equals(req.concretoUsinado());
        e.estado = req.estado();
        e.tipoPessoa = req.tipoPessoa();
        e.dataInicio = req.dataInicio();
        e.dataFim = req.dataFim();
    }

    public CalculoSeroResponse toResponse(CalculoSero e) {
        return new CalculoSeroResponse(
                e.id,
                e.nomeObra,
                e.nomeCliente,
                e.cpf,
                e.telefone,
                e.areaPrincipal,
                e.areaComplementarDescoberta,
                e.areaComplementarCoberta,
                e.destinacao,
                e.tipoObra,
                e.concretoUsinado,
                e.estado,
                e.tipoPessoa,
                e.dataInicio,
                e.dataFim,
                e.baseCalculo,
                e.valorInss,
                e.calculadoEm);
    }
}
