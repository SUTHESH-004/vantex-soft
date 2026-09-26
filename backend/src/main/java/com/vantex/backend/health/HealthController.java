package com.vantex.backend.health;

import java.time.Instant;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
public class HealthController {

	private final JdbcTemplate jdbcTemplate;

	@GetMapping
	public ResponseEntity<Map<String, Object>> health() {
		boolean dbUp = isDbUp();
		Map<String, Object> body = Map.of(
				"status", dbUp ? "UP" : "DOWN",
				"db", dbUp,
				"time", Instant.now());
		return ResponseEntity.status(dbUp ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE).body(body);
	}

	private boolean isDbUp() {
		try {
			Integer one = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
			return one != null && one == 1;
		}
		catch (Exception ex) {
			return false;
		}
	}

}
