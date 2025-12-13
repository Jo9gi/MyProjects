import { useState } from 'react';

const AddStudent = ({ onAddStudent }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [marks, setMarks] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Name is required');
      return;
    }
    
    if (!email.trim()) {
      alert('Email is required');
      return;
    }
    
    const marksNum = Number(marks);
    if (isNaN(marksNum) || marksNum < 0 || marksNum > 100) {
      alert('Marks must be between 0 and 100');
      return;
    }
    
    onAddStudent({ name, email, marks: marksNum });
    setName('');
    setEmail('');
    setMarks('');
  };

  return (
    <div className="add-student">
      <h2>Add Student</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="number"
          placeholder="Marks (0-100)"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
        />
        <button type="submit">Add Student</button>
      </form>
    </div>
  );
};

export default AddStudent;
