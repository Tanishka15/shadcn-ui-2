<?php
require_once __DIR__ . '/../config/db.php';

class QueueController {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getQueueStatus($doctorId, $day = null) {
        if (!$day) {
            $day = date('l'); // Default to today
        }

        // Get basic doctor info
        $docQuery = "SELECT doctor_name, specialization FROM doctor_schedule WHERE id = ?";
        $docStmt = $this->conn->prepare($docQuery);
        $docStmt->bind_param("i", $doctorId);
        $docStmt->execute();
        $doctor = $docStmt->get_result()->fetch_assoc();

        if (!$doctor) {
            return ['success' => false, 'message' => 'Doctor not found'];
        }

        // Total patients (not cancelled)
        $totalQuery = "SELECT COUNT(*) as total FROM appointments WHERE doctor_id = ? AND appointment_day = ? AND status != 'Cancelled'";
        $totalStmt = $this->conn->prepare($totalQuery);
        $totalStmt->bind_param("is", $doctorId, $day);
        $totalStmt->execute();
        $total = $totalStmt->get_result()->fetch_assoc()['total'];

        // Current token being served (highest priority, then first booked)
        $currentQuery = "SELECT token_number FROM appointments 
                          WHERE doctor_id = ? AND appointment_day = ? AND status IN ('Confirmed', 'Pending')
                          ORDER BY priority_level ASC, created_at ASC LIMIT 1";
        $currentStmt = $this->conn->prepare($currentQuery);
        $currentStmt->bind_param("is", $doctorId, $day);
        $currentStmt->execute();
        $currentToken = $currentStmt->get_result()->fetch_assoc()['token_number'] ?? 0;

        // Waiting count
        $waitingQuery = "SELECT COUNT(*) as waiting FROM appointments WHERE doctor_id = ? AND appointment_day = ? AND status IN ('Confirmed', 'Pending')";
        $waitingStmt = $this->conn->prepare($waitingQuery);
        $waitingStmt->bind_param("is", $doctorId, $day);
        $waitingStmt->execute();
        $waiting = $waitingStmt->get_result()->fetch_assoc()['waiting'];

        // Estimated wait time (12 mins per patient)
        $estWait = $waiting * 12;

        return [
            'success' => true,
            'data' => [
                'doctor_name' => $doctor['doctor_name'],
                'specialization' => $doctor['specialization'],
                'total_patients' => (int)$total,
                'current_token' => (int)$currentToken,
                'waiting_count' => (int)$waiting,
                'estimated_wait_time' => $estWait . " minutes"
            ]
        ];
    }

    public function getAllQueues() {
        $day = date('l');
        $query = "SELECT id, doctor_name, specialization FROM doctor_schedule WHERE status != 'Offline'";
        $result = $this->conn->query($query);
        $queues = [];
        while ($row = $result->fetch_assoc()) {
            $queues[] = $this->getQueueStatus($row['id'], $day)['data'];
        }
        return ['success' => true, 'data' => $queues];
    }
}
?>
