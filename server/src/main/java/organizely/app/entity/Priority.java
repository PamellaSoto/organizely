package organizely.app.entity;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Priority {
  NONE(0),
  LOW(1),
  MEDIUM(2),
  HIGH(3);

  private final Integer value;

  Priority(Integer value) {
    this.value = value;
  }

  @JsonValue
  public Integer getValue() {
    return value;
  }
}
