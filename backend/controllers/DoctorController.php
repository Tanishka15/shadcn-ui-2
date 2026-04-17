<?php

require_once __DIR__ . '/../config/db.php';

class DoctorController
{
    private $conn;

    public function __construct($conn)
    {
        $this->conn = $conn;
    }

    // Get all doctor schedules
    public function getSchedule()
    {
        try {
            $query = "SELECT ds.*, 
                             (SELECT COUNT(*) FROM appointments a WHERE a.doctor_id = ds.id AND a.appointment_day = ds.day_name AND a.status != 'Cancelled') as current_appointments
                      FROM doctor_schedule ds 
                      ORDER BY FIELD(day_name, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')";
            $result = $this->conn->query($query);
            
            if (!$result) {
                throw new Exception("Query failed: " . $this->conn->error);
            }

            $schedule = [];
            while ($row = $result->fetch_assoc()) {
                $row['current_appointments'] = (int)$row['current_appointments'];
                $row['max_slots'] = (int)($row['max_slots'] ?? 10);
                $schedule[] = $row;
            }

            return [
                'success' => true,
                'data' => $schedule
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    // Update doctor status
    public function updateStatus($id, $status)
    {
        try {
            if (!in_array($status, ['Available', 'Busy', 'Offline'])) {
                throw new Exception("Invalid status provided");
            }

            $query = "UPDATE doctor_schedule SET status = ? WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("si", $status, $id);
            
            if ($stmt->execute()) {
                return [
                    'success' => true,
                    'message' => 'Status updated successfully'
                ];
            } else {
                throw new Exception("Failed to update status");
            }
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
}
?>
