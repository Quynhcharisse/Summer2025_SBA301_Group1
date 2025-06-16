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
  Radio
} from "@mui/material";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Snackbar, Alert, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { addChild, updateChild } from "../../services/ParentService";

const ChildrenList = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Dialog state
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    id: "",
    name: "",
    gender: "",
    dateOfBirth: "",
    placeOfBirth: ""
  });
  const [editId, setEditId] = useState(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

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
    setForm({ name: "", gender: "", dateOfBirth: "", placeOfBirth: "" });
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
      placeOfBirth: child.placeOfBirth
    });
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setForm({ name: "", gender: "", dateOfBirth: "", placeOfBirth: "" });
    setEditId(null);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.gender && form.dateOfBirth && form.placeOfBirth) {
      if (editId) {
        console.log(form);
        
        update(form);
      } else {
        add(form);
      }
    } else {
      setSnackbar({ open: true, message: "Please fill in all fields!", severity: "error" });
    }
  };

  useEffect(() => {
    const fetchChildren = async () => {
      setLoading(true);
      const data = await getChildrenList();
      console.log("Fetching children list...");
      console.log("Data received from getChildrenList:", data);      
      let childrenArr = [];
      if (data && data.success === true) {
        childrenArr = data.data.studentList;
        console.log("Children data:", childrenArr);
        
      }
      setChildren(childrenArr);
      setLoading(false);
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

  if (loading) return <div>Loading...</div>;
  if (!children.length) return <div>No children found.</div>;

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editId ? "Edit Child" : "Add Child"}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 350 }}>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <FormControl component="fieldset" required>
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup
                row
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <FormControlLabel value="Male" control={<Radio />} label="Male" />
                <FormControlLabel value="Female" control={<Radio />} label="Female" />
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
            />
            <TextField
              label="Place of Birth"
              name="placeOfBirth"
              value={form.placeOfBirth}
              onChange={handleChange}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              color={editId ? "secondary" : "primary"}
            >
              {editId ? "Update" : "Add"}
            </Button>
          </DialogActions>
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
      <Paper sx={{
        width: '100%',
        borderRadius: 3,
        overflow: 'hidden',
        backgroundColor: '#fff',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        border: '2px solid rgb(254, 254, 253)'
      }}>
        <Typography variant="h6" sx={{ m: 2 }}>Children List</Typography>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <Button variant="contained" onClick={handleOpen} sx={{ color:'#ffffff' }}>
          Add Child
        </Button>
      </div>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell align="center">No</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Gender</TableCell>
                <TableCell align="center">Date of Birth</TableCell>
                <TableCell align="center">Place of Birth</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {children.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((child, index) => (
                  <TableRow key={child.id || child.studentId || index}>
                    <TableCell align="center">{index + 1 + page * rowsPerPage}</TableCell>
                    <TableCell align="center">{child.name}</TableCell>
                    <TableCell align="center">{child.gender}</TableCell>
                    <TableCell align="center">{child.dateOfBirth}</TableCell>
                    <TableCell align="center">{child.placeOfBirth}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="secondary"
                        sx={{
                          backgroundColor: "#ff9800",
                          color: "#fff",
                          "&:hover": { backgroundColor: "#fb8c00" }
                        }}
                        onClick={() => handleEditOpen(child)}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          rowsPerPageOptions={[5, 10, 15]}
          count={children.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
};


export default ChildrenList;



