package com.inf5190.chat.auth;

import java.util.concurrent.ExecutionException;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.inf5190.chat.auth.model.LoginRequest;
import com.inf5190.chat.auth.model.LoginResponse;
import com.inf5190.chat.auth.repository.FirestoreUserAccount;
import com.inf5190.chat.auth.repository.UserAccountRepository;
import com.inf5190.chat.auth.session.SessionData;
import com.inf5190.chat.auth.session.SessionManager;

import jakarta.servlet.http.Cookie;

/**
 * Contrôleur qui gère l'API de login et logout.
 */
@RestController()
public class AuthController {

    public static final String AUTH_LOGIN_PATH = "/auth/login";
    public static final String AUTH_LOGOUT_PATH = "/auth/logout";
    public static final String SESSION_ID_COOKIE_NAME = "sid";

    private final SessionManager sessionManager;
    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(SessionManager sessionManager, UserAccountRepository userAccountRepository, PasswordEncoder passwordEncoder) {
        this.sessionManager = sessionManager;
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping(AUTH_LOGIN_PATH)
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) throws InterruptedException, ExecutionException {
        String username = loginRequest.username();
        String rawPassword = loginRequest.password();
        FirestoreUserAccount userAccount = userAccountRepository.getUserAccount(username);

        if (userAccount == null) {
            String encodedPassword = passwordEncoder.encode(rawPassword);
            userAccount = new FirestoreUserAccount(username, encodedPassword);
            userAccountRepository.createUserAccount(userAccount);
        } else {
            if (!passwordEncoder.matches(rawPassword, userAccount.getEncodedPassword())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN);
            }
        }

        SessionData SD = new SessionData(loginRequest.username());
        String sessionId = sessionManager.addSession(SD);
        ResponseCookie cookie = ResponseCookie.from("sid", sessionId)
                .httpOnly(true)
                .path("/")
                .maxAge(24 * 60 * 60) // 24 heures en secondes
                .build();

        LoginResponse loginResponse = new LoginResponse(loginRequest.username());
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(loginResponse);
    }

    @PostMapping(AUTH_LOGOUT_PATH)
    public ResponseEntity<String> logout(@CookieValue(SESSION_ID_COOKIE_NAME) Cookie sessionCookie) {
        if (sessionCookie != null) {
            sessionManager.removeSession(SESSION_ID_COOKIE_NAME);
        }
        ResponseCookie deleteCookie = ResponseCookie.from("sid", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0) // Supresseion du cookie
                .httpOnly(true)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
                .build();
    }
}
