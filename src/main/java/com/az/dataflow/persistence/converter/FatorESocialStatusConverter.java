package com.az.dataflow.persistence.converter;

import com.az.dataflow.domain.enums.FatorESocialStatus;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class FatorESocialStatusConverter implements AttributeConverter<FatorESocialStatus, String> {

    @Override
    public String convertToDatabaseColumn(FatorESocialStatus attribute) {
        return attribute == null ? null : attribute.name();
    }

    @Override
    public FatorESocialStatus convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }

        String v = dbData.trim();
        if (v.isEmpty()) {
            return null;
        }

        try {
            return FatorESocialStatus.valueOf(v);
        } catch (IllegalArgumentException ignored) {
            // continua
        }

        return switch (v) {
            case "Lead Frio" -> FatorESocialStatus.LEAD_FRIO;
            case "Lead Morno" -> FatorESocialStatus.LEAD_MORNO;
            case "Lead Quente" -> FatorESocialStatus.LEAD_QUENTE;
            default -> throw new IllegalArgumentException(
                    "Valor inválido para FatorESocialStatus no banco: '" + dbData + "'");
        };
    }
}
