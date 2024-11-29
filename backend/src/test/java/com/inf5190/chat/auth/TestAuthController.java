package com.inf5190.chat.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import com.inf5190.chat.auth.model.LoginRequest;
import com.inf5190.chat.auth.model.LoginResponse;
import com.inf5190.chat.auth.repository.FirestoreUserAccount;
import com.inf5190.chat.auth.repository.UserAccountRepository;
import com.inf5190.chat.auth.session.SessionData;
import com.inf5190.chat.auth.session.SessionManager;

public class TestAuthController {

    private final String username = "testuser";
    private final String password = "testpass";
    private final String encodedPassword = "encodedpass";
    private final LoginRequest loginRequest = new LoginRequest(username, password);
    private final FirestoreUserAccount userAccount = new FirestoreUserAccount(username, encodedPassword);

    @Mock
    private SessionManager mockSessionManager;

    @Mock
    private UserAccountRepository mockAccountRepository;

    @Mock
    private PasswordEncoder mockPasswordEncoder;
    private AuthController authController;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        this.authController = new AuthController(mockSessionManager, mockAccountRepository, mockPasswordEncoder);
    }

    @Test
    public void testPremierLogin() throws Exception {
        when(mockAccountRepository.getUserAccount(username)).thenReturn(null);
        when(mockPasswordEncoder.encode(password)).thenReturn(encodedPassword);
        when(mockSessionManager.addSession(any(SessionData.class))).thenReturn("session-id");

        ResponseEntity<LoginResponse> response = authController.login(loginRequest);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().username()).isEqualTo(username);
        verify(mockAccountRepository).createUserAccount(any(FirestoreUserAccount.class));
    }

    @Test
    public void testLoginCompteExistantEtBonMDP() throws Exception {
        when(mockAccountRepository.getUserAccount(username)).thenReturn(userAccount);
        when(mockPasswordEncoder.matches(password, encodedPassword)).thenReturn(true);
        when(mockSessionManager.addSession(any(SessionData.class))).thenReturn("session-id");

        ResponseEntity<LoginResponse> response = authController.login(loginRequest);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().username()).isEqualTo(username);
    }

    @Test
    public void testLoginCompteExistantMauvaisMDP() throws Exception {
        when(mockAccountRepository.getUserAccount(username)).thenReturn(userAccount);
        when(mockPasswordEncoder.matches(password, encodedPassword)).thenReturn(false);

        assertThatThrownBy(() -> authController.login(loginRequest))
                .isInstanceOf(ResponseStatusException.class)
                .hasFieldOrPropertyWithValue("status", HttpStatus.FORBIDDEN);
    }

    @Test
    public void testLoginFirestoreError() throws Exception {
        when(mockAccountRepository.getUserAccount(username))
                .thenThrow(new InterruptedException("Firestore error"));

        assertThatThrownBy(() -> authController.login(loginRequest))
                .isInstanceOf(ResponseStatusException.class)
                .hasFieldOrPropertyWithValue("status", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
