import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Typography, Grid, Dialog, DialogActions,
  DialogContent, Snackbar, Alert, CircularProgress,
  AppBar, Toolbar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  companyId: number;
}

interface CompanyContactsProps {
  companyId: number;
}

const CompanyContacts: React.FC<CompanyContactsProps> = ({ companyId }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchContacts();
  }, [companyId]);

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `http://localhost:3000/contacts/company/${companyId}`;
      console.log(`Fetching contacts from: ${url}`);
      
      const response = await axios.get(url);
      console.log('Raw response:', response);
      
      if (Array.isArray(response.data)) {
        console.log('Data is an array with length:', response.data.length);
        setContacts(response.data);
      } else {
        console.log('Unexpected data format:', response.data);
        setContacts([]);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Error response:', error.response);
          setError(`Failed to fetch contacts: ${error.response.status} ${error.response.statusText}`);
        } else if (error.request) {
          setError('Failed to fetch contacts: No response received');
        } else {
          setError(`Failed to fetch contacts: ${error.message}`);
        }
      } else {
        setError('Failed to fetch contacts: Unknown error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (contact: Contact | null = null) => {
    setCurrentContact(contact);
    setFormData(contact || { name: '', email: '', phone: '', role: '' });
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentContact(null);
    setFormData({ name: '', email: '', phone: '', role: '' });
    setFormErrors({});
  };

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
      case 'role':
        return /^[A-Za-z\s]*$/.test(value) ? '' : `${name} should contain only characters and spaces`;
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Please enter a valid email address';
      case 'phone':
        return /^\d{0,10}$/.test(value) ? '' : 'Phone number should be exactly 10 digits';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    const error = validateField(name, value);
    setFormErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};
    let isValid = true;

    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) {
        errors[key] = error;
        isValid = false;
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSnackbar({ open: true, message: 'Please correct the form errors', severity: 'error' });
      return;
    }

    try {
      if (currentContact) {
        // Update existing contact
        const url = `http://localhost:3000/contacts/${currentContact.id}`;
        await axios.put(url, { ...formData, companyId });
        setSnackbar({ open: true, message: 'Contact updated successfully', severity: 'success' });
      } else {
        // Add new contact
        const url = `http://localhost:3000/contacts/${companyId}`;
        await axios.post(url, formData);
        setSnackbar({ open: true, message: 'Contact added successfully', severity: 'success' });
      }
      fetchContacts();
      handleCloseDialog();
    } catch (error) {
      console.error('Error submitting contact:', error);
      setSnackbar({ open: true, message: 'Failed to submit contact', severity: 'error' });
    }
  };

  const handleDelete = async (contactId: number) => {
    try {
      const url = `http://localhost:3000/contacts/${contactId}`;
      await axios.delete(url);
      fetchContacts();
      setSnackbar({ open: true, message: 'Contact deleted successfully', severity: 'success' });
    } catch (error) {
      console.error('Error deleting contact:', error);
      setSnackbar({ open: true, message: 'Failed to delete contact', severity: 'error' });
    }
  };

  const tableRowStyle = {
    height: '60px',
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography></Typography>
        <button className="button-3" role="button" onClick={() => handleOpenDialog()}>
          Add Contact
        </button>
      </Box>

      {contacts.length === 0 ? (
        <Typography>No contacts found for this company.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {['Name', 'Email', 'Phone', 'Role', 'Actions'].map((header, index) => (
                  <TableCell
                    key={index}
                    align={header === 'Actions' ? 'center' : 'left'}
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: '#0c7489',
                      color: '#ffffff',
                      whiteSpace: 'nowrap',
                      ...(header === 'Actions' && { width: 100, padding: 0 }),
                      ...(header === 'Name' && { width: '25%' }),
                      ...(header === 'Email' && { width: '25%' }),
                      ...(header === 'Phone' && { width: '20%' }),
                      ...(header === 'Role' && { width: '15%' }),
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id} hover
                  sx={{
                    ...tableRowStyle,
                    '&:hover': {
                      backgroundColor: '#f0f7ff',
                      '& .MuiTableCell-root': {
                        color: '#1976d2',
                      },
                    },
                  }}>
                  <TableCell>{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>{contact.role}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(contact)} color="primary" size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(contact.id)} color="error" size="small">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} 
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
            {currentContact ? 'Edit Contact' : 'Add Contact'}
          </Toolbar>
        </AppBar>

        <DialogContent>
          <Grid container spacing={2}>
            {['name', 'email', 'phone', 'role'].map((field) => (
              <Grid item xs={12} key={field}>
                <TextField
                  fullWidth
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                  value={formData[field as keyof typeof formData]}
                  onChange={handleChange}
                  size='small'
                  error={!!formErrors[field]}
                  helperText={formErrors[field]}
                  InputProps={{
                    style: {
                      backgroundColor: '#ffffff',
                    },
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <button className="button-4" role="button" onClick={handleCloseDialog}>Cancel</button>
          <button className="button-3" role="button" onClick={handleSubmit}>
            {currentContact ? 'Update' : 'Add'}
          </button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CompanyContacts;