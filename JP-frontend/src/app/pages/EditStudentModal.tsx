// EditStudentModal.tsx
import React, { useState } from 'react';
import { Modal, Box, Typography, Tabs, Tab, Grid, TextField, Button, Avatar, FormControl, InputLabel, MenuItem, Select, FormControlLabel, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, AppBar, Toolbar } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
 
interface EditStudentModalProps {
  open: boolean;
  onClose: () => void;
  editFormData: any;
  setEditFormData: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: () => void;
}
 
const EditStudentHeader: React.FC = () => {
  return (
    <Box sx={{
      backgroundColor: '#13505b',
      color: '#ffff',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '10px',
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px',
      marginBottom: '20px'
    }}>
      <Typography variant="h6" component="div">
        Edit Student
      </Typography>
    </Box>
  );
};
 
const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70%',
  height: '100%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 0,
  maxHeight: '90vh',
  overflow: 'auto',
};
 
const degreesToDepartments: { [key: string]: string[] } = {
  BSc: ['Computer Science', 'Physics', 'Mathematics', 'Biology', 'Chemistry', 'Environmental Science', 'Statistics'],
  BTech: ['Computer Science', 'Electronics and Communication Engineering', 'Electrical and Electronics Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering', 'Aeronautical Engineering', 'Biotechnology', 'Information Technology'],
  MSc: ['Physics', 'Mathematics', 'Chemistry', 'Biology', 'Environmental Science', 'Statistics', 'Geology'],
  MTech: ['Computer Science', 'Electrical Engineering', 'Civil Engineering', 'Mechanical Engineering', 'Chemical Engineering', 'Biotechnology', 'Structural Engineering', 'Electronics and Communication Engineering', 'Information Technology'],
};
 
 
const EditStudentModal: React.FC<EditStudentModalProps> = ({ open, onClose, editFormData, setEditFormData, onSubmit }) => {
  const [activeTab, setActiveTab] = useState('about');
  const [sameAsPermanent, setSameAsPermanent] = useState(false);
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setEditFormData((prevData: any) => ({ ...prevData, [name as string]: value as string }));
  };
 
  const handleDegreeChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setEditFormData((prevData: any) => ({
      ...prevData,
      [name as string]: value as string,
      departname: '', // Reset department name when degree changes
    }));
  };
 
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditFormData((prevData: any) => ({ ...prevData, photo: file }));
    }
  };
 
  const handleDeletePhoto = () => {
    setEditFormData((prevData: any) => ({ ...prevData, photo: null }));
  };
 
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSameAsPermanent(e.target.checked);
    if (e.target.checked) {
      setEditFormData((prevData: any) => ({ ...prevData, currentAddress: prevData.permanentAddress }));
    }
  };
 
  const departmentOptions = degreesToDepartments[editFormData.degree] || [];
 
  return (
    <Dialog
  open={open}
  onClose={onClose}
  fullWidth
  maxWidth="md"
  sx={{
    '& .MuiDialog-paper': {
      borderRadius: '0px', // Remove rounded corners
      maxWidth: 'none', // Allow the dialog to expand to its content
      width: '70%', // Set a specific width (adjust as needed)
      height: '100%', // Set a specific height (adjust as needed)
      marginRight:'0'
      // backgroundColor: 'your-color-here',  e.g., '#f0f0f0' or 'lightblue'
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
      <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
        Edit Student
      </Typography>
    </Toolbar>
  </AppBar>
  <DialogContent sx={{ p: 4, pt: 2 }}>
    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" mb={2}>
      <Avatar
        src={editFormData.photo instanceof File
          ? URL.createObjectURL(editFormData.photo)
          : editFormData.photo && editFormData.photo.data
            ? `data:image/png;base64,${Buffer.from(editFormData.photo.data).toString('base64')}`
            : undefined
        }
        alt="Student Photo"
        sx={{ width: 100, height: 100, mb: 2 }}
      >
        {!editFormData.photo && editFormData.name?.charAt(0)}
      </Avatar>
      <Box>
        <Button
          variant="outlined"
          component="label"
          startIcon={<CloudUploadIcon />}
          sx={{ mr: 1, textTransform: 'none'}}
        >
          Change Photo
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleFileChange}
          />
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDeletePhoto}
          disabled={!editFormData.photo}
          sx={{ textTransform: 'none' }}
        >
          Delete Photo
        </Button>
      </Box>
    </Box>
 
    <Tabs
      value={activeTab}
      onChange={(e, newValue) => setActiveTab(newValue)}
      sx={{ mb: 3 }}
    >
      <Tab label="About" value="about" />
      <Tab label="Academic Details" value="academic" />
      <Tab label="Profile" value="profile" />
      <Tab label="Resumes & Documents" value="documents" />
    </Tabs>
 
    {activeTab === 'about' && (
     <Grid container spacing={3}>
     <Grid item xs={12} sm={6}>
       <TextField fullWidth label="Name" name="name" value={editFormData.name} onChange={handleChange} size="small"
       InputProps={{
        style: {
          backgroundColor: '#ffffff',
        },
      }} />
     </Grid>
     <Grid item xs={12} sm={6}>
       <TextField fullWidth label="Roll No" name="rollno" value={editFormData.rollno} onChange={handleChange} size="small"
       InputProps={{
        style: {
          backgroundColor: '#ffffff',
        },
      }} />
     </Grid>
     <Grid item xs={12} sm={6}>
       <TextField fullWidth label="Email" name="email" value={editFormData.email} onChange={handleChange} size="small"
       InputProps={{
        style: {
          backgroundColor: '#ffffff',
        },
      }} />
     </Grid>
     <Grid item xs={12} sm={6}>
       <TextField fullWidth label="Mobile Number" name="mobilenumber" value={editFormData.mobilenumber} onChange={handleChange} size="small"
       InputProps={{
        style: {
          backgroundColor: '#ffffff',
        },
      }} />
     </Grid>
     <Grid item xs={12} sm={6}>
     <FormControl fullWidth size="small">
         <InputLabel shrink>Category</InputLabel>
         <Select
           label="Category"
           name="category"
           value={editFormData.category}
           onChange={handleChange}
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
       </FormControl>
     </Grid>
     <Grid item xs={12} sm={6}>
       <TextField fullWidth label="Date of Birth" name="dateOfBirth" type="date" value={editFormData.dateOfBirth} onChange={handleChange} InputLabelProps={{ shrink: true }} size="small" />
     </Grid>
     <Grid item xs={12} sm={6}>
     <FormControl fullWidth size="small">
         <InputLabel>Gender</InputLabel>
         <Select
           label="Gender"
           name="gender"
           value={editFormData.gender}
           onChange={handleChange}
         >
           <MenuItem value="Male">Male</MenuItem>
           <MenuItem value="Female">Female</MenuItem>
           <MenuItem value="Other">Other</MenuItem>
         </Select>
       </FormControl>
     </Grid>
     <Grid item xs={12}>
       <Typography variant="subtitle1" gutterBottom>Address</Typography>
       <Grid container spacing={1}>
         <Grid item xs={12} sm={12}>
           <TextField fullWidth label="Permanent Address" name="permanentAddress" value={editFormData.permanentAddress} onChange={handleChange} rows={2} size="small"
           InputProps={{
            style: {
              backgroundColor: '#ffffff',
            },
          }} />
         </Grid>
         <Grid item xs={12}>
           <FormControlLabel
             control={
               <Checkbox
                 checked={sameAsPermanent}
                 onChange={handleCheckboxChange}
                 color="primary"
                 size="small"
                 InputProps={{
                  style: {
                    backgroundColor: '#ffffff',
                  },
                }}
               />
             }
             label={
               <Typography variant="body2" color="textSecondary">
                 Same as Permanent Address
               </Typography>
             }
             sx={{
               alignItems: 'center',
               marginLeft: 0,  // Remove default left margin
               '& .MuiFormControlLabel-label': {
                 marginLeft: 1,  // Add some space between checkbox and text
               },
             }}
           />
         </Grid>
         <Grid item xs={12} sm={12}>
           <TextField fullWidth label="Current Address" name="currentAddress" value={editFormData.currentAddress} onChange={handleChange} rows={2} size="small"
           InputProps={{
            style: {
              backgroundColor: '#ffffff',
            },
          }} />
         </Grid>
       </Grid>
     </Grid>
   </Grid>
 )}
 
    {activeTab === 'academic' && (
      <Grid container spacing={3}>
      <Grid item xs={12}>
        <FormControl fullWidth size="small">
          <InputLabel>Degree</InputLabel>
          <Select
            label="Degree"
            name="degree"
            value={editFormData.degree}
            onChange={handleDegreeChange}
          >
            <MenuItem value="BSc">BSc</MenuItem>
            <MenuItem value="BTech">BTech</MenuItem>
            <MenuItem value="MSc">MSc</MenuItem>
            <MenuItem value="MTech">MTech</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth size="small">
          <InputLabel>Department Name</InputLabel>
          <Select
            label="Department Name"
            name="departname"
            value={editFormData.departname}
            onChange={handleChange}
          >
            {departmentOptions.map(department => (
              <MenuItem key={department} value={department}>{department}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
    )}
 
    {activeTab === 'profile' && (
      <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField fullWidth label="Project Name" name="projectName" value={editFormData.projectName} onChange={handleChange} size="small"
        InputProps={{
          style: {
            backgroundColor: '#ffffff',
          },
        }} />
      </Grid>
      <Grid item xs={12}>
        <TextField fullWidth label="Project Description" name="description" value={editFormData.description} onChange={handleChange} multiline rows={3} size="small"
        InputProps={{
          style: {
            backgroundColor: '#ffffff',
          },
        }} />
      </Grid>
      <Grid item xs={12}>
        <TextField fullWidth label="Technical Skills" name="technicalSkills" value={editFormData.technicalSkills} onChange={handleChange} multiline rows={3} size="small"
        InputProps={{
          style: {
            backgroundColor: '#ffffff',
          },
        }} />
      </Grid>
    </Grid>
    )}
 
    {activeTab === 'documents' && (
      <Typography>This section is currently empty.</Typography>
    )}
  </DialogContent>
  <DialogActions sx={{ p: 3 }}>
    <button className="button-4" onClick={onClose}>
      Cancel
    </button>
    <button className="button-3" onClick={onSubmit}>
      Update
    </button>
  </DialogActions>
</Dialog>
  );
};
 
export default EditStudentModal;