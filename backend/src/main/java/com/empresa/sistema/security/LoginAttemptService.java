package com.empresa.sistema.security;

import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Bloqueio de forca bruta em memoria: apos MAX_ATTEMPTS falhas consecutivas
 * para o mesmo login, novas tentativas ficam bloqueadas por BLOCK_DURATION.
 * Escopo por instancia da aplicacao (suficiente para o tamanho deste sistema).
 */
@Service
public class LoginAttemptService {

    private static final int MAX_ATTEMPTS = 5;
    private static final Duration BLOCK_DURATION = Duration.ofMinutes(15);

    private record Attempts(int count, Instant blockedUntil) {}

    private final ConcurrentHashMap<String, Attempts> cache = new ConcurrentHashMap<>();

    public boolean isBlocked(String login) {
        Attempts attempts = cache.get(normalize(login));
        return attempts != null && attempts.blockedUntil() != null && Instant.now().isBefore(attempts.blockedUntil());
    }

    public void registerFailure(String login) {
        cache.compute(normalize(login), (key, current) -> {
            int count = (current == null ? 0 : current.count()) + 1;
            Instant blockedUntil = count >= MAX_ATTEMPTS ? Instant.now().plus(BLOCK_DURATION) : null;
            return new Attempts(count, blockedUntil);
        });
    }

    public void registerSuccess(String login) {
        cache.remove(normalize(login));
    }

    private String normalize(String login) {
        return login == null ? "" : login.trim().toLowerCase();
    }
}
