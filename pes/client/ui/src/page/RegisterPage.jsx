import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Typography,
  Snackbar,
  Alert
} from "@mui/material";
import { register } from "../services/AuthService";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const initialState = {
  email: "",
  password: "",
  name: "",
  phone: "",
  gender: "",
  identityNumber: "",
  address: "",
  job: "",
  relationshipToChild: "",
  dayOfBirth: ""
};

export default function RegisterPage() {
  const [form, setForm] = useState(initialState);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register(form);
      if (res && res.success) {
        window.location.href = "/login";
      } else {
        setSnackbar({ open: true, message: res?.message || "Registration failed!", severity: "error" });
      }
    } catch (error) {
      setSnackbar({ open: true, message: "Registration failed!", severity: "error" });
    }
  };

  const handleCancel = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <>
      <Box
        className="wrapper"
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage:
            'url("https://merrystar.edu.vn/wp-content/uploads/2021/09/hoi-dong-khoa-hoc-bg.png")'
        }}
      >
        <Box
          sx={{
            width: 400,
            bgcolor: "white",
            p: 4,
            borderRadius: 2,
            boxShadow: 3
          }}
        >
          <Typography variant="h5" align="center" mb={2}>
            Register
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <FormControl component="fieldset" margin="normal" required>
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup
                row
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="female" control={<Radio />} label="Female" />
              </RadioGroup>
            </FormControl>
            <TextField
              label="Identity Number"
              name="identityNumber"
              value={form.identityNumber}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Job"
              name="job"
              value={form.job}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Relationship To Child"
              name="relationshipToChild"
              value={form.relationshipToChild}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Day of Birth"
              name="dayOfBirth"
              type="date"
              value={form.dayOfBirth}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                backgroundColor: "#2c3e50",
                color: "#fff",
                "&:hover": { backgroundColor: "#1a252f" }
              }}
            >
              Register
            </Button>
            <Button
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleCancel} // Add the cancel button
            >
              Cancel
            </Button>
          </form>
        </Box>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
