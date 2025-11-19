import { useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { Schedule } from "@mui/icons-material";
import { toast } from "react-toastify";

/**
 * Schedule Callback Modal Component
 * Allows agents to schedule callbacks for leads
 */
const ScheduleCallbackModal = ({ open, onClose, leadId, leadName, onCallbackScheduled }) => {
  const [callbackTime, setCallbackTime] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset form when modal closes
  const handleClose = () => {
    setCallbackTime("");
    setReason("");
    setLoading(false);
    onClose();
  };

  const handleSchedule = async () => {
    if (!callbackTime) {
      toast.error("Please select callback date and time");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_URL || "http://localhost:4000"}/api/dialer/schedule-callback`,
        {
          leadId,
          callbackTime,
          reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Callback scheduled successfully!");

        // Callback to parent
        if (onCallbackScheduled) {
          onCallbackScheduled(response.data);
        }

        // Reset form and close
        setCallbackTime("");
        setReason("");
        onClose();
      }
    } catch (error) {
      console.error("Schedule callback error:", error);
      toast.error(error.response?.data?.message || "Failed to schedule callback");
    } finally {
      setLoading(false);
    }
  };

  // Get minimum datetime (current time)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{ sx: { borderRadius: "12px" } }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #2575fc, #6a11cb)",
          color: "white",
          fontWeight: 600,
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Schedule />
          <Typography variant="h6" fontWeight={600}>
            📅 Schedule Callback
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Box display="flex" flexDirection="column" gap={2.5} mt={1}>
          <Box 
            sx={{ 
              p: 2, 
              background: "#e3f2fd", 
              borderRadius: "8px",
              borderLeft: "4px solid #2575fc"
            }}
          >
            <Typography variant="body2" color="textSecondary">
              Scheduling callback for:
            </Typography>
            <Typography variant="body1" fontWeight={600} color="#2575fc">
              {leadName}
            </Typography>
          </Box>

          <TextField
            label="Callback Date & Time"
            type="datetime-local"
            value={callbackTime}
            onChange={(e) => setCallbackTime(e.target.value)}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              min: getMinDateTime(),
            }}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              }
            }}
          />

          <TextField
            label="Reason / Notes"
            multiline
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            fullWidth
            placeholder="e.g., Customer requested callback after 2 PM"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              }
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button 
          onClick={handleClose} 
          disabled={loading}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            color: "#666",
            "&:hover": {
              background: "#f0f0f0",
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSchedule}
          variant="contained"
          disabled={loading || !callbackTime}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            background: "linear-gradient(135deg, #2575fc, #6a11cb)",
            "&:hover": {
              background: "linear-gradient(135deg, #1a5fd9, #5a0fb0)",
            },
            "&:disabled": {
              background: "#ccc",
              color: "#999"
            }
          }}
        >
          {loading ? "Scheduling..." : "Schedule Callback"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleCallbackModal;
