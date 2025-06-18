import React, { useEffect, useState } from "react";
import { getChildrenList } from "../../services/ParentService";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  CircularProgress,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  IconButton,
  AppBar,
  Toolbar
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { addChild, updateChild } from "../../services/ParentService";
import axios from "axios";

const ChildrenList = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Dialog state
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    id: "",
    name: "",
    gender: "",
    dateOfBirth: "",
    placeOfBirth: "",
    // Form information
    householdRegistrationAddress: "",
    profileImage: "",
    birthCertificateImg: "",
    householdRegistrationImg: "",
    commitmentImg: ""
  });
  const [editId, setEditId] = useState(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Add state for file uploads
  const [uploadedFiles, setUploadedFiles] = useState({
    profile: null,
    birth: null,
    household: null,
    commitment: null
  });

  const add = async (child) => {
    try {
      const response = await addChild(child);
      const newChild = response?.data || response;
      setChildren(prev => [...prev, newChild]);
      setSnackbar({ open: true, message: "Add child successfully!", severity: "success" });
      handleClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Add child failed!",
        severity: "error"
      });
    }
  };

  const update = async (child) => {
    try {
      const response = await updateChild(child);
      const updatedChild = response?.data || response;

      setChildren(prev =>
          prev.map(c =>
              (c.id || c.studentId) === editId ? { ...c, ...updatedChild } : c
          )
      );
      setSnackbar({ open: true, message: "Update child successfully!", severity: "success" });
      handleClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Update child failed!",
        severity: "error"
      });
    }
  };

  const handleOpen = () => {
    setEditId(null);
    setForm({ name: "", gender: "", dateOfBirth: "", placeOfBirth: "", householdRegistrationAddress: "", profileImage: "", birthCertificateImg: "", householdRegistrationImg: "", commitmentImg: "" });
    setOpen(true);
  };
  
  const handleEditOpen = (child) => {
    console.log("Editing child:", child);
    
    setEditId(child.id);
    setForm({
      id: child.id,
      name: child.name,
      gender: child.gender,
      dateOfBirth: child.dateOfBirth,
      placeOfBirth: child.placeOfBirth,
      householdRegistrationAddress: child.householdRegistrationAddress,
      profileImage: child.profileImage,
      birthCertificateImg: child.birthCertificateImg,
      householdRegistrationImg: child.householdRegistrationImg,
      commitmentImg: child.commitmentImg
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setForm({ name: "", gender: "", dateOfBirth: "", placeOfBirth: "", householdRegistrationAddress: "", profileImage: "", birthCertificateImg: "", householdRegistrationImg: "", commitmentImg: "" });
    setEditId(null);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle file upload
  const handleFileUpload = async (file, type) => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "pes_swd");
    formData.append("api_key", "837117616828593");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dbrfnkrbh/image/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      if (response.status === 200) {
        setForm(prev => ({
          ...prev,
          [type]: response.data.url
        }));
        setUploadedFiles(prev => ({
          ...prev,
          [type.replace("Img", "").replace("Image", "")]: file
        }));
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setSnackbar({
        open: true,
        message: "Failed to upload image",
        severity: "error"
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.name && form.gender && form.dateOfBirth && form.placeOfBirth) {
      // Check if any form field is provided, all must be provided
      const hasAnyFormField = form.profileImage || form.householdRegistrationAddress || 
                            form.birthCertificateImg || form.householdRegistrationImg || 
                            form.commitmentImg;

      const hasAllFormFields = form.profileImage && form.householdRegistrationAddress && 
                             form.birthCertificateImg && form.householdRegistrationImg && 
                             form.commitmentImg;

      if (hasAnyFormField && !hasAllFormFields) {
        setSnackbar({
          open: true,
          message: "Please provide all form fields or none",
          severity: "error"
        });
        return;
      }

      if (editId) {
        update(form);
      } else {
        add(form);
      }
    } else {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields!",
        severity: "error"
      });
    }
  };

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getChildrenList();
        console.log("Fetching children list...");
        console.log("Data received from getChildrenList:", data);      
        
        if (!data) {
          throw new Error("Failed to fetch children data");
        }

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch children data");
        }

        const childrenArr = data.data || [];
        console.log("Children data:", childrenArr);
        setChildren(childrenArr);
      } catch (err) {
        console.error("Error fetching children:", err);
        setError(err.message || "Failed to fetch children data");
        setChildren([]);
      } finally {
        setLoading(false);
      }
    };
    fetchChildren();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const safeChildren = Array.isArray(children) ? children : [];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  console.log(form)
  return (
    <Box sx={{ p: 3, maxWidth: '1400px', mx: 'auto' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4,
        mt: 2
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            flex: 1,
            textAlign: 'center',
            color: 'rgb(51, 62, 77)',
            fontWeight: 'bold',
            fontSize: '32px',
            mb: 1
          }}
        >
          Children List
        </Typography>
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{
            bgcolor: 'rgb(51, 62, 77)',
            '&:hover': {
              bgcolor: 'rgb(41, 52, 67)'
            },
            position: 'absolute',
            right: '24px'
          }}
        >
          ADD CHILD
        </Button>
      </Box>

      <Box sx={{ 
        maxWidth: '1200px', 
        mx: 'auto',
        mt: 4
      }}>
        <TableContainer component={Paper} sx={{ 
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <Table>
            <TableHead>
              <TableRow sx={{ 
                bgcolor: 'rgb(51, 62, 77)',
                '& th': {
                  fontSize: '15px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  padding: '16px'
                }
              }}>
                <TableCell sx={{ color: 'white' }}>Name</TableCell>
                <TableCell sx={{ color: 'white' }}>Gender</TableCell>
                <TableCell sx={{ color: 'white' }}>Date of Birth</TableCell>
                <TableCell sx={{ color: 'white' }}>Place of Birth</TableCell>
                <TableCell sx={{ color: 'white' }}>Status</TableCell>
                <TableCell sx={{ color: 'white' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {children.length > 0 ? (
                children.map((child) => (
                  <TableRow 
                    key={child.id} 
                    sx={{ 
                      '&:hover': { 
                        bgcolor: 'rgba(0, 0, 0, 0.04)',
                        transition: 'background-color 0.2s ease'
                      },
                      '& td': {
                        padding: '16px',
                        fontSize: '14px'
                      }
                    }}
                  >
                    <TableCell>{child.name}</TableCell>
                    <TableCell>{child.gender}</TableCell>
                    <TableCell>{child.dateOfBirth}</TableCell>
                    <TableCell>{child.placeOfBirth}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'inline-block',
                          px: 2,
                          py: 0.5,
                          borderRadius: '16px',
                          bgcolor: child.isStudent ? 'rgba(46, 125, 50, 0.1)' : 'rgba(237, 108, 2, 0.1)',
                          color: child.isStudent ? 'rgb(46, 125, 50)' : 'rgb(237, 108, 2)',
                          fontSize: '13px',
                          fontWeight: '500'
                        }}
                      >
                        {child.isStudent ? 'Enrolled' : 'Pending'}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        onClick={() => handleEditOpen(child)}
                        disabled={child.isStudent}
                        sx={{ 
                          color: child.isStudent ? 'grey.400' : 'rgb(51, 62, 77)',
                          '&:hover': {
                            bgcolor: 'rgba(51, 62, 77, 0.04)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell 
                    colSpan={6} 
                    align="center" 
                    sx={{ 
                      py: 8,
                      fontSize: '15px',
                      color: 'text.secondary',
                      bgcolor: 'rgba(0, 0, 0, 0.02)'
                    }}
                  >
                    <Typography variant="body1">
                      No children found. Click "ADD CHILD" to add one.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog 
        fullScreen 
        open={open} 
        onClose={handleClose}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
              {editId ? "Edit Child Information" : "Add New Child"}
            </Typography>
          </Toolbar>
        </AppBar>

        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ 
            p: 4,
            maxWidth: '1200px',
            mx: 'auto',
            height: 'calc(100% - 140px)', // Adjust for AppBar and footer height
            overflow: 'auto'
          }}>
            {/* Basic Information Section */}
            <Typography variant="h5" sx={{ 
              mb: 3,
              pb: 1,
              borderBottom: '2px solid',
              borderColor: 'primary.main',
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: '28px',
              color: 'rgb(51, 62, 77)'
            }}>
              Form Information
            </Typography>
            <Stack spacing={3} sx={{ mb: 6 }}>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
                fullWidth
                variant="outlined"
                size="medium"
            />
            <FormControl component="fieldset" required>
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup
                row
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                  <FormControlLabel 
                    value="Male" 
                    control={<Radio color="primary" />} 
                    label="Male"
                  />
                  <FormControlLabel 
                    value="Female" 
                    control={<Radio color="primary" />} 
                    label="Female"
                  />
              </RadioGroup>
            </FormControl>
            <TextField
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
                fullWidth
                size="medium"
            />
            <TextField
              label="Place of Birth"
              name="placeOfBirth"
              value={form.placeOfBirth}
              onChange={handleChange}
              required
                fullWidth
                size="medium"
              />
            </Stack>

            <Divider sx={{ my: 4 }} />

            {/* Form Information Section */}
            <Typography variant="h5" sx={{ 
              mb: 3,
              pb: 1,
              borderBottom: '2px solid',
              borderColor: 'primary.main',
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: '28px',
              color: 'rgb(51, 62, 77)'
            }}>
              Upload Documents
            </Typography>
            <Stack spacing={4}>
              <TextField
                label="Household Registration Address"
                name="householdRegistrationAddress"
                value={form.householdRegistrationAddress}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                helperText="Enter the complete household registration address"
                size="medium"
              />

              {/* File Upload Section */}
              <Stack spacing={3}>
                {/* Profile Image Upload */}
                <Stack 
                  direction="row" 
                  alignItems="center" 
                  spacing={2}
                  sx={{ 
                    p: 3, 
                    border: '1px dashed',
                    borderColor: 'primary.main',
                    borderRadius: 2,
                    bgcolor: 'grey.50'
                  }}
                >
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    sx={{ minWidth: '200px', height: '45px' }}
                  >
                    Profile Image
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files[0], "profileImage")}
                    />
                  </Button>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
                    <Typography noWrap sx={{ flex: 1, color: uploadedFiles.profile ? 'text.primary' : 'text.secondary' }}>
                      {uploadedFiles.profile?.name || "No file chosen"}
                    </Typography>
                    {uploadedFiles.profile && (
                      <IconButton 
                        size="small" 
                        onClick={() => {
                          setUploadedFiles(prev => ({ ...prev, profile: null }));
                          setForm(prev => ({ ...prev, profileImage: "" }));
                        }}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Stack>
                </Stack>

                {/* Birth Certificate Upload */}
                <Stack 
                  direction="row" 
                  alignItems="center" 
                  spacing={2}
                  sx={{ 
                    p: 3, 
                    border: '1px dashed',
                    borderColor: 'primary.main',
                    borderRadius: 2,
                    bgcolor: 'grey.50'
                  }}
                >
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    sx={{ minWidth: '200px', height: '45px' }}
                  >
                    Birth Certificate
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files[0], "birthCertificateImg")}
                    />
                  </Button>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
                    <Typography noWrap sx={{ flex: 1, color: uploadedFiles.birth ? 'text.primary' : 'text.secondary' }}>
                      {uploadedFiles.birth?.name || "No file chosen"}
                    </Typography>
                    {uploadedFiles.birth && (
                      <IconButton 
                        size="small" 
                        onClick={() => {
                          setUploadedFiles(prev => ({ ...prev, birth: null }));
                          setForm(prev => ({ ...prev, birthCertificateImg: "" }));
                        }}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Stack>
                </Stack>

                {/* Household Registration Upload */}
                <Stack 
                  direction="row" 
                  alignItems="center" 
                  spacing={2}
                  sx={{ 
                    p: 3, 
                    border: '1px dashed',
                    borderColor: 'primary.main',
                    borderRadius: 2,
                    bgcolor: 'grey.50'
                  }}
                >
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    sx={{ minWidth: '200px', height: '45px' }}
                  >
                    Household Doc
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files[0], "householdRegistrationImg")}
                    />
                  </Button>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
                    <Typography noWrap sx={{ flex: 1, color: uploadedFiles.household ? 'text.primary' : 'text.secondary' }}>
                      {uploadedFiles.household?.name || "No file chosen"}
                    </Typography>
                    {uploadedFiles.household && (
                      <IconButton 
                        size="small" 
                        onClick={() => {
                          setUploadedFiles(prev => ({ ...prev, household: null }));
                          setForm(prev => ({ ...prev, householdRegistrationImg: "" }));
                        }}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Stack>
                </Stack>

                {/* Commitment Upload */}
                <Stack 
                  direction="row" 
                  alignItems="center" 
                  spacing={2}
                  sx={{ 
                    p: 3, 
                    border: '1px dashed',
                    borderColor: 'primary.main',
                    borderRadius: 2,
                    bgcolor: 'grey.50'
                  }}
                >
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    sx={{ minWidth: '200px', height: '45px' }}
                  >
                    Commitment
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files[0], "commitmentImg")}
                    />
                  </Button>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
                    <Typography noWrap sx={{ flex: 1, color: uploadedFiles.commitment ? 'text.primary' : 'text.secondary' }}>
                      {uploadedFiles.commitment?.name || "No file chosen"}
                    </Typography>
                    {uploadedFiles.commitment && (
                      <IconButton 
                        size="small" 
                        onClick={() => {
                          setUploadedFiles(prev => ({ ...prev, commitment: null }));
                          setForm(prev => ({ ...prev, commitmentImg: "" }));
                        }}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </DialogContent>
          
          <Box sx={{
            position: 'fixed',
            bottom: 0,
            right: 0,
            width: '100%',
            bgcolor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider',
            p: 2,
            display: 'flex',
            justifyContent: 'flex-end',
            zIndex: 1,
          }}>
            <Button
              variant="contained"
              type="submit"
              sx={{
                minWidth: 120,
                bgcolor: 'rgb(51, 62, 77)',
                '&:hover': {
                  bgcolor: 'rgb(41, 52, 67)'
                }
              }}
            >
              SAVE
            </Button>
          </Box>
        </form>
      </Dialog>
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
          </Box>
  );
};

export default ChildrenList;



