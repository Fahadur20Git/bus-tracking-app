
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;
import java.util.*;

/**
 * TN Bus Expert - Java Backend
 * Handles route detection, bus stand boards, and route searching.
 */
@SpringBootApplication
public class Backend {
    public static void main(String[] args) {
        SpringApplication.run(Backend.class, args);
    }
}

@RestController
@RequestMapping("/api/buses")
@CrossOrigin(origins = "*")
class BusController {

    private final String API_KEY = System.getenv("API_KEY");
    private final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + API_KEY;
    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/nearby")
    public ResponseEntity<String> getNearbyBuses(@RequestParam double lat, @RequestParam double lng) {
        String prompt = String.format(
            "Identify the specific road segment or village at %f, %f. " +
            "List at least 8 bus routes (TNSTC, MTC, Private) passing through this point. " +
            "Return JSON with: locationName, isRural, routes (array with busNumber, name, source, destination, frequencyMinutes, timeAtYourLocation).",
            lat, lng
        );
        return callGemini(prompt);
    }

    @GetMapping("/search")
    public ResponseEntity<String> searchRoutes(@RequestParam String source, @RequestParam String destination, @RequestParam(required = false) String userLocation) {
        String prompt = String.format(
            "List ALL bus services (TNSTC, SETC, Private) between %s and %s. " +
            "Provide departure times from %s, arrival times at %s, and frequency. " +
            "Return JSON with: totalBusesPerDay, buses (array with busNumber, name, type, departureTime, arrivalTime, frequencyMinutes, tripsPerDay).",
            source, destination, source, destination
        );
        return callGemini(prompt);
    }

    @GetMapping("/board")
    public ResponseEntity<String> getTimingBoard(@RequestParam String standName) {
        String prompt = String.format(
            "Create a digital timing board for %s Bus Stand, Tamil Nadu. " +
            "List 15 upcoming departures. Return JSON with: standName, departures (array with busNumber, destination, scheduledTime, platform, status, type).",
            standName
        );
        return callGemini(prompt);
    }

    private ResponseEntity<String> callGemini(String prompt) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> part = new HashMap<>();
        part.put("text", prompt);

        Map<String, Object> content = new HashMap<>();
        content.put("parts", Collections.singletonList(part));

        Map<String, Object> config = new HashMap<>();
        config.put("response_mime_type", "application/json");

        Map<String, Object> body = new HashMap<>();
        body.put("contents", Collections.singletonList(content));
        body.put("generationConfig", config);

        try {
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(GEMINI_URL, entity, Map.class);
            
            // Extract text from Gemini response structure
            List candidates = (List) response.getBody().get("candidates");
            Map candidate = (Map) candidates.get(0);
            Map contentResp = (Map) candidate.get("content");
            List parts = (List) contentResp.get("parts");
            Map partResp = (Map) parts.get(0);
            String text = (String) partResp.get("text");

            return ResponseEntity.ok(text);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"error\": \"Backend API Error: " + e.getMessage() + "\"}");
        }
    }
}
