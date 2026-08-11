package mz.gov.boaneconecta.core.util;

import java.text.Normalizer;
import java.util.Locale;

public final class SlugUtils {
    private SlugUtils() {
    }

    public static String normalize(String value, int maxLength) {
        String slug = Normalizer.normalize(value.trim(), Normalizer.Form.NFD)
                .replaceAll("\\p{M}+", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-+|-+$)", "");

        if (slug.isBlank()) {
            throw new IllegalArgumentException("Slug must contain at least one letter or number");
        }
        if (slug.length() > maxLength) {
            slug = slug.substring(0, maxLength).replaceAll("-+$", "");
        }
        return slug;
    }
}
