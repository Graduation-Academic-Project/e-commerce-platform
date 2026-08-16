package com.minimart.dto;

import lombok.Data;

/**
 * Request payload sent from the checkout page to place an order.
 */
@Data
public class CheckoutRequest {
    private Long userId;
    private String customerName;
    private String address;
    private String mobileNumber;
    private String paymentMethod; // COD, DEBIT_CARD, UPI
}
