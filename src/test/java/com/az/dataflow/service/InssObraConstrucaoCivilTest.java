package com.az.dataflow.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.math.BigDecimal;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class InssObraConstrucaoCivilTest {

    private InssObraConstrucaoCivil calculator;

    @BeforeEach
    void setUp() {
        calculator = new InssObraConstrucaoCivil();
    }

    @Test
    void calcularComParametrosPadrao() {
        InssObraConstrucaoCivil.Result result = calculator.calcular(
                new BigDecimal("100000"),
                BigDecimal.ZERO,
                null,
                null);

        assertEquals(new BigDecimal("100000.00"), result.valorContrato());
        assertEquals(new BigDecimal("0.00"), result.valorMateriais());
        assertEquals(new BigDecimal("100000.00"), result.valorConsiderado());
        assertEquals(new BigDecimal("40.00"), result.percentualBase());
        assertEquals(new BigDecimal("11.00"), result.aliquotaInss());
        assertEquals(new BigDecimal("40000.00"), result.baseInss());
        assertEquals(new BigDecimal("4400.00"), result.inss());
    }

    @Test
    void calcularComMateriaisSegregados() {
        InssObraConstrucaoCivil.Result result = calculator.calcular(
                new BigDecimal("100000"),
                new BigDecimal("20000"),
                new BigDecimal("40"),
                new BigDecimal("11"));

        assertEquals(new BigDecimal("80000.00"), result.valorConsiderado());
        assertEquals(new BigDecimal("32000.00"), result.baseInss());
        assertEquals(new BigDecimal("3520.00"), result.inss());
    }

    @Test
    void rejeitaValorContratoNegativo() {
        assertThrows(IllegalArgumentException.class, () -> calculator.calcular(
                new BigDecimal("-1"),
                BigDecimal.ZERO,
                null,
                null));
    }

    @Test
    void rejeitaMateriaisMaioresQueContrato() {
        assertThrows(IllegalArgumentException.class, () -> calculator.calcular(
                new BigDecimal("1000"),
                new BigDecimal("1001"),
                null,
                null));
    }
}
