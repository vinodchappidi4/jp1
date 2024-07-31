'use client';

import { useState, useEffect, useRef } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, Box, TextField, Button, IconButton, Typography, Grid, Container, FormHelperText, InputAdornment, AppBar, Dialog, DialogActions, DialogContent, Toolbar } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import { Snackbar, Alert } from '@mui/material';

interface Department {
  id: number;
  departmentname: string;
  coursename: string;
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const tableContainerStyle = {
  maxHeight: '400px',
  overflow: 'hidden',
};

const inputHeightStyle = {
  height: '50px',
};

export default function Department() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Omit<Department, 'id'>>({
    departmentname: '',
    coursename: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetch('http://localhost:3000/departments');
      if (!response.ok) {
        throw new Error('Failed to fetch departments');
      }
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setError('Failed to fetch departments. Please try again.');
    }
  };

  const validateField = (name: string, value: string) => {
    let error = '';
  
    switch (name) {
      case 'departmentname':
        if (!value.trim()) {
          error = "Department name is required";
        }
        break;
      case 'coursename':
        if (!value.trim()) {
          error = "Course name is required";
        }
        break;
    }
  
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));
  };

  const filteredDepartments = departments.filter((department) =>
    Object.values(department).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const tableRowStyle = {
    height: '60px', // Set your desired height
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const validateForm = () => {
    Object.entries(formData).forEach(([name, value]) => {
      validateField(name, value as string);
    });
  
    return Object.values(errors).every(error => error === '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name as string]: value as string }));
    validateField(name as string, value as string);
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const url = editingId
      ? `http://localhost:3000/departments/${editingId}`
      : 'http://localhost:3000/departments';

    try {
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchDepartments();

      setFormData({
        departmentname: '',
        coursename: '',
      });
      setEditingId(null);
      resetErrors();
      setModalOpen(false);
      setSnackbarMessage(editingId ? 'Department updated successfully!' : 'Department added successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to submit form. Please try again.');
  
      setSnackbarMessage('Failed to submit form. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleEdit = (department: Department) => {
    setFormData({
      departmentname: department.departmentname,
      coursename: department.coursename,
    });
    setEditingId(department.id);
    resetErrors();
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/departments/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchDepartments();
      setSnackbarMessage('Department deleted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting student:', error);
      setError('Failed to delete student. Please try again.');
      
      // Show error snackbar
      setSnackbarMessage('Failed to delete student. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleOpenModal = () => {
    setEditingId(null);
    setFormData({
      departmentname: '',
      coursename: '',
    });
    resetErrors();
    setModalOpen(true);
  };

  const resetErrors = () => {
    setErrors({});
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" component="h2" sx={{color:'#13505b', fontWeight:'bold', flexGrow: 1, minWidth: '200px'}}>
          Department List
        </Typography>
        <TextField
        size="small"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
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
          Add Department
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
      <TableContainer component={Paper} sx={{ maxHeight: '372px', overflow: 'auto' }}>
  <Table stickyHeader aria-label="department table">
    <TableHead>
      <TableRow>
        {['Department Name', 'Course Name', 'Actions'].map((header, index) => (
          <TableCell 
            key={index} 
            align={header === 'Actions' ? 'center' : 'left'}
            sx={{
              fontWeight: 'bold',
              backgroundColor: '#0c7489',
              color: '#ffffff',
              whiteSpace: 'nowrap',
              ...(header === 'Actions' && { width: 100, padding: 0 }),
              ...(header === 'Department Name' && { width: 250 }),
              ...(header === 'Course Name' && { width: 300 }),
            }}
          >
            {header}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
    <TableBody>
    {filteredDepartments.map((department) => (
        <TableRow 
          key={department.id} 
          hover
          sx={{
            ...tableRowStyle,
            '&:hover': {
              backgroundColor: '#f0f7ff', // Light blue background on hover
              '& .MuiTableCell-root': {
                color: '#1976d2', // Blue text color on hover
              },
            },
          }}
        >
          <TableCell sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {department.departmentname}
          </TableCell>
          <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {department.coursename}
          </TableCell>
          <TableCell align="center" sx={{ width: 100, padding: 0 }}>
            <IconButton onClick={() => handleEdit(department)} color="primary" size="small">
              <Edit fontSize="small" />
            </IconButton>
            <IconButton onClick={() => handleDelete(department.id)} color="error" size="small">
              <Delete fontSize="small" />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>

<Dialog 
  open={modalOpen} 
  onClose={() => {
    setModalOpen(false);
    resetErrors();
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
      <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
        {editingId ? 'Edit Department' : 'Add Department'}
      </Typography>
    </Toolbar>
  </AppBar>
  <DialogContent sx={{ padding: '24px' }}>
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        label="Department Name"
        name="departmentname"
        value={formData.departmentname}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
        error={!!errors.departmentname}
        helperText={errors.departmentname}
        InputProps={{
          style: {
            ...inputHeightStyle,
            backgroundColor: '#ffffff',
          },
        }}
        sx={{
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
          '& .MuiInputLabel-root': {
            color: '#424242',
          },
        }}
      />
      <TextField
        label="Course Name"
        name="coursename"
        value={formData.coursename}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
        error={!!errors.coursename}
        helperText={errors.coursename}
        InputProps={{
          style: {
            ...inputHeightStyle,
            backgroundColor: '#ffffff',
          },
        }}
        sx={{
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
          '& .MuiInputLabel-root': {
            color: '#424242',
          },
        }}
      />
    </Box>
  </DialogContent>
  <DialogActions sx={{ padding: '16px 24px' }}>
    <button  class="button-4" role='button'
      onClick={() => setModalOpen(false)}      
    >
      Cancel
    </button>
    <button 
    class="button-3" role='button'
      type="submit" 
      variant="contained" 
      color="primary"
      onClick={handleSubmit}
      
    >
      {editingId ? 'Update' : 'Save'}
    </button>
  </DialogActions>
</Dialog>

      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
}