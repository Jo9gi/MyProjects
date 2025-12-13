import { calculateGrade } from '../utils/grade';

const StudentList = ({ students }) => {
  return (
    <div className="student-list">
      <h2>Student List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Marks</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {students.map(({ id, name, email, marks }) => (
            <tr key={id}>
              <td>{name}</td>
              <td>{email}</td>
              <td>{marks}</td>
              <td>{calculateGrade(marks)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;
