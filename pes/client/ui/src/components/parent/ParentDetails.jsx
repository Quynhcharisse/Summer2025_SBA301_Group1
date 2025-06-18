import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Stack,
  Divider,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio
} from "@mui/material";
import { getParentById, updateParent } from "../../services/ParentService";

const ParentDetails = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  let parentId = user.user.id;
  const [parent, setParent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!parentId) return;
    setLoading(true);
    getParentById(parentId)
      .then((data) => {
        setParent(data.data);
        setForm(data.data);
      })
      .finally(() => setLoading(false));
  }, [parentId]);

  if (!parentId) return <Typography>No parent selected.</Typography>;
  if (loading) return <Typography>Loading...</Typography>;
  if (!parent) return <Typography>Parent not found.</Typography>;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpen = () => {
    setForm(parent);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateParent(form);
      setParent(updated.data || form);
      setOpen(false);
    } catch (err) {
      // Optionally show error
    }
    setSaving(false);
  };

  return (
    <Card
      sx={{
        mb: 3,
        p: 3,
        background: 'rgba(255,255,255,0.95)',
        borderRadius: 4,
        boxShadow: '0 4px 24px 0 rgba(60,72,88,0.12)',
        border: '1px solid #e3e8ee',
        maxWidth: 800,
        width: '100%',
        mx: 'auto',
        my: 4
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Profile
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <CardContent>

        <Grid container spacing={2} justifyContent={'space-around'}>
          <Grid item xs={12} sm={6} >
            <Stack spacing={1} sx={{ fontSize: "20px" }}>
              <Typography sx={{ fontSize: "20px" }}><b>Name:</b> {parent.name}</Typography>
              <Typography><b>Email:</b> {parent.email}</Typography>
              <Typography><b>Phone:</b> {parent.phone}</Typography>
              <Typography><b>Address:</b> {parent.address}</Typography>
              <Typography><b>Date of Birth:</b> {parent.dayOfBirth}</Typography>
            </Stack>
          </Grid>
          <Divider orientation="vertical" flexItem />
          <Grid item xs={12} sm={6} >
            <Stack spacing={1} sx={{ fontSize: "20px" }}>
              <Typography><b>Gender:</b> {parent.gender}</Typography>
              <Typography><b>Identity Number:</b> {parent.identityNumber}</Typography>
              <Typography><b>Job:</b> {parent.job}</Typography>
              <Typography><b>Relationship to Child:</b> {parent.relationshipToChild}</Typography>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>

      <CardActions>
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleOpen}
        >
          Update Profile
        </Button>
      </CardActions>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Update Parent Profile</DialogTitle>
        <DialogContent dividers>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Grid container spacing={1}>
              {[
                { label: "Name", name: "name" },
                { label: "Email", name: "email" },
                { label: "Phone", name: "phone" },
                { label: "Address", name: "address" },
                { label: "Date of Birth", name: "dayOfBirth" },
                { label: "Identity Number", name: "identityNumber" },
                { label: "Job", name: "job" },
                { label: "Relationship to Child", name: "relationshipToChild" },
              ].map((field) => (
                <Grid item xs={12} key={field.name}>
                  <TextField
                    label={field.label}
                    name={field.name}
                    value={form[field.name] || ""}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                  />
                </Grid>
              ))}
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>Gender</Typography>
                <RadioGroup
                  name="gender"
                  value={form.gender || ""}
                  onChange={handleChange}
                  row
                >
                  <FormControlLabel value="Male" control={<Radio />} label="Male" />
                  <FormControlLabel value="Female" control={<Radio />} label="Female" />
                </RadioGroup>
              </Grid>
            </Grid>
            <DialogActions sx={{ px: 0, mt: 1 }}>
              <Button onClick={handleClose} color="inherit" disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Card >
  );
};

export default ParentDetails;
