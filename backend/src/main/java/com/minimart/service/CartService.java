package com.minimart.service;

import com.minimart.dto.CartRequest;
import com.minimart.entity.Cart;
import com.minimart.exception.ResourceNotFoundException;
import com.minimart.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Handles shopping cart business logic.
 */
@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    public Cart addToCart(CartRequest request) {
        // If the product is already in the user's cart, just increase the quantity
        Optional<Cart> existing = cartRepository.findByUserIdAndProductId(request.getUserId(), request.getProductId());

        if (existing.isPresent()) {
            Cart cart = existing.get();
            cart.setQuantity(cart.getQuantity() + request.getQuantity());
            return cartRepository.save(cart);
        }

        Cart cart = new Cart();
        cart.setUserId(request.getUserId());
        cart.setProductId(request.getProductId());
        cart.setQuantity(request.getQuantity());
        return cartRepository.save(cart);
    }

    public List<Cart> getCartByUser(Long userId) {
        return cartRepository.findByUserId(userId);
    }

    public Cart updateQuantity(Long cartId, Integer quantity) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartId));
        cart.setQuantity(quantity);
        return cartRepository.save(cart);
    }

    public void removeFromCart(Long cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartId));
        cartRepository.delete(cart);
    }

    public void clearCartForUser(Long userId) {
        List<Cart> items = cartRepository.findByUserId(userId);
        cartRepository.deleteAll(items);
    }
}
