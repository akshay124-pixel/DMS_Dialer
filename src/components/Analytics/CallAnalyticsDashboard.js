import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import {
  Phone,
  CheckCircle,
  Cancel,
  Schedule,
  TrendingUp,
  ArrowBack,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

/**
 * Call Analytics Dashboard Component
 * Displays call metrics, trends, and agent performance
 */
const CallAnalyticsDashboard = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [agentPerformance, setAgentPerformance] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const baseURL = process.env.REACT_APP_URL;

      // Fetch all analytics data
      const [summaryRes, agentRes, trendsRes] = await Promise.all([
        axios.get(`${baseURL}/api/analytics/call-summary`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${baseURL}/api/analytics/agent-performance`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${baseURL}/api/analytics/call-trends?days=30`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (summaryRes.data.success) setSummary(summaryRes.data.data);
      if (agentRes.data.success) setAgentPerformance(agentRes.data.data);
      if (trendsRes.data.success) setTrends(trendsRes.data.data);
    } catch (error) {
      console.error("Fetch analytics error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const chartData = {
    labels: trends.map((t) => t._id),
    datasets: [
      {
        label: "Total Calls",
        data: trends.map((t) => t.totalCalls),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
      {
        label: "Completed Calls",
        data: trends.map((t) => t.completedCalls),
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Call Trends (Last 30 Days)",
      },
    },
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3} sx={{ background: "#f5f7fa", minHeight: "100vh" }}>
      {/* Header */}
      <Box 
        display="flex" 
        alignItems="center" 
        gap={2} 
        mb={3}
       
      >
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/dashboard")}
          sx={{
            background: "white",
            color: "#2575fc",
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            px: 2,
            "&:hover": {
              background: "#f0f0f0",
            }
          }}
        >
          Back to Dashboard
        </Button>
        {/* <Typography variant="h4" sx={{ flexGrow: 2, fontWeight: 600, color: "Black" }}>
          📞 Call Analytics Dashboard
        </Typography> */}
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-4px)", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom fontWeight={500}>
                    Total Calls
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>{summary?.totalCalls || 0}</Typography>
                </Box>
                <Box sx={{ background: "#e3f2fd", borderRadius: "50%", p: 1.5 }}>
                  <Phone color="primary" sx={{ fontSize: 32 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-4px)", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom fontWeight={500}>
                    Completed
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>{summary?.completedCalls || 0}</Typography>
                </Box>
                <Box sx={{ background: "#e8f5e9", borderRadius: "50%", p: 1.5 }}>
                  <CheckCircle color="success" sx={{ fontSize: 32 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-4px)", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom fontWeight={500}>
                    Connection Rate
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>{summary?.connectionRate || 0}%</Typography>
                </Box>
                <Box sx={{ background: "#e1f5fe", borderRadius: "50%", p: 1.5 }}>
                  <TrendingUp color="info" sx={{ fontSize: 32 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-4px)", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom fontWeight={500}>
                    Total Duration
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>{summary?.totalDurationFormatted || "0:00:00"}</Typography>
                </Box>
                <Box sx={{ background: "#fff3e0", borderRadius: "50%", p: 1.5 }}>
                  <Schedule color="warning" sx={{ fontSize: 32 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Call Trends Chart */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          border: "1px solid #e0e0e0"
        }}
      >
        <Typography variant="h6" gutterBottom fontWeight={600} color="#2575fc" sx={{ mb: 2 }}>
          📈 Call Trends (Last 30 Days)
        </Typography>
        <Line data={chartData} options={chartOptions} />
      </Paper>

      {/* Agent Performance Table */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          border: "1px solid #e0e0e0"
        }}
      >
        <Typography variant="h6" gutterBottom fontWeight={600} color="#2575fc" sx={{ mb: 2 }}>
          👥 Agent Performance
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: "linear-gradient(135deg, #2575fc, #6a11cb)" }}>
                <TableCell sx={{ fontWeight: 600, color: "white" }}>Agent</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: "white" }}>Total Calls</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: "white" }}>Completed</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: "white" }}>Connection Rate</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: "white" }}>Total Duration</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: "white" }}>Avg Duration</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agentPerformance.map((agent) => (
                <TableRow 
                  key={agent.userId} 
                  sx={{ 
                    "&:hover": { background: "#f5f7fa" },
                    "&:nth-of-type(odd)": { background: "#fafbfc" }
                  }}
                >
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="bold" color="#2575fc">
                        {agent.username}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {agent.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>{agent.totalCalls}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>{agent.completedCalls}</TableCell>
                  <TableCell align="right">
                    <Chip
                      label={`${agent.connectionRate}%`}
                      color={agent.connectionRate > 50 ? "success" : "warning"}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>{agent.totalDurationFormatted}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>{agent.avgDurationFormatted}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default CallAnalyticsDashboard;
