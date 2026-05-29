package com.az.dataflow.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import com.az.dataflow.domain.entity.FatorESocialSimulacao;
import com.az.dataflow.dto.request.FatorESocialRequest;
import com.az.dataflow.dto.response.FatorESocialRelatorioResponse;
import com.az.dataflow.dto.response.FatorESocialResponse;
import com.az.dataflow.dto.response.PageResponse;
import com.az.dataflow.mapper.FatorESocialMapper;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Page;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;

@ApplicationScoped
public class FatorESocialService {

    @Inject
    FatorESocialMapper fatorESocialMapper;

    public PageResponse<FatorESocialResponse> listar(String q, Integer page, Integer perPage) {
        int p = normalizePage(page);
        int pp = normalizePerPage(perPage);

        String query = "order by calculadoEm desc";
        Map<String, Object> params = new HashMap<>();
        if (q != null && !q.isBlank()) {
            query = "(lower(identificador) like :q or lower(nomeVinculo) like :q or lower(status) like :q) order by calculadoEm desc";
            params.put("q", "%" + q.trim().toLowerCase() + "%");
        }

        PanacheQuery<FatorESocialSimulacao> panache = params.isEmpty()
                ? FatorESocialSimulacao.find(query)
                : FatorESocialSimulacao.find(query, params);

        long total = panache.count();
        List<FatorESocialResponse> items = panache.page(Page.of(p - 1, pp)).list().stream()
                .map(fatorESocialMapper::toResponse)
                .toList();
        return new PageResponse<>(items, total, p, pp);
    }

    @Transactional
    public FatorESocialResponse criar(FatorESocialRequest request) {
        FatorESocialSimulacao entity = fatorESocialMapper.toEntity(request);
        entity.persist();
        return fatorESocialMapper.toResponse(entity);
    }

    @Transactional
    public FatorESocialResponse atualizar(Long id, FatorESocialRequest request) {
        FatorESocialSimulacao existing = findByIdOrThrow(id);
        fatorESocialMapper.applyRequest(existing, request);
        return fatorESocialMapper.toResponse(existing);
    }

    public FatorESocialResponse buscarPorId(Long id) {
        return fatorESocialMapper.toResponse(findByIdOrThrow(id));
    }

    @SuppressWarnings("null")
    public FatorESocialRelatorioResponse gerarRelatorio(Long id) {
        FatorESocialResponse simulacao = buscarPorId(id);

        BigDecimal rmt100 = BigDecimal.valueOf(simulacao.rmtInformada() == null ? 0d : simulacao.rmtInformada());
        BigDecimal rmt50 = rmt100.multiply(new BigDecimal("0.50"));

        BigDecimal remAtualizada = rmt50;
        BigDecimal remOriginal = rmt100.multiply(new BigDecimal("0.473"));
        BigDecimal cpp20 = remAtualizada.multiply(new BigDecimal("0.20"));
        BigDecimal multa20 = cpp20.multiply(new BigDecimal("0.20"));
        BigDecimal selicPct = new BigDecimal("5.59");
        BigDecimal jurosMora = remAtualizada.multiply(new BigDecimal("0.01059"));
        BigDecimal multaMaed = new BigDecimal("100.00");
        BigDecimal total = cpp20.add(multa20).add(jurosMora).add(multaMaed);

        BigDecimal custoServico = remAtualizada.multiply(new BigDecimal("0.0992"));
        BigDecimal inssDevido = remAtualizada.multiply(new BigDecimal("0.736"));
        BigDecimal economiaGerada = inssDevido.subtract(total);
        BigDecimal economiaReal = economiaGerada.subtract(custoServico);

        BigDecimal economiaGeradaPct = safePct(economiaGerada, inssDevido);
        BigDecimal economiaRealPct = safePct(economiaReal, inssDevido);

        String titulo = "Simulação PF - ESocial - " + simulacao.identificador();
        var obra = new FatorESocialRelatorioResponse.DadosObra(
                simulacao.id(),
                simulacao.identificador(),
                simulacao.nomeVinculo(),
                BigDecimal.valueOf(simulacao.areaInformada() == null ? 0d : simulacao.areaInformada()),
                simulacao.dataInicio(),
                simulacao.dataFim(),
                rmt100,
                rmt50,
                1,
                simulacao.status());

        String mesAno = formatMesAno(simulacao.dataInicio());
        var linha = new FatorESocialRelatorioResponse.Linha(
                mesAno,
                scale2(remAtualizada),
                scale2(remOriginal),
                scale2(cpp20),
                scale2(multa20),
                selicPct,
                scale2(jurosMora),
                scale2(multaMaed),
                scale2(total));

        var situacao = new FatorESocialRelatorioResponse.SituacaoObra(
                scale2(total),
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                scale2(total));

        var resumo = new FatorESocialRelatorioResponse.Resumo(
                scale2(inssDevido),
                scale2(total),
                scale2(economiaGerada),
                scale2(custoServico),
                scale2(economiaReal),
                economiaGeradaPct,
                economiaRealPct);

        String observacao = "Para reduzir o valor do INSS, é necessário comprovar um valor mínimo de "
                + scale2(remAtualizada)
                + " pago a mão de obra autônoma ou MEI. Esses serviços podem incluir atividades como pedreiro, pintor, eletricista, carpinteiro ou encanador.";

        var rodape = new FatorESocialRelatorioResponse.Rodape(
                "LF SOLUÇÕES FINANCEIRAS",
                "Urubici - SC",
                "(47) 9 8856-4033",
                "https://www.instagram.com/luciaferrariconsultoria/");

        return new FatorESocialRelatorioResponse(
                titulo,
                LocalDateTime.now(),
                obra,
                List.of(linha),
                situacao,
                resumo,
                observacao,
                rodape);
    }

