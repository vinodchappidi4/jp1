import React, { useState, useEffect, useMemo, ChangeEvent } from 'react';
import {
  Box, Button, TextField, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Avatar, IconButton, Typography, Grid, InputAdornment, Snackbar, Alert,
  Dialog, DialogActions, DialogContent, DialogTitle, AppBar, Toolbar, Slide, Modal, Tab, Tabs
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import axios from 'axios';
import { HashLoader } from 'react-spinners';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { Autocomplete } from '@mui/material';
import { indianCitiesData } from './indianCitiesData';
import CompanyContacts from './CompanyContacts';

axios.defaults.baseURL = 'http://localhost:3000';

interface Company {
  id: number;
  name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  logo: { data: Buffer } | null;
}

interface NewCompany {
  name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  logo: File | null;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const INDIAN_STATES: string[] = Object.keys(indianCitiesData);

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

export default function Company() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [formData, setFormData] = useState<NewCompany>({
    name: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    logo: null,
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [cities, setCities] = useState<string[]>([]);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    if (newValue === 1 && editingId) {
      console.log('Opening Contacts tab for company ID:', editingId);
    }
  };

  const fetchCompanyData = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Company[]>('/company');
      setCompanies(sortCompanies(response.data));
    } catch (error) {
      console.error('Error fetching companies:', error);
      setSnackbarMessage('Failed to fetch companies. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleDelete = async (companyId: number) => {
    setLoading(true);
    try {
      await axios.delete(`/company/${companyId}`);
      setCompanies(prevCompanies =>
        sortCompanies(prevCompanies.filter(company => company.id !== companyId))
      );
      setSnackbarMessage('Company deleted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting company:', error);
      setSnackbarMessage('Failed to delete company. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const sortCompanies = (companies: Company[]) => {
    return [...companies].sort((a, b) => a.name.localeCompare(b.name));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prevData => ({ ...prevData, [name]: value as string }));
      validateField(name, value as string);
    }
  };

  const handleStateChange = (event: React.SyntheticEvent, newValue: string | null) => {
    if (newValue) {
      setFormData(prevData => ({ ...prevData, state: newValue, city: '' }));
      setCities(indianCitiesData[newValue] || []);
    } else {
      setFormData(prevData => ({ ...prevData, state: '', city: '' }));
      setCities([]);
    }
  };

  const handleCityChange = (event: React.SyntheticEvent, newValue: string | null) => {
    setFormData(prevData => ({ ...prevData, city: newValue || '' }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prevData => ({ ...prevData, logo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = 'Only letters and spaces allowed';
        }
        break;
      case 'address1':
      case 'address2':
        if (value.length > 75) {
          error = 'Address cannot exceed 75 characters';
        }
        break;
      case 'zipCode':
        if (!/^\d{6}$/.test(value)) {
          error = 'ZIP code must be exactly 6 digits';
        }
        break;
      case 'city':
      case 'state':
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = 'Only letters and spaces allowed';
        }
        break;
    }
    setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
    return error;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(errors).some(error => error)) {
      return;
    }
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'logo' && value instanceof File) {
          formDataToSend.append('logo', value);
        } else if (value !== null && value !== undefined) {
          formDataToSend.append(key, value as string);
        }
      });

      let updatedCompany: Company;
      if (editingId) {
        const response = await axios.put(`/company/${editingId}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        updatedCompany = response.data;
        setCompanies(prevCompanies =>
          sortCompanies(prevCompanies.map(company =>
            company.id === editingId ? updatedCompany : company
          ))
        );
      } else {
        const response = await axios.post('/company', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        updatedCompany = response.data;
        setCompanies(prevCompanies => sortCompanies([...prevCompanies, updatedCompany]));
      }

      resetForm();
      setDialogOpen(false);
      setModalOpen(false);
      setSnackbarMessage(editingId ? 'Company updated successfully!' : 'Company added successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSnackbarMessage('Failed to submit form. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (company: Company) => {
    setFormData({
      name: company.name,
      address1: company.address1,
      address2: company.address2,
      city: company.city,
      state: company.state,
      zipCode: company.zipCode,
      logo: null,
    });
    setCities(indianCitiesData[company.state] || []);
    setLogoPreview(company.logo ? `data:image/png;base64,${Buffer.from(company.logo.data).toString('base64')}` : null);
    setEditingId(company.id);
    resetErrors();
    setTabValue(0);
    setDialogOpen(true);
  };

  const handleOpenModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    resetForm();
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    resetForm();
  };

  const tableRowStyle = {
    height: '60px',
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipCode: '',
      logo: null,
    });
    setLogoPreview(null);
    setEditingId(null);
    resetErrors();
    setCities([]);
  };

  const resetErrors = () => {
    setErrors({});
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredCompanies = useMemo(() => {
    if (searchTerm.trim() === '') {
      return companies;
    }
    return companies.filter(company =>
      Object.values(company).some(value =>
        value && typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [companies, searchTerm]);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" component="h2" sx={{color:'#13505b', fontWeight:'bold', marginRight: 2}}>
            Company List
          </Typography>
          <TextField
            size="small"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{
              width: '200px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#bdbdbd',
                },
                '&:hover fieldset': {
                  borderColor: '#757575',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#13505b',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <button className="button-3" role="button" onClick={handleOpenModal}>
          Add Company
        </button>
      </Box>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog open={modalOpen} onClose={handleCloseModal}
        PaperProps={{
          style: {
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }
        }}
      >
        <AppBar sx={{ position: 'relative', backgroundColor: '#13505b' }}>
          <Toolbar>
            <Typography variant="h6" component="div">
              Add Company
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {logoPreview && (
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="center" mb={4}>
                    <Avatar src={logoPreview} alt="logo preview" sx={{ width: 100, height: 100 }} />
                  </Box>
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  label="Name"
                  variant="outlined"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  fullWidth
                  required
                  size='small'
                  InputProps={{
                    style: {
                      backgroundColor: '#ffffff',
                    },
                  }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Address 1"
                    variant="outlined"
                    name="address1"
                    value={formData.address1}
                    onChange={handleChange}
                    error={!!errors.address1}
                    helperText={errors.address1}
                    fullWidth
                    required
                    size='small'
                    InputProps={{
                      style: {
                        backgroundColor: '#ffffff',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Address 2 (Optional)"
                    variant="outlined"
                    name="address2"
                    value={formData.address2}
                    onChange={handleChange}
                    error={!!errors.address2}
                    helperText={errors.address2}
                    fullWidth
                    size='small'
                    InputProps={{
                      style: {
                        backgroundColor: '#ffffff',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Autocomplete
                    id="state-select"
                    options={INDIAN_STATES}
                    value={formData.state}
                    onChange={handleStateChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="State"
                        variant="outlined"
                        fullWidth
                        required
                        error={!!errors.state}
                        helperText={errors.state}
                        size='small'
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Autocomplete
                    id="city-select"
                    options={cities}
                    value={formData.city}
                    onChange={handleCityChange}
                    disabled={!formData.state}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="City"
                        variant="outlined"
                        fullWidth
                        required
                        error={!!errors.city}
                        helperText={errors.city}
                        size='small'
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="ZIP Code"
                    variant="outlined"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    error={!!errors.zipCode}
                    helperText={errors.zipCode}
                    fullWidth
                    required
                    size='small'
                    InputProps={{
                      style: {
                        backgroundColor: '#ffffff',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                    sx={{ textTransform: 'none' }}
                  >
                    {formData.logo ? 'Change Logo' : 'Upload Logo'}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleFileChange}
                    />
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <button className="button-4" onClick={handleCloseModal}>
              Cancel
            </button>
            <button 
              className="button-3" 
              onClick={handleSubmit}
              disabled={loading || Object.values(errors).some(error => error !== '')}
            >
              Save
            </button>
          </DialogActions>
        </Dialog>
  
        <TableContainer component={Paper} sx={{ maxHeight: '372px', overflow: 'auto' }}>
          <Table stickyHeader aria-label="company table">
            <TableHead>
              <TableRow>
                {['Company Name', 'Address 1', 'Address 2', 'City', 'State', 'ZIP Code', 'Actions'].map((header, index) => (
                  <TableCell
                    key={index}
                    align={header === 'Actions' ? 'center' : 'left'}
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: '#0c7489',
                      color: '#ffffff',
                      whiteSpace: 'nowrap',
                      ...(header === 'Actions' && { width: 100, padding: 0 }),
                      ...(header === 'Company Name' && { width: '20%' }),
                      ...(header === 'City' && { width: '12%' }),
                      ...(header === 'State' && { width: '10%' }),
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCompanies.map((company) => (
                <TableRow key={company.id} hover
                sx={{
                  ...tableRowStyle,
                  '&:hover': {
                    backgroundColor: '#f0f7ff',
                    '& .MuiTableCell-root': {
                      color: '#1976d2',
                    },
                  },
                }}>
                  <TableCell sx={{ wordBreak: 'break-word', width: '20%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {company.logo && (
                        <Avatar
                          src={`data:image/png;base64,${Buffer.from(company.logo.data).toString('base64')}`}
                          alt={company.name}
                          sx={{ width: 30, height: 30, marginRight: 1 }}
                        />
                      )}
                      <Typography>{company.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ wordBreak: 'break-word' }}>{company.address1}</TableCell>
                  <TableCell sx={{ wordBreak: 'break-word' }}>{company.address2}</TableCell>
                  <TableCell sx={{ wordBreak: 'break-word', width: '12%' }}>{company.city}</TableCell>
                  <TableCell sx={{ wordBreak: 'break-word', width: '10%' }}>{company.state}</TableCell>
                  <TableCell sx={{ wordBreak: 'break-word' }}>{company.zipCode}</TableCell>
                  <TableCell align="center" sx={{ width: 100, padding: 0 }}>
                    <IconButton onClick={() => handleEdit(company)} color="primary" size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(company.id)} color="error" size="small">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
  
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          TransitionComponent={Transition}
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: '0px',
              maxWidth: 'none',
              width: '70%',
              height: '100%',
              marginRight:'0'
            },
          }}
          PaperProps={{
            style: {
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }
          }}
        >
          <AppBar sx={{ position: 'relative', backgroundColor: '#13505b' }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleCloseDialog}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Edit Company
              </Typography>
              <button autoFocus color="inherit" onClick={handleSubmit}>
                Update
              </button>
            </Toolbar>
          </AppBar>
          <DialogContent>
          <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Company Details" />
              <Tab label="Contacts" />
            </Tabs>
            {tabValue === 0 && (
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              {logoPreview && (
                    <Box mt={2} display="flex" justifyContent="center" mb={4}>
                      <Avatar src={logoPreview} alt="logo preview" sx={{ width: 100, height: 100 }} />
                    </Box>
                  )}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Name"
                    variant="outlined"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    fullWidth
                    required
                    size='small'
                    InputProps={{
                      style: {
                        backgroundColor: '#ffffff',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Address 1"
                    variant="outlined"
                    name="address1"
                    value={formData.address1}
                    onChange={handleChange}
                    error={!!errors.address1}
                    helperText={errors.address1}
                    fullWidth
                    required
                    size='small'
                    InputProps={{
                      style: {
                        backgroundColor: '#ffffff',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Address 2 (Optional)"
                    variant="outlined"
                    name="address2"
                    value={formData.address2}
                    onChange={handleChange}
                    error={!!errors.address2}
                    helperText={errors.address2}
                    fullWidth
                    size='small'
                    InputProps={{
                      style: {
                        backgroundColor: '#ffffff',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    id="state-select"
                    options={INDIAN_STATES}
                    value={formData.state}
                    onChange={handleStateChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="State"
                        variant="outlined"
                        fullWidth
                        required
                        error={!!errors.state}
                        helperText={errors.state}
                        size='small'
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    id="city-select"
                    options={cities}
                    value={formData.city}
                    onChange={handleCityChange}
                    disabled={!formData.state}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="City"
                        variant="outlined"
                        fullWidth
                        required
                        error={!!errors.city}
                        helperText={errors.city}
                        size='small'
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="ZIP Code"
                    variant="outlined"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    error={!!errors.zipCode}
                    helperText={errors.zipCode}
                    fullWidth
                    required
                    size='small'
                    InputProps={{
                      style: {
                        backgroundColor: '#ffffff',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    sx={{ textTransform: 'none' }}
                  >
                    {formData.logo ? 'Change Logo' : 'Upload Logo'}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleFileChange}
                    />
                  </Button>
                </Grid>
              </Grid>
            </Box>
            )}
            {tabValue === 1 && editingId && (
              <CompanyContacts key={editingId} companyId={editingId} />
            )}
          </DialogContent>
        </Dialog>
      </Box>
    );
  }