package com.empresa.sistema.service;

import com.empresa.sistema.dto.LancamentoRequest;
import com.empresa.sistema.dto.LancamentoResponse;
import com.empresa.sistema.dto.PageResponse;
import com.empresa.sistema.dto.ResumoFinanceiroResponse;
import com.empresa.sistema.entity.LancamentoFinanceiro;
import com.empresa.sistema.entity.StatusLancamento;
import com.empresa.sistema.exception.ResourceNotFoundException;
import com.empresa.sistema.repository.LancamentoFinanceiroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LancamentoFinanceiroService {

    private final LancamentoFinanceiroRepository lancamentoRepository;

    public PageResponse<LancamentoResponse> search(String termo, String tipo, String status, Pageable pageable) {
        String termoFiltro = (termo == null || termo.isBlank()) ? "" : termo.trim();
        String tipoFiltro = (tipo == null || tipo.isBlank()) ? "" : tipo.trim().toUpperCase();
        String statusFiltro = (status == null || status.isBlank()) ? "" : status.trim().toUpperCase();

        Page<LancamentoFinanceiro> page = lancamentoRepository.search(termoFiltro, tipoFiltro, statusFiltro, pageable);
        Page<LancamentoResponse> responsePage = page.map(LancamentoResponse::fromEntity);
        return PageResponse.fromPage(responsePage);
    }

    public LancamentoResponse findById(Long id) {
        return LancamentoResponse.fromEntity(getLancamentoOrThrow(id));
    }

    public ResumoFinanceiroResponse resumo() {
        var totalReceitas = lancamentoRepository.sumReceitas();
        var totalDespesas = lancamentoRepository.sumDespesas();
        return ResumoFinanceiroResponse.builder()
                .totalReceitas(totalReceitas)
                .totalDespesas(totalDespesas)
                .saldo(totalReceitas.subtract(totalDespesas))
                .build();
    }

    @Transactional
    public LancamentoResponse create(LancamentoRequest request) {
        LancamentoFinanceiro lancamento = LancamentoFinanceiro.builder()
                .descricao(request.getDescricao())
                .tipo(request.getTipo())
                .categoria(request.getCategoria())
                .valor(request.getValor())
                .formaPagamento(request.getFormaPagamento())
                .status(request.getStatus() == null ? StatusLancamento.PENDENTE : request.getStatus())
                .dataVencimento(request.getDataVencimento())
                .dataPagamento(request.getDataPagamento())
                .observacoes(request.getObservacoes())
                .build();

        return LancamentoResponse.fromEntity(lancamentoRepository.save(lancamento));
    }

    @Transactional
    public LancamentoResponse update(Long id, LancamentoRequest request) {
        LancamentoFinanceiro lancamento = getLancamentoOrThrow(id);

        lancamento.setDescricao(request.getDescricao());
        lancamento.setTipo(request.getTipo());
        lancamento.setCategoria(request.getCategoria());
        lancamento.setValor(request.getValor());
        lancamento.setFormaPagamento(request.getFormaPagamento());
        if (request.getStatus() != null) {
            lancamento.setStatus(request.getStatus());
        }
        lancamento.setDataVencimento(request.getDataVencimento());
        lancamento.setDataPagamento(request.getDataPagamento());
        lancamento.setObservacoes(request.getObservacoes());

        return LancamentoResponse.fromEntity(lancamentoRepository.save(lancamento));
    }

    @Transactional
    public void delete(Long id) {
        lancamentoRepository.delete(getLancamentoOrThrow(id));
    }

    private LancamentoFinanceiro getLancamentoOrThrow(Long id) {
        return lancamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lancamento nao encontrado com id " + id));
    }
}
