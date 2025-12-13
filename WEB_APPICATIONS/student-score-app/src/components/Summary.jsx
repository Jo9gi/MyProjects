const Summary = ({ students }) => {
  const totalStudents = students.length;
  
  if (totalStudents === 0) {
    return (
      <div className="summary">
        <h2>Summary</h2>
        <p>No students to display</p>
      </div>
    );
  }
  
  const marks = students.map(({ marks }) => marks);
  const highest = Math.max(...marks);
  const lowest = Math.min(...marks);
  const average = (marks.reduce((sum, mark) => sum + mark, 0) / totalStudents).toFixed(2);

  return (
    <div className="summary">
      <h2>Summary</h2>
      <div className="summary-stats">
        <div className="stat">
          <span>Total Students:</span>
          <strong>{totalStudents}</strong>
        </div>
        <div className="stat">
          <span>Highest Marks:</span>
          <strong>{highest}</strong>
        </div>
        <div className="stat">
          <span>Lowest Marks:</span>
          <strong>{lowest}</strong>
        </div>
        <div className="stat">
          <span>Class Average:</span>
          <strong>{average}</strong>
        </div>
      </div>
    </div>
  );
};

export default Summary;
