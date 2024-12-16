package com.inf5190.chat.auth;

import java.util.concurrent.ExecutionException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthController.class);

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
        try {
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
                    .sameSite("None")
                    .secure(true)
                    .maxAge(24 * 60 * 60) // 24 heures en secondes
                    .build();

            LoginResponse loginResponse = new LoginResponse(loginRequest.username());
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(loginResponse);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (InterruptedException | ExecutionException e) {
            LOGGER.warn("Unexpected error during login.", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected error on login");
        }
    }

    @PostMapping(AUTH_LOGOUT_PATH)
    public ResponseEntity<String> logout(@CookieValue(SESSION_ID_COOKIE_NAME) Cookie sessionCookie) {
        try {
            ResponseCookie deleteCookie = ResponseCookie.from("sid", "")
                    .httpOnly(true)
                    .path("/")
                    .sameSite("None")
                    .secure(true)
                    .maxAge(0) // Supresseion du cookie
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
                    .build();
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            LOGGER.warn("Unexpected error during logout.", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected error on logout");
        }
    }
}
