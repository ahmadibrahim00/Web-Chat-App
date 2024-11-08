package com.inf5190.chat.auth.session;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Repository;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.io.Encoders;
import io.jsonwebtoken.security.Keys;

@Repository
public class SessionManager {

    private static final String SECRET_KEY_BASE64;
    private final SecretKey secretKey;
    private final JwtParser jwtParser;
    private final Map<String, SessionData> sessions = new HashMap<>();

    static {
        SecretKey generatedKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
        SECRET_KEY_BASE64 = Encoders.BASE64.encode(generatedKey.getEncoded());
    }

    public SessionManager() {
        this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(SECRET_KEY_BASE64));
        this.jwtParser = Jwts.parser().verifyWith(this.secretKey).build();
    }

    public String addSession(SessionData authData) {
        Instant now = Instant.now();

        return Jwts.builder()
                .setSubject(authData.username())
                .setAudience("chat-application")
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plus(2, ChronoUnit.HOURS)))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public void removeSession(String sessionId) {
        this.sessions.remove(sessionId);
    }

    public SessionData getSession(String sessionId) {
        try {

            String username = jwtParser.parseClaimsJws(sessionId)
                    .getBody()
                    .getSubject();

            return new SessionData(username);

        } catch (JwtException e) {

            return null;
        }
    }
}
