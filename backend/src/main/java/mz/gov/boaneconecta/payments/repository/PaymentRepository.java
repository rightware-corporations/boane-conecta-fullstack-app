package mz.gov.boaneconecta.payments.repository;

import mz.gov.boaneconecta.payments.entity.Payment;
import mz.gov.boaneconecta.payments.entity.PaymentStatus;
import mz.gov.boaneconecta.users.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    List<Payment> findByUserOrderByCreatedAtDesc(User user);
    Optional<Payment> findByIdAndUser(UUID id, User user);
    List<Payment> findAllByOrderByCreatedAtDesc();
    List<Payment> findByStatusOrderByCreatedAtDesc(PaymentStatus status);
    boolean existsByPaymentNumber(String paymentNumber);
}
