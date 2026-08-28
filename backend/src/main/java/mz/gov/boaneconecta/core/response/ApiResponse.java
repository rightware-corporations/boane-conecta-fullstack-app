package mz.gov.boaneconecta.core.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import org.slf4j.MDC;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private List<ApiError> errors;
    private String code;
    private String correlationId;

    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .build();
    }

    public static ApiResponse<Void> failure(String message) {
        return ApiResponse.<Void>builder()
                .success(false)
                .message(message)
                .code("REQUEST_FAILED")
                .correlationId(MDC.get("correlationId"))
                .build();
    }

    public static ApiResponse<Void> failure(String message, List<ApiError> errors) {
        return ApiResponse.<Void>builder()
                .success(false)
                .message(message)
                .errors(errors)
                .code("VALIDATION_FAILED")
                .correlationId(MDC.get("correlationId"))
                .build();
    }
}
