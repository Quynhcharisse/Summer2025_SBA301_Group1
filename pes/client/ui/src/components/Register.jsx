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
  Alert,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel
} from "@mui/material";
import { register } from "../services/AuthService.jsx";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const steps = ['Account Setup', 'Personal Information'];

const initialState = {
  // Step 1: Account Setup
  email: "",
  password: "",
  confirmPassword: "",
  
  // Step 2: Personal Information
  name: "",
  phone: "",
  gender: "",
  identityNumber: "",
  address: "",
  job: "",
  relationshipToChild: "",
  dayOfBirth: ""
};

export default function Register() {
  const [form, setForm] = useState(initialState);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateStep1 = () => {
    const newErrors = {};
    
    // Email validation
    if (!form.email || form.email.trim() === "") {
      newErrors.email = "Email is required.";
    } else if (!/^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/.test(form.email)) {
      newErrors.email = "Invalid email format.";
    }
    
    // Password validation
    if (!form.password || form.password.trim() === "") {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    } else {
      const digitPattern = /.*\d.*/;
      const lowerCasePattern = /.*[a-z].*/;
      const upperCasePattern = /.*[A-Z].*/;
      const specialPattern = /.*[^A-Za-z0-9].*/;
      
      if (!digitPattern.test(form.password)) {
        newErrors.password = "Password must contain at least one digit.";
      } else if (!lowerCasePattern.test(form.password)) {
        newErrors.password = "Password must contain at least one lowercase letter.";
      } else if (!upperCasePattern.test(form.password)) {
        newErrors.password = "Password must contain at least one uppercase letter.";
      } else if (!specialPattern.test(form.password)) {
        newErrors.password = "Password must contain at least one special character.";
      }
    }
    
    // Confirm password validation
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Confirm password does not match password.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    // Name validation
    if (!form.name || form.name.trim() === "") {
      newErrors.name = "Name is required.";
    } else if (!form.name.trim().match(/^[a-zA-Z\s'-]+$/)) {
      newErrors.name = "Name can only contain letters, spaces, hyphens, and apostrophes.";
    } else if (form.name.trim().length < 2 || form.name.trim().length > 50) {
      newErrors.name = "Name must be between 2 and 50 characters.";
    }
    
    // Phone validation
    if (!form.phone || form.phone.trim() === "") {
      newErrors.phone = "Phone number is required.";
    } else if (!form.phone.trim().match(/^(03|05|07|08|09)\d{8}$/)) {
      newErrors.phone = "Phone number must start with a valid prefix and be 10 digits.";
    }
    
    // Gender validation
    if (!form.gender || form.gender.trim() === "") {
      newErrors.gender = "Gender is required.";
    } else if (form.gender.trim() !== "male" && form.gender.trim() !== "female") {
      newErrors.gender = "Gender must be 'male' or 'female'.";
    }
    
    // Identity Number validation
    if (!form.identityNumber || form.identityNumber.trim() === "") {
      newErrors.identityNumber = "Identity number is required.";
    } else if (!form.identityNumber.match(/^\d{12}$/)) {
      newErrors.identityNumber = "Identity number must be exactly 12 digits.";
    }
    
    // Address validation
    if (!form.address || form.address.trim() === "") {
      newErrors.address = "Address is required.";
    } else if (form.address.trim().length < 5 || form.address.trim().length > 255) {
      newErrors.address = "Address must be between 5 and 255 characters.";
    }
    
    // Job validation
    if (!form.job || form.job.trim() === "") {
      newErrors.job = "Job is required.";
    } else if (!form.job.trim().match(/^[a-zA-Z\s'-]{2,50}$/)) {
      newErrors.job = "Job can only contain letters and must be between 2 and 50 characters.";
    }
    
    // Relationship validation
    if (!form.relationshipToChild || form.relationshipToChild.trim() === "") {
      newErrors.relationshipToChild = "Relationship to child is required.";
    } else if (!form.relationshipToChild.trim().match(/^(Father|Mother|Guardian)$/)) {
      newErrors.relationshipToChild = "Relationship to child must be one of: Father, Mother, Guardian.";
    }
    
    // Date of birth validation
    if (!form.dayOfBirth) {
      newErrors.dayOfBirth = "Day of birth is required.";
    } else {
      const birthDate = new Date(form.dayOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();
      
      if (age < 18 || (age === 18 && monthDiff < 0) || (age === 18 && monthDiff === 0 && dayDiff < 0)) {
        newErrors.dayOfBirth = "Parent must be at least 18 years old.";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (activeStep === 0 && validateStep1()) {
      setActiveStep(1);
    }
  };

  const handleBack = () => {
    setActiveStep(0);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    const registerData = {
      email: form.email,
      confirmPassword: form.confirmPassword,
      password: form.password,
      name: form.name,
      phone: form.phone,
      gender: form.gender,
      identityNumber: form.identityNumber,
      address: form.address,
      job: form.job,
      relationshipToChild: form.relationshipToChild,
      dayOfBirth: form.dayOfBirth
    };

    try {
      const res = await register(registerData);
      if (res && res.success) {
        setSnackbar({
          open: true,
          message: "Registration successful! Please login.",
          severity: "success"
        });
        setTimeout(() => {
          navigate(`/login?email=${encodeURIComponent(form.email)}`);
        }, 2000);
      } else {
        setSnackbar({
          open: true,
          message: res?.message || "Registration failed!",
          severity: "error"
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Registration failed!",
        severity: "error"
      });
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              error={!!errors.email}
              helperText={errors.email}
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
              error={!!errors.password}
              helperText={errors.password}
            />
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              error={!!errors.phone}
              helperText={errors.phone}
            />
            <FormControl component="fieldset" margin="normal" required error={!!errors.gender}>
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
              {errors.gender && (
                <Typography color="error" variant="caption">
                  {errors.gender}
                </Typography>
              )}
            </FormControl>
            <TextField
              label="Identity Number"
              name="identityNumber"
              value={form.identityNumber}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              error={!!errors.identityNumber}
              helperText={errors.identityNumber}
            />
            <TextField
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              error={!!errors.address}
              helperText={errors.address}
            />
            <TextField
              label="Job"
              name="job"
              value={form.job}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              error={!!errors.job}
              helperText={errors.job}
            />
            <FormControl component="fieldset" margin="normal" required error={!!errors.relationshipToChild}>
              <FormLabel component="legend">Relationship To Child</FormLabel>
              <RadioGroup
                row
                name="relationshipToChild"
                value={form.relationshipToChild}
                onChange={handleChange}
              >
                <FormControlLabel value="Father" control={<Radio />} label="Father" />
                <FormControlLabel value="Mother" control={<Radio />} label="Mother" />
              </RadioGroup>
              {errors.relationshipToChild && (
                <Typography color="error" variant="caption">
                  {errors.relationshipToChild}
                </Typography>
              )}
            </FormControl>
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
              error={!!errors.dayOfBirth}
              helperText={errors.dayOfBirth}
            />
          </Box>
        );
      default:
        return null;
    }
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
            'url("https://merrystar.edu.vn/wp-content/uploads/2021/09/hoi-dong-khoa-hoc-bg.png")',
          position: 'relative'
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{
            position: 'absolute',
            top: '40px',
            left: '40px',
            color: '#fff',
            backgroundColor: '#1A252F',
            padding: '8px 16px',
            borderRadius: '4px',
            textTransform: 'uppercase',
            fontSize: '14px',
            fontWeight: '500',
            letterSpacing: '0.5px'
          }}
        >
          Back to Home
        </Button>
        <Box
          sx={{
            width: 500,
            bgcolor: "white",
            p: 4,
            borderRadius: 2,
            boxShadow: 3
          }}
        >
          <Typography variant="h4" align="center" mb={2} sx={{fontWeight: 'bold'}}>
            Register
          </Typography>
          
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form onSubmit={handleSubmit}>
            {renderStepContent(activeStep)}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              {activeStep === 1 && (
                <Button onClick={handleBack} sx={{ mr: 1 }}>
                  Back
                </Button>
              )}
              
              {activeStep === 0 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{
                    backgroundColor: "#2c3e50",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#1a252f" }
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: "#2c3e50",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#1a252f" }
                  }}
                >
                  Register
                </Button>
              )}
            </Box>
          </form>
        </Box>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
