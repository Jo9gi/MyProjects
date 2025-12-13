import { useState } from 'react';
import AddStudent from './components/AddStudent';
import FilterBar from './components/FilterBar';
import StudentList from './components/StudentList';
import Summary from './components/Summary';
import { calculateGrade } from './utils/grade';

const initialStudents = [
  { id: 1, name: "Arun", email: "arun@mail.com", marks: 88 },
  { id: 2, name: "Meena", email: "meena@mail.com", marks: 95 },
  { id: 3, name: "Rahul", email: "rahul@mail.com", marks: 72 }
];

const App = () => {
  const [students, setStudents] = useState(initialStudents);
  const [searchText, setSearchText] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');

  const addStudent = (student) => {
    const newStudent = {
      ...student,
      id: Date.now()
    };
    setStudents([...students, newStudent]);
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesGrade = gradeFilter === 'All' || calculateGrade(student.marks) === gradeFilter;
    
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="app">
      <h1>Student Score Management App</h1>
      <AddStudent onAddStudent={addStudent} />
      <FilterBar
        searchText={searchText}
        onSearchChange={setSearchText}
        gradeFilter={gradeFilter}
        onGradeChange={setGradeFilter}
      />
      <StudentList students={filteredStudents} />
      <Summary students={filteredStudents} />
    </div>
  );
};

export default App;
