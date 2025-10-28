package organizely.app.user.dto;

import java.util.UUID;

public record ResponseUserDTO(UUID id, String fullName, String username) { }
