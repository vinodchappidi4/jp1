'use client';
 
import { useState, useEffect, useRef } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, Box, TextField, Select, MenuItem, FormControl, InputLabel, Button, IconButton, Typography, Grid, Container, FormHelperText, Avatar, InputAdornment, Dialog, DialogActions, DialogContent, DialogTitle, AppBar, Toolbar } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SearchIcon from '@mui/icons-material/Search';
import { Snackbar, Alert } from '@mui/material';
import EditStudentModal from './EditStudentModal';
 
interface Student {
  id: number;
  name: string;
  rollno: string;
  email: string;
  mobilenumber: string;
  category: string;
  photo: { data: Buffer } | null;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  permanentAddress?: string;
  currentAddress?: string;
  educationDetails?: string;
  degree?: string;
  departname?: string;
  projectName?: string;
  description?: string;
  technicalSkills?: string;
}
 
const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 0,
  maxHeight: '90vh',
  overflow: 'auto',
};
 
 
const textFieldStyle = {
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
  '& .MuiOutlinedInput-input': {
    backgroundColor: '#ffffff',
  },
};
 
const tableContainerStyle = {
  maxHeight: '400px',
  overflow: 'hidden',
};
 
const tableRowStyle = {
  height: '60px', // Set your desired height
};
 
const inputHeightStyle = {
  height: '50px',
};
 
