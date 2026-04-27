package com.az.dataflow;

import java.util.List;

public record PageResponse<T>(List<T> items, long total, int page, int perPage) {
}

