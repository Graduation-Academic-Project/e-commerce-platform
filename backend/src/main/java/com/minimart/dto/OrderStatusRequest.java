package com.minimart.dto;

import lombok.Data;

@Data
public class OrderStatusRequest {
    private String status; // PLACED, SHIPPED, DELIVERED
}
