import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', location: '', email: '', dob: '', education: '' });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:4000/students');
      setStudents(response.data);
    } catch (error) {
      console.error("There was an error fetching the students!", error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setShowForm(true);
    setFormData({ id: '', name: '', location: '', email: '', dob: '', education: '' });
  };

  const handleEdit = (student) => {
    setShowForm(true);
    setFormData(student);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`http://localhost:4000/students/${id}`);
        fetchStudents();
      } catch (error) {
        console.error("There was an error deleting the student!", error);
      }
    }
  };

  const getNextId = () => {
    const ids = students.map(student => parseInt(student.id, 10));
    return ids.length > 0 ? Math.max(...ids) + 1 : 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        // Update existing student
        await axios.put(`http://localhost:4000/students/${formData.id}`, formData);
      } else {
        // Create new student with a ID
        const newStudent = { ...formData, id: getNextId().toString() };
        await axios.post('http://localhost:4000/students', newStudent);
      }
      setShowForm(false);
      fetchStudents();
    } catch (error) {
      console.error("There was an error submitting the form!", error);
    }
  };

  return (
    <div className="App">
      <h2>Student Management System...</h2>
      <div className="header">
        <input
          type="text"
          placeholder="Search by Name or Education"
          value={searchTerm}
          onChange={handleSearch}
        />
       
        <button onClick={handleAdd} className="add-button">Add</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Location</th>
            <th>Email</th>
            <th>Date of Birth</th>
            <th>Education</th>
            <th>Actions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students
            .filter(student => 
              student.name.toLowerCase().includes(searchTerm) || 
              student.education.toLowerCase().includes(searchTerm))
            .map((student, index) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.location}</td>
                <td>{student.email}</td>
                <td>{student.dob}</td>
                <td>{student.education}</td>
                <td>
                  
                  <button className="edit-button" onClick={() => handleEdit(student)}>
                    <FontAwesomeIcon icon={faEdit} />Edit
                  </button>
                  </td>
                  <td>
                  <button className="delete-button" onClick={() => handleDelete(student.id)}>
                    <FontAwesomeIcon icon={faTrashAlt} />Delete
                  </button>
                  </td>
            
                
              </tr>
            ))}
        </tbody>
      </table>

      {showForm && (
        <div className="form-popup">
          <form onSubmit={handleSubmit}>
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            <label>Location:</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} required />
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            <label>Date of Birth:</label>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
            <label>Education:</label>
            <input type="text" name="education" value={formData.education} onChange={handleChange} required />
            <button type="submit">Submit</button>
            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
