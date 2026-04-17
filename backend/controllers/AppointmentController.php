<?php
require_once __DIR__ . '/../config/db.php';

class AppointmentController {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function createAppointment($userId, $doctorId, $studentName, $doctorName, $specialization, $day, $purposeCategory, $purposeDetail, $priorityLevel, $notes, $customReason = '') {
        // 1. Check if slots are available
        $slotQuery = "SELECT max_slots, (SELECT COUNT(*) FROM appointments WHERE doctor_id = ? AND appointment_day = ? AND status != 'Cancelled') as current_count 
                      FROM doctor_schedule WHERE id = ?";
        $slotStmt = $this->conn->prepare($slotQuery);
        $slotStmt->bind_param("isi", $doctorId, $day, $doctorId);
        $slotStmt->execute();
        $slotResult = $slotStmt->get_result()->fetch_assoc();
        
        if ($slotResult['current_count'] >= $slotResult['max_slots']) {
            return ['success' => false, 'message' => 'Slots are full for this day. Please join the waiting list.', 'slots_full' => true];
        }

        // 2. Create appointment with placeholder token (rebalance will fix it)
        $query = "INSERT INTO appointments (user_id, doctor_id, token_number, student_name, doctor_name, specialization, appointment_day, purpose_category, purpose_detail, priority_level, notes, custom_reason, status) 
                  VALUES (?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Confirmed')";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("iissssssiss", $userId, $doctorId, $studentName, $doctorName, $specialization, $day, $purposeCategory, $purposeDetail, $priorityLevel, $notes, $customReason);
        
        if ($stmt->execute()) {
            $appointmentId = $this->conn->insert_id;
            
            // 3. Rebalance tokens for this doctor and day
            $this->rebalanceTokens($doctorId, $day);
            
            // 4. Get the new token number for this appointment
            $tokenQuery = "SELECT token_number FROM appointments WHERE id = ?";
            $tokenStmt = $this->conn->prepare($tokenQuery);
            $tokenStmt->bind_param("i", $appointmentId);
            $tokenStmt->execute();
            $newToken = $tokenStmt->get_result()->fetch_assoc()['token_number'];

            return [
                'success' => true,
                'message' => 'Appointment booked successfully',
                'appointment_id' => $appointmentId,
                'token_number' => $newToken,
                'priority_level' => $priorityLevel
            ];
        }
        return ['success' => false, 'message' => 'Failed to book appointment: ' . $stmt->error];
    }

    private function rebalanceTokens($doctorId, $day) {
        // Get all active appointments sorted by priority and booking time
        $query = "SELECT id FROM appointments 
                  WHERE doctor_id = ? AND appointment_day = ? AND status IN ('Confirmed', 'Pending') 
                  ORDER BY priority_level ASC, created_at ASC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("is", $doctorId, $day);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $position = 1;
        while ($row = $result->fetch_assoc()) {
            $updateQuery = "UPDATE appointments SET token_number = ? WHERE id = ?";
            $updateStmt = $this->conn->prepare($updateQuery);
            $updateStmt->bind_param("ii", $position, $row['id']);
            $updateStmt->execute();
            $position++;
        }
    }

    public function getStudentAppointments($userId) {
        $query = "SELECT * FROM appointments WHERE user_id = ? ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getAllAppointments() {
        $query = "SELECT * FROM appointments ORDER BY created_at DESC";
        $result = $this->conn->query($query);
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function updateStatus($appointmentId, $status) {
        $query = "UPDATE appointments SET status = ? WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("si", $status, $appointmentId);
        if ($stmt->execute()) {
            if (in_array($status, ['Cancelled', 'Completed'])) {
                $infoQuery = "SELECT doctor_id, appointment_day FROM appointments WHERE id = ?";
                $infoStmt = $this->conn->prepare($infoQuery);
                $infoStmt->bind_param("i", $appointmentId);
                $infoStmt->execute();
                if ($info = $infoStmt->get_result()->fetch_assoc()) {
                    $this->rebalanceTokens($info['doctor_id'], $info['appointment_day']);
                }
            }
            return ['success' => true, 'message' => 'Status updated successfully'];
        }
        return ['success' => false, 'message' => 'Failed to update status: ' . $stmt->error];
    }
}