export default function Student() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Omit<Student, 'id'>>({
    name: '',
    rollno: '',
    email: '',
    mobilenumber: '',
    category: '',
    photo: null,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [editModalOpen, setEditModalOpen] = useState(false);
const [editFormData, setEditFormData] = useState<Omit<Student, 'id'>>({
  name: '',
  rollno: '',
  email: '',
  mobilenumber: '',
  category: '',
  photo: null,
  dateOfBirth: '',
  gender: '',
  address: '',
  permanentAddress: '',
  currentAddress: '',
  educationDetails: '',
  degree: '',
  departname: '',
  projectName: '',
  description: '',
  technicalSkills: '',
});
 
  useEffect(() => {
    fetchStudents();
  }, []);
 
  const resetEditForm = () => {
    setEditingId(null);
    setEditFormData({
      name: '',
      rollno: '',
      email: '',
      mobilenumber: '',
      category: '',
      photo: null,
      dateOfBirth: '',
      gender: '',
      address: '',
      permanentAddress: '',
      currentAddress: '',
      educationDetails: '',
      degree: '',
      departname: '',
      projectName: '',
      description: '',
      technicalSkills: '',
    });
  };
 
  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:3000/students');
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      const data = await response.json();
      const sortedData = data.sort((a: { rollno: number; }, b: { rollno: number; }) => (a.rollno > b.rollno ? 1 : -1));
      setStudents(sortedData);
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to fetch students. Please try again.');
    }
  };
 
  const validateField = (name: string, value: string) => {
    let error = '';
 
    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = "Name is required";
        } else if (!/^[A-Za-z\s]+$/.test(value)) {
          error = "Name should contain only characters and spaces";
        }
        break;
      case 'rollno':
        if (!value.trim()) {
          error = "Roll No should not be empty";
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Email is invalid";
        }
        break;
      case 'mobilenumber':
        if (!value.trim()) {
          error = "Mobile Number is required";
        } else if (!/^\d{10}$/.test(value)) {
          error = "Mobile Number must be 10 digits";
        }
        break;
      case 'category':
        if (!value.trim()) {
          error = "Category should not be empty";
        }
        break;
    }
 
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));
  };
 
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollno.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.mobilenumber.includes(searchTerm) ||
    student.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
 
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
 
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    Object.entries(editFormData).forEach(([name, value]) => {
      const error = validateField(name, value as string);
      if (error) {
        newErrors[name] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name as string]: value as string }));
    validateField(name as string, value as string);
  };
 
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prevData) => ({...prevData,photo: file,}));
    }
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
      ? `http://localhost:3000/students/${editingId}`
      : 'http://localhost:3000/students';
 
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'photo') {
        // Only append photo if it's a File object (new photo uploaded)
        if (value instanceof File) {
          formDataToSend.append('photo', value);
        }
        // If editing and photo hasn't changed, don't append anything
        else if (!editingId) {
          formDataToSend.append('photo', ''); // For new students, send empty string if no photo
        }
        // For editing, if photo is not changed, don't append it at all
      } else {
        formDataToSend.append(key, value as string);
      }
    });
 
    try {
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        body: formDataToSend,
      });
 
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
 
      fetchStudents();
 
      setFormData({
        name: '',
        rollno: '',
        email: '',
        mobilenumber: '',
        category: '',
        photo: null,
      });
      setEditingId(null);
      resetErrors();
      setModalOpen(false);
      setSnackbarMessage(editingId ? 'Student updated successfully!' : 'Student added successfully!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  } catch (error) {
    console.error('Error submitting form:', error);
    setSnackbarMessage('Failed to submit form. Please try again.');
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
    }
  };
 
  const handleEdit = (student: Student) => {
    setEditFormData({
      ...student,
      dateOfBirth: student.dateOfBirth || '',
      gender: student.gender || '',
      address: student.address || '',
      permanentAddress: student.permanentAddress || '',
      currentAddress: student.currentAddress || '',
      educationDetails: student.educationDetails || '',
      degree: student.degree || '',
      departname: student.departname || '',
      projectName: student.projectName || '',
      description: student.description || '',
      technicalSkills: student.technicalSkills || '',
    });
    setEditingId(student.id);
    setEditModalOpen(true);
  };
 
  const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'photo') {
        // Only append photo if it's a File object (new photo uploaded)
        if (value instanceof File) {
          formDataToSend.append('photo', value);
        }
        // If editing and photo hasn't changed, don't append anything
        else if (!editingId) {
          formDataToSend.append('photo', ''); // For new students, send empty string if no photo
        }
        // For editing, if photo is not changed, don't append it at all
      } else {
        formDataToSend.append(key, value as string);
      }
    });
 
    const handleEditSubmit = async () => {
      if (!validateForm()) {
        return;
      }
   
      const url = `http://localhost:3000/students/${editingId}`;
   
      const formData = new FormData();
      Object.entries(editFormData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          if (key === 'photo') {
            if (value instanceof File) {
              formData.append('photo', value);
            } else if (value === null) {
              // If photo is null, it means the user wants to delete the photo
              formData.append('photo', 'delete');
            }
            // If photo hasn't changed, don't append anything
          } else {
            formData.append(key, value as string);
          }
        }
      });
   
      try {
        const response = await fetch(url, {
          method: 'PUT',
          body: formData,
        });
   
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Server error response:', errorData);
          throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
        }
   
        const updatedStudent = await response.json();
        console.log("Updated student data:", updatedStudent);
   
        await fetchStudents();
        setEditModalOpen(false);
        setEditingId(null);
        setEditFormData({/* Reset to initial state */});
        setSnackbarMessage('Student updated successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error updating student:', error);
        setSnackbarMessage(`Failed to update student: ${error.message}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    };
   
 
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/students/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchStudents();
      setSnackbarMessage('Student deleted successfully!');
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
      name: '',
      rollno: '',
      email: '',
      mobilenumber: '',
      category: '',
      photo: '',
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
        <Typography variant="h6" component="h2" sx={{color:'#13505b', fontWeight:'bold',marginRight:2}}>
          Student List
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
        <button class="button-3" role="button" onClick={handleOpenModal}>
          Add Student
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
  <Table stickyHeader aria-label="student table">
    <TableHead>
    <TableRow>
    {['Student Name', 'Roll No', 'Email', 'Mobile Number', 'Category', 'Actions'].map((header, index) => (
      <TableCell
        key={index}
        align={header === 'Actions' ? 'center' : 'left'}
        sx={{
          fontWeight: 'bold',
          backgroundColor: '#0c7489',
          color: '#ffffff',
          whiteSpace: 'nowrap',
          ...(header === 'Actions' && { width: 100, padding: 0 }),
          ...(header === 'Student Name' && { width: 200 }),
        }}
      >
        {header}
      </TableCell>
    ))}
  </TableRow>
    </TableHead>
    <TableBody>
  {filteredStudents.map((student) => (
    <TableRow key={student.id}
      hover
      sx={{
        ...tableRowStyle,
        '&:hover': {
          backgroundColor: '#f0f7ff',
          '& .MuiTableCell-root': {
            color: '#1976d2',
          },
        },
      }}
    >
      <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {student.photo ? (
            <Avatar
              src={`data:image/png;base64,${Buffer.from(student.photo.data).toString('base64')}`}
              alt={student.name}
              sx={{ width: 32, height: 32, marginRight: 2 }}
            />
          ) : (
            <Avatar sx={{ width: 32, height: 32, marginRight: 2 }}>{student.name.charAt(0)}</Avatar>
          )}
          {student.name}
        </Box>
      </TableCell>
      <TableCell sx={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{student.rollno}</TableCell>
      <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{student.email}</TableCell>
      <TableCell sx={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{student.mobilenumber}</TableCell>
      <TableCell sx={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{student.category}</TableCell>
      <TableCell align="center" sx={{ width: 100, padding: 0 }}>
        <IconButton onClick={() => handleEdit(student)} color="primary" size="small">
          <Edit fontSize="small" />
        </IconButton>
        <IconButton onClick={() => handleDelete(student.id)} color="error" size="small">
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
  onClose={() => setModalOpen(false)}
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
        Add Student
      </Typography>
    </Toolbar>
  </AppBar>
  <DialogContent sx={{ p: 4, pt: 2 }}>
    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" mb={2}>
      <Avatar
        src={formData.photo instanceof File
          ? URL.createObjectURL(formData.photo)
          : formData.photo && formData.photo.data
            ? `data:image/png;base64,${Buffer.from(formData.photo.data).toString('base64')}`
            : undefined
        }
        alt="Student Photo"
        sx={{ width: 70, height: 70, mb: 2 }}
      >
        {!formData.photo && formData.name.charAt(0)}
      </Avatar>
      <Button
        variant="outlined"
        component="label"
        startIcon={<CloudUploadIcon />}
        sx={{
          textTransform: 'none',
          marginBottom: 2,
          color: '#13505b',
          '&:hover': {
            backgroundColor: '#e3f2fd',
          }
        }}
      >
        {editingId ? 'Change Photo' : 'Upload Photo'}
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleFileChange}
        />
      </Button>
    </Box>
 
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          margin="normal"
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
          sx={textFieldStyle}
          size="small"
          required
          InputProps={{
            style: {
              backgroundColor: '#ffffff',
            },
          }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Roll No"
          name="rollno"
          value={formData.rollno}
          onChange={handleChange}
          error={!!errors.rollno}
          helperText={errors.rollno}
          sx={textFieldStyle}
          size="small"
          required
          InputProps={{
            style: {
              backgroundColor: '#ffffff',
            },
          }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          sx={textFieldStyle}
          size="small"
          required
          InputProps={{
            style: {
              backgroundColor: '#ffffff',
            },
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          margin="normal"
          label="Mobile Number"
          name="mobilenumber"
          value={formData.mobilenumber}
          onChange={handleChange}
          error={!!errors.mobilenumber}
          helperText={errors.mobilenumber}
          sx={textFieldStyle}
          size="small"
          required
          InputProps={{
            style: {
              backgroundColor: '#ffffff',
            },
          }}
        />
        <FormControl fullWidth margin="normal" error={!!errors.category} sx={textFieldStyle} size="small" required>
          <InputLabel>Category</InputLabel>
          <Select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            size="small"
            InputProps={{
              style: {
                backgroundColor: '#ffffff',
              },
            }}
          >
            <MenuItem value="General">General</MenuItem>
            <MenuItem value="OBC">OBC</MenuItem>
            <MenuItem value="SC">SC</MenuItem>
            <MenuItem value="ST">ST</MenuItem>
          </Select>
          {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
        </FormControl>
      </Grid>
    </Grid>
  </DialogContent>
  <DialogActions sx={{ p: 3 }}>
    <button className="button-4" onClick={() => setModalOpen(false)}>
      Cancel
    </button>
    <button
      className="button-3"
      type="submit"
      variant="contained"
      color="primary"
      onClick={handleSubmit}
    >
      {editingId ? 'Update' : 'Save'}
    </button>
  </DialogActions>
</Dialog>
<EditStudentModal
  open={editModalOpen}
  onClose={() => {
    setEditModalOpen(false);
    resetEditForm(); // Call the new function here
  }}
  editFormData={editFormData}
  setEditFormData={setEditFormData}
  onSubmit={handleEditSubmit}
/>
 
      {error && <Typography color="error">{error}</Typography>}
      </Box>
  );
}