package com.example.project1.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Service
public class JwtService {
    @Value("${app.jwt.secret:secretsecretsecretsecretsecret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms:86400000}")
    private Long jwtExpirationMs;

    private Key getSigningKey() {
        // Try to treat the configured secret as a base64-encoded string first.
        // If decoding fails, fall back to using the UTF-8 bytes of the plain secret.
        try {
            byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
            if (keyBytes.length < 32) {
                // Ensure minimum key length for HS256 (256 bits)
                java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-256");
                keyBytes = md.digest(keyBytes);
            }
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (IllegalArgumentException ex) {
            // Not a valid base64 string, use raw bytes
            byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
            if (keyBytes.length < 32) {
                try {
                    java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-256");
                    keyBytes = md.digest(keyBytes);
                } catch (java.security.NoSuchAlgorithmException nae) {
                    // fallback: pad to 32 bytes
                    byte[] padded = new byte[32];
                    System.arraycopy(keyBytes, 0, padded, 0, Math.min(keyBytes.length, 32));
                    keyBytes = padded;
                }
            }
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (java.security.NoSuchAlgorithmException e) {
            // SHA-256 not available (very unlikely), fall back to raw bytes
            byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
            if (keyBytes.length < 32) {
                byte[] padded = new byte[32];
                System.arraycopy(keyBytes, 0, padded, 0, Math.min(keyBytes.length, 32));
                keyBytes = padded;
            }
            return Keys.hmacShaKeyFor(keyBytes);
        }
    }

    public String generateToken(String username) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + jwtExpirationMs);
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}
