package com.empresa.sistema.controller;

import com.empresa.sistema.dto.LancamentoRequest;
import com.empresa.sistema.dto.LancamentoResponse;
import com.empresa.sistema.dto.PageResponse;
import com.empresa.sistema.dto.ResumoFinanceiroResponse;
import com.empresa.sistema.service.LancamentoFinanceiroService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/financeiro")
@RequiredArgsConstructor
public class LancamentoFinanceiroController {

    private final LancamentoFinanceiroService lancamentoService;

    @GetMapping("/resumo")
    public ResponseEntity<ResumoFinanceiroResponse> resumo() {
        return ResponseEntity.ok(lancamentoService.resumo());
    }

    @GetMapping("/lancamentos")
    public ResponseEntity<PageResponse<LancamentoResponse>> search(
            @RequestParam(required = false) String termo,
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) String status,
            @PageableDefault(size = 10, sort = "dataVencimento") Pageable pageable) {
        return ResponseEntity.ok(lancamentoService.search(termo, tipo, status, pageable));
    }

    @GetMapping("/lancamentos/{id}")
    public ResponseEntity<LancamentoResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(lancamentoService.findById(id));
    }

    @PostMapping("/lancamentos")
    public ResponseEntity<LancamentoResponse> create(@Valid @RequestBody LancamentoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(lancamentoService.create(request));
    }

    @PutMapping("/lancamentos/{id}")
    public ResponseEntity<LancamentoResponse> update(@PathVariable Long id, @Valid @RequestBody LancamentoRequest request) {
        return ResponseEntity.ok(lancamentoService.update(id, request));
    }

    @DeleteMapping("/lancamentos/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        lancamentoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