    @Transactional
    public boolean deletar(Long id) {
        if (id == null) {
            throw new BadRequestException("'id' inválido.");
        }
        return FatorESocialSimulacao.deleteById(id);
    }

    private FatorESocialSimulacao findByIdOrThrow(Long id) {
        if (id == null) {
            throw new BadRequestException("'id' inválido.");
        }
        FatorESocialSimulacao existing = FatorESocialSimulacao.findById(id);
        if (existing == null) {
            throw new NotFoundException();
        }
        migrarDatasLegadas(existing);
        return existing;
    }

    private static void migrarDatasLegadas(FatorESocialSimulacao entity) {
        if (entity.dataInicioDate == null && entity.dataInicio != null) {
            try {
                entity.dataInicioDate = LocalDate.parse(entity.dataInicio);
            } catch (Exception ignored) {
            }
        }
        if (entity.dataFimDate == null && entity.dataFim != null) {
            try {
                entity.dataFimDate = LocalDate.parse(entity.dataFim);
            } catch (Exception ignored) {
            }
        }
    }

    private static int normalizePage(Integer page) {
        int p = page == null ? 1 : page;
        return p < 1 ? 1 : p;
    }

    private static int normalizePerPage(Integer perPage) {
        int pp = perPage == null ? 10 : perPage;
        if (pp < 1) {
            pp = 10;
        }
        if (pp > 100) {
            pp = 100;
        }
        return pp;
    }

    private static BigDecimal scale2(BigDecimal value) {
        return value.setScale(2, RoundingMode.HALF_UP);
    }

    private static BigDecimal safePct(BigDecimal numerador, BigDecimal denominador) {
        if (denominador == null || denominador.signum() == 0) {
            return BigDecimal.ZERO;
        }
        return numerador.multiply(new BigDecimal("100")).divide(denominador, 2, RoundingMode.HALF_UP);
    }

    private static String formatMesAno(LocalDate date) {
        if (date == null) {
            return "-";
        }
        Locale pt = Locale.of("pt", "BR");
        String mes = date.getMonth().getDisplayName(java.time.format.TextStyle.FULL, pt);
        String mesCap = mes.substring(0, 1).toUpperCase(pt) + mes.substring(1);
        return mesCap + " de " + date.format(DateTimeFormatter.ofPattern("yyyy"));
    }
}
